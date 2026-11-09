create extension if not exists pgcrypto;
create table categories(id uuid primary key default gen_random_uuid(), name text unique not null);
create table products(id uuid primary key default gen_random_uuid(), slug text unique not null, name text not null, description text not null default '', category_id uuid references categories, fabric text not null, active boolean not null default false, demonstration boolean not null default true, created_at timestamptz not null default now());
create table product_variants(id uuid primary key default gen_random_uuid(),product_id uuid not null references products on delete cascade,size text not null,colour text not null,pattern text not null default 'Solid',thread_count int check(thread_count>=0),price_paise int not null check(price_paise>0),unique(product_id,size,colour));
create table product_images(id uuid primary key default gen_random_uuid(),product_id uuid not null references products on delete cascade,url text not null,alt text not null,position int not null default 0);
create table inventory(variant_id uuid primary key references product_variants on delete cascade,quantity int not null default 0 check(quantity>=0));
create table customers(id uuid primary key references auth.users on delete cascade,name text);
create table customer_addresses(id uuid primary key default gen_random_uuid(),customer_id uuid not null references customers,details jsonb not null);
create table admin_roles(user_id uuid primary key references auth.users on delete cascade);
create function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from admin_roles where user_id=auth.uid()) $$;
create table orders(id uuid primary key default gen_random_uuid(),customer_id uuid not null references auth.users,status text not null default 'pending' check(status in ('pending','paid','failed','cancelled','fulfilled')),total_paise int not null check(total_paise>0),shipping_paise int not null check(shipping_paise>=0),address jsonb not null,razorpay_order_id text unique,idempotency_key uuid unique not null,created_at timestamptz not null default now());
create table order_items(id uuid primary key default gen_random_uuid(),order_id uuid not null references orders,variant_id uuid not null references product_variants,quantity int not null check(quantity>0),price_paise int not null check(price_paise>0));
create table payments(id uuid primary key default gen_random_uuid(),order_id uuid not null references orders,provider_payment_id text unique not null,status text not null,amount_paise int not null,created_at timestamptz default now());
create table webhook_events(event_id text primary key,received_at timestamptz default now());
create table shipping_records(id uuid primary key default gen_random_uuid(),order_id uuid not null references orders,carrier text,tracking_number text,status text not null default 'preparing');
create table discount_codes(id uuid primary key default gen_random_uuid(),code text unique not null,percent int not null check(percent between 1 and 100),active boolean default false,expires_at timestamptz);
create table reviews(id uuid primary key default gen_random_uuid(),product_id uuid not null references products,customer_id uuid not null references auth.users,rating int not null check(rating between 1 and 5),body text not null,approved boolean not null default false);
create index orders_customer_idx on orders(customer_id,created_at desc);
create index variants_product_idx on product_variants(product_id);
create index images_product_idx on product_images(product_id);
create index order_items_order_idx on order_items(order_id);
do $$ declare t text; begin foreach t in array array['categories','products','product_variants','product_images','inventory','customers','customer_addresses','admin_roles','orders','order_items','payments','shipping_records','discount_codes','reviews','webhook_events'] loop execute format('alter table %I enable row level security',t); execute format('create policy admin_access on %I for all to authenticated using (public.is_admin()) with check (public.is_admin())',t); end loop; end $$;
create policy own_admin_role on admin_roles for select to authenticated using(user_id=auth.uid());
create policy public_categories on categories for select using(true);
create policy public_products on products for select using(active);
create policy public_variants on product_variants for select using(exists(select 1 from products where id=product_id and active));
create policy public_images on product_images for select using(exists(select 1 from products where id=product_id and active));
create policy public_inventory on inventory for select using(exists(select 1 from product_variants v join products p on p.id=v.product_id where v.id=variant_id and p.active));
create policy own_customer on customers for all to authenticated using(id=auth.uid()) with check(id=auth.uid());
create policy own_addresses on customer_addresses for all to authenticated using(customer_id=auth.uid()) with check(customer_id=auth.uid());
create policy own_orders on orders for select to authenticated using(customer_id=auth.uid());
create policy own_items on order_items for select to authenticated using(exists(select 1 from orders where id=order_id and customer_id=auth.uid()));
create policy own_payments on payments for select to authenticated using(exists(select 1 from orders where id=order_id and customer_id=auth.uid()));
create policy own_shipping on shipping_records for select to authenticated using(exists(select 1 from orders where id=order_id and customer_id=auth.uid()));
create policy approved_reviews on reviews for select using(approved or customer_id=auth.uid());
create policy submit_review on reviews for insert to authenticated with check(customer_id=auth.uid() and approved=false);
-- All price calculations and inventory reservations happen in one transaction.
create function reserve_order(p_customer uuid,p_items jsonb,p_address jsonb,p_key uuid) returns orders language plpgsql security definer set search_path=public as $$
declare result orders; line record; v product_variants; amount int:=0; shipping int;
begin
perform pg_advisory_xact_lock(hashtextextended(p_key::text,0));
select * into result from orders where idempotency_key=p_key;
if found then if result.customer_id<>p_customer then raise exception 'Invalid key'; end if; return result; end if;
if jsonb_array_length(p_items)<1 or jsonb_array_length(p_items)>30 then raise exception 'Invalid cart'; end if;
-- Lock inventory in stable order to avoid deadlocks and aggregate duplicate lines.
for line in select (x->>'variant_id')::uuid variant_id,sum((x->>'quantity')::int)::int qty from jsonb_array_elements(p_items) x group by 1 order by 1 loop
if line.qty<1 or line.qty>20 then raise exception 'Invalid quantity'; end if;
select pv.* into strict v from product_variants pv join products p on p.id=pv.product_id where pv.id=line.variant_id and p.active and not p.demonstration;
perform 1 from inventory where variant_id=v.id and quantity>=line.qty for update;
if not found then raise exception 'Insufficient inventory'; end if;
update inventory set quantity=quantity-line.qty where variant_id=v.id;
amount:=amount+v.price_paise*line.qty;
end loop;
shipping:=case when amount>=299900 then 0 else 14900 end;
insert into orders(customer_id,total_paise,shipping_paise,address,idempotency_key) values(p_customer,amount+shipping,shipping,p_address,p_key) returning * into result;
for line in select (x->>'variant_id')::uuid variant_id,sum((x->>'quantity')::int)::int qty from jsonb_array_elements(p_items) x group by 1 loop
insert into order_items(order_id,variant_id,quantity,price_paise) select result.id,id,line.qty,price_paise from product_variants where id=line.variant_id;
end loop;
return result;
end $$;
revoke all on function reserve_order(uuid,jsonb,jsonb,uuid) from public,anon,authenticated;
grant execute on function reserve_order(uuid,jsonb,jsonb,uuid) to service_role;
create function capture_payment(p_event text,p_order text,p_payment text,p_amount int) returns void language plpgsql security definer set search_path=public as $$
declare o orders;
begin
insert into webhook_events(event_id) values(p_event) on conflict do nothing;
if not found then return; end if;
select * into strict o from orders where razorpay_order_id=p_order for update;
if o.total_paise<>p_amount then raise exception 'Payment amount mismatch'; end if;
if o.status='paid' or o.status='fulfilled' then return; end if;
if o.status<>'pending' then raise exception 'Order requires reconciliation'; end if;
insert into payments(order_id,provider_payment_id,status,amount_paise) values(o.id,p_payment,'captured',p_amount);
update orders set status='paid' where id=o.id;
end $$;
revoke all on function capture_payment(text,text,text,int) from public,anon,authenticated;
grant execute on function capture_payment(text,text,text,int) to service_role;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('product-images','product-images',true,5000000,array['image/jpeg','image/png','image/webp']) on conflict do nothing;
create policy public_product_photos on storage.objects for select using(bucket_id='product-images');
create policy admin_product_photos on storage.objects for all to authenticated using(bucket_id='product-images' and public.is_admin()) with check(bucket_id='product-images' and public.is_admin());
