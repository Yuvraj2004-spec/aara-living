import {createClient} from 'npm:@supabase/supabase-js@2';
import {z} from 'npm:zod@4.6.7';
const schema=z.object({key:z.string().uuid(),items:z.array(z.object({variant_id:z.string().uuid(),quantity:z.number().int().min(1).max(20)})).min(1).max(30),address:z.object({name:z.string().min(2).max(100),phone:z.string().regex(/^[6-9]\d{9}$/),address:z.string().min(10).max(500),city:z.string().min(2).max(100),pin:z.string().regex(/^[1-9]\d{5}$/)})});
Deno.serve(async req=>{
const origin=Deno.env.get('ALLOWED_ORIGIN');const headers={'Access-Control-Allow-Origin':origin??'','Access-Control-Allow-Headers':'authorization,content-type,apikey','Content-Type':'application/json','Vary':'Origin'};
if(req.headers.get('origin')!==origin)return new Response('Forbidden',{status:403});
if(req.method==='OPTIONS')return new Response(null,{headers});
if(req.method!=='POST')return new Response('Method not allowed',{status:405,headers});
// Deliberately closed until payment lifecycle and abuse controls have passed integration tests.
if(Deno.env.get('ENABLE_LIVE_CHECKOUT')!=='verified')return new Response(JSON.stringify({error:'Live checkout is not enabled'}),{status:503,headers});
try{
if(Number(req.headers.get('content-length')??0)>20000)throw new Error('Invalid payload');
const body=schema.parse(await req.json());
const db=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
const token=req.headers.get('authorization')?.replace(/^Bearer /,'');const {data:{user}}=await db.auth.getUser(token);if(!user)return new Response(JSON.stringify({error:'Sign in required'}),{status:401,headers});
const {data:order,error}=await db.rpc('reserve_order',{p_customer:user.id,p_items:body.items,p_address:body.address,p_key:body.key});if(error)throw error;
let provider=order.razorpay_order_id;
if(!provider){const response=await fetch('https://api.razorpay.com/v1/orders',{method:'POST',headers:{'Authorization':'Basic '+btoa(Deno.env.get('RAZORPAY_KEY_ID')+':'+Deno.env.get('RAZORPAY_KEY_SECRET')),'Content-Type':'application/json'},body:JSON.stringify({amount:order.total_paise,currency:'INR',receipt:order.id})});if(!response.ok)throw new Error('Provider order creation failed');const data=await response.json();provider=data.id;const {error:updateError}=await db.from('orders').update({razorpay_order_id:provider}).eq('id',order.id).is('razorpay_order_id',null);if(updateError)throw updateError;}
return new Response(JSON.stringify({order_id:provider,amount:order.total_paise,currency:'INR',key:Deno.env.get('RAZORPAY_KEY_ID')}),{headers});
}catch(error){console.error(JSON.stringify({event:'checkout_error',message:error instanceof Error?error.message:'Unknown'}));return new Response(JSON.stringify({error:'Unable to create order. Contact support before retrying.'}),{status:400,headers});}
});

