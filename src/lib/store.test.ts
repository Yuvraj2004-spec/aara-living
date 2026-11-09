import {describe,it,expect,beforeEach} from 'vitest';
import {filterProducts,products,defaultFilters} from './catalogue';
import {useCart,totals,itemKey} from './cart';
describe('catalogue',()=>{it('combines actual size, colour and budget constraints',()=>{const result=filterProducts(products,{...defaultFilters,size:'Single',colour:'Sage',max:2000},'low');expect(result.map(p=>p.id)).toEqual(['sage-essential-demo','sage-cotton'])});it('sorts prices',()=>{const result=filterProducts(products,defaultFilters,'low');expect(result[0].price).toBe(249);expect(result.at(-1)?.price).toBe(3499)})});
describe('bag',()=>{beforeEach(()=>useCart.getState().clear());it('merges matching variants and clamps stock',()=>{const item={productId:'everyday-sateen',size:'King',colour:'Ivory',quantity:10};useCart.getState().add(item);useCart.getState().add(item);expect(useCart.getState().items[0].quantity).toBe(12)});it('keeps different variants separate and removes quantities of zero',()=>{const item={productId:'sage-cotton',size:'King',colour:'Sage',quantity:1};useCart.getState().add(item);useCart.getState().add({...item,size:'Queen'});expect(useCart.getState().items).toHaveLength(2);useCart.getState().quantity(itemKey(item),0);expect(useCart.getState().items).toHaveLength(1)});it('calculates the shipping threshold',()=>{expect(totals([{productId:'sage-cotton',size:'Single',colour:'Ivory',quantity:1}]).total).toBe(2048);expect(totals([{productId:'everyday-sateen',size:'King',colour:'Ivory',quantity:1}]).shipping).toBe(0)})});


it('removes discontinued non-bedsheet items from an existing saved bag',async()=>{
 localStorage.setItem('aara-cart-v1',JSON.stringify({state:{items:[{productId:'waffle-throw',size:'King',colour:'Terracotta',quantity:1},{productId:'sage-cotton',size:'Queen',colour:'Sage',quantity:1}]},version:0}));
 await useCart.persist.rehydrate();expect(useCart.getState().items.map(i=>i.productId)).toEqual(['sage-cotton']);useCart.getState().clear();
});
