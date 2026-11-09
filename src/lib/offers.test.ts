import {expect,it} from 'vitest';
import {budgetFromSearch,budgets,roomLink,savingPercent} from './offers';
import {products,filterProducts,defaultFilters} from './catalogue';
it('validates budget URLs and keeps every result within budget',()=>{
  expect(budgetFromSearch('?max=abc')).toBe(5000);
  expect(budgetFromSearch('?max=-1')).toBe(5000);
  expect(budgetFromSearch('?max=599')).toBe(599);
  for(const max of budgets){const matches=filterProducts(products,{...defaultFilters,max},'low');expect(matches.length).toBeGreaterThan(0);expect(matches.every(p=>p.price<=max)).toBe(true)}
});
it('links the selected product to its actual colour and size and calculates sample savings',()=>{
  const p=products.find(p=>p.id==='sage-essential-demo')!;
  const url=new URL(roomLink(p),'https://example.com');
  expect(url.searchParams.get('colour')).toBe('Sage');expect(url.searchParams.get('size')).toBe('Single');
  expect(savingPercent(p)).toBe(38);expect(savingPercent(products[0])).toBe(0);
});
