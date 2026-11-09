import {createClient} from 'npm:@supabase/supabase-js@2';
Deno.serve(async req=>{
if(req.method!=='POST')return new Response('Method not allowed',{status:405});
const secret=Deno.env.get('RAZORPAY_WEBHOOK_SECRET');if(!secret)return new Response('Unavailable',{status:503});
const raw=await req.text();if(raw.length>100000)return new Response('Too large',{status:413});
const provided=req.headers.get('x-razorpay-signature')??'';
const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['verify']);
if(!/^[a-f0-9]{64}$/.test(provided))return new Response('Invalid signature',{status:401});
const bytes=Uint8Array.from(provided.match(/../g)!,h=>parseInt(h,16));
if(!await crypto.subtle.verify('HMAC',key,bytes,new TextEncoder().encode(raw)))return new Response('Invalid signature',{status:401});
try{const body=JSON.parse(raw);if(body.event!=='payment.captured')return new Response('Ignored');const p=body.payload.payment.entity;const event=req.headers.get('x-razorpay-event-id');if(!event||p.currency!=='INR'||p.status!=='captured')return new Response('Invalid event',{status:400});const db=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);const {error}=await db.rpc('capture_payment',{p_event:event,p_order:p.order_id,p_payment:p.id,p_amount:p.amount});if(error)throw error;return new Response('OK');}catch{console.error(JSON.stringify({event:'webhook_processing_failed'}));return new Response('Retry later',{status:500});}
});
