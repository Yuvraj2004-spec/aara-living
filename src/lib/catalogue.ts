export const brand = {name:'Aara', descriptor:'LIVING', shipping:149, freeShipping:2999};
export const colours = [{name:'Ivory',hex:'#e6ddc9'},{name:'Sage',hex:'#87917c'},{name:'Dusty rose',hex:'#bd9390'},{name:'Terracotta',hex:'#b66b50'},{name:'Midnight blue',hex:'#35465d'},{name:'Charcoal',hex:'#555454'}];
export type Product = {id:string;name:string;category:string;fabric:string;price:number;image:string;colour:string;pattern:string;threadCount:number;stock:number;sizes:string[];featured:boolean;createdAt?:string;bedroomTexture?:string;compareAtPrice?:number;demoOffer?:boolean};
const photo=(id:string)=>`https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=85`;
export const roomImage=photo('photo-1611892440504-42a792e24d32');
export const products:Product[]=[
{id:'everyday-sateen',createdAt:'2026-10-01',name:'The Everyday Sateen Set',category:'Bedsheets',fabric:'Premium cotton',price:3499,image:photo('photo-1631049307264-da0ec9d70304'),colour:'Ivory',pattern:'Solid',threadCount:400,stock:12,sizes:['King','Queen'],featured:true},
{id:'sage-cotton',createdAt:'2026-10-03',name:'Sage Cotton Bedsheet',category:'Bedsheets',fabric:'Cotton',price:1899,image:photo('photo-1615874959474-d609969a20ed'),colour:'Sage',pattern:'Solid',threadCount:300,stock:18,sizes:['King','Queen','Single'],featured:true},
{id:'botanical',createdAt:'2026-10-10',name:'Botanical Printed Bedsheet',category:'Bedsheets',fabric:'Cotton',price:2199,image:photo('photo-1616594039964-ae9021a400a0'),colour:'Sage',pattern:'Botanical',threadCount:250,stock:10,sizes:['Queen','Single'],featured:false},
{id:'ivory-essential-demo',name:'Ivory Everyday Single',category:'Bedsheets',fabric:'Cotton',price:249,compareAtPrice:399,demoOffer:true,image:'/showroom/warm-room-single.png',colour:'Ivory',pattern:'Solid',threadCount:150,stock:8,sizes:['Single'],featured:false},
{id:'sage-essential-demo',name:'Sage Everyday Single',category:'Bedsheets',fabric:'Cotton',price:499,compareAtPrice:799,demoOffer:true,image:'/showroom/warm-room-single.png',colour:'Sage',pattern:'Solid',threadCount:180,stock:10,sizes:['Single'],featured:false},
{id:'rose-essential-demo',name:'Dusty Rose Cotton Single',category:'Bedsheets',fabric:'Cotton',price:699,compareAtPrice:999,demoOffer:true,image:'/showroom/warm-room-single.png',colour:'Dusty rose',pattern:'Solid',threadCount:200,stock:9,sizes:['Single'],featured:false},
{id:'terracotta-essential-demo',name:'Terracotta Cotton Single',category:'Bedsheets',fabric:'Cotton',price:1199,compareAtPrice:1599,demoOffer:true,image:'/showroom/warm-room-single.png',colour:'Terracotta',pattern:'Solid',threadCount:220,stock:7,sizes:['Single'],featured:false},
{id:'midnight-essential-demo',name:'Midnight Cotton Single',category:'Bedsheets',fabric:'Cotton',price:1499,compareAtPrice:1999,demoOffer:true,image:'/showroom/warm-room-single.png',colour:'Midnight blue',pattern:'Solid',threadCount:250,stock:6,sizes:['Single'],featured:false},
];
export const money=(value:number)=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(value);
export type Filters={category:string;fabric:string;colour:string;size:string;pattern:string;max:number;available:boolean;thread:number};
export const defaultFilters:Filters={category:'All',fabric:'All',colour:'All',size:'All',pattern:'All',max:5000,available:false,thread:0};
export function filterProducts(items:Product[],f:Filters,sort:string,query=''){return items.filter(p=>(f.category==='All'||p.category===f.category)&&(f.fabric==='All'||p.fabric===f.fabric)&&(f.colour==='All'||p.colour===f.colour)&&(f.size==='All'||p.sizes.includes(f.size))&&(f.pattern==='All'||p.pattern===f.pattern)&&p.price<=f.max&&(!f.available||p.stock>0)&&p.threadCount>=f.thread&&p.name.toLowerCase().includes(query.toLowerCase())).sort((a,b)=>sort==='low'?a.price-b.price:sort==='high'?b.price-a.price:sort==='newest'?(b.createdAt??'').localeCompare(a.createdAt??''):Number(b.featured)-Number(a.featured));}




