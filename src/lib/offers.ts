import {type Product} from './catalogue';
export const budgets=[299,599,799,1299,1599];
export function budgetFromSearch(search:string){
  const raw=new URLSearchParams(search).get('max');
  if(!raw)return 5000;
  const value=Number(raw);
  return Number.isFinite(value)&&value>=0&&value<=5000?value:5000;
}
export function roomLink(p:Product,colour=p.colour){
  return `/?${new URLSearchParams({product:p.id,colour,size:p.sizes[0]})}#showroom`;
}
export function savingPercent(p:Product){
  return p.compareAtPrice&&p.compareAtPrice>p.price?Math.round((1-p.price/p.compareAtPrice)*100):0;
}
