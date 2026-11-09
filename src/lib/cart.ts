import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {products,brand,colours} from './catalogue';
export type CartItem={productId:string;size:string;colour:string;quantity:number;fabric?:string;pattern?:string};
export const itemKey=(i:Omit<CartItem,'quantity'>)=>`${i.productId}:${i.size}:${i.colour}:${i.fabric??products.find(p=>p.id===i.productId)?.fabric}:${i.pattern??products.find(p=>p.id===i.productId)?.pattern}`;
export const useCart=create<{items:CartItem[];add:(i:CartItem)=>void;quantity:(key:string,n:number)=>void;clear:()=>void}>()(persist((set)=>({items:[],add:i=>set(s=>{const p=products.find(p=>p.id===i.productId);if(!p||(i.fabric!==undefined&&i.fabric!==p.fabric)||(i.pattern!==undefined&&i.pattern!==p.pattern)||!colours.some(c=>c.name===i.colour)||!p.sizes.includes(i.size)||!Number.isInteger(i.quantity)||i.quantity<1)return s;const old=s.items.find(x=>itemKey(x)===itemKey(i));return {items:old?s.items.map(x=>itemKey(x)===itemKey(i)?{...x,quantity:Math.min(p.stock,x.quantity+i.quantity)}:x):[...s.items,{...i,quantity:Math.min(p.stock,i.quantity)}]}}),quantity:(key,n)=>{if(!Number.isFinite(n))return;set(s=>({items:s.items.flatMap(i=>itemKey(i)!==key?[i]:n<=0?[]:[{...i,quantity:Math.min(products.find(p=>p.id===i.productId)?.stock??0,Math.max(1,Math.floor(n)))}])}))},clear:()=>set({items:[]})}),{name:'aara-cart-v1',merge:(saved,current)=>{const persisted=saved as {items?:CartItem[]}|null;return {...current,items:Array.isArray(persisted?.items)?persisted.items.filter(i=>i&&products.some(p=>p.id===i.productId&&p.sizes.includes(i.size))):[]}}}));
export function totals(items:CartItem[]){const subtotal=items.reduce((s,i)=>s+(products.find(p=>p.id===i.productId)?.price??0)*i.quantity,0);const shipping=subtotal>0&&subtotal<brand.freeShipping?brand.shipping:0;return {subtotal,shipping,total:subtotal+shipping};}



