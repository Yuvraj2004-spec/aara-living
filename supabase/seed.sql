-- Demonstration only. Not available for live payment reservations.
insert into categories(name) values ('Bedsheets'),('Bedding sets'),('Blankets'),('Comforters'),('Pillow covers');
insert into products(slug,name,fabric,category_id,active,demonstration) select 'everyday-sateen','The Everyday Sateen Set','Premium cotton',id,true,true from categories where name='Bedding sets';
insert into product_variants(product_id,size,colour,price_paise,thread_count) select p.id,s,c,349900,400 from products p cross join unnest(array['King','Queen']) s cross join unnest(array['Ivory','Sage','Dusty rose','Terracotta','Midnight blue','Charcoal']) c;
insert into inventory(variant_id,quantity) select id,12 from product_variants;
