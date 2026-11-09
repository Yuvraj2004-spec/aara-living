import {test,expect} from '@playwright/test';
test('photographic room preserves its environment while all bedding colours change',async({page})=>{
 await page.goto('/');await expect(page.locator('[data-photo-ready="true"]')).toBeVisible();
 await page.locator('#showroom').scrollIntoViewIfNeeded();
 const read=()=>page.locator('.photographic-room canvas').evaluate((node:HTMLCanvasElement)=>{const ctx=node.getContext('2d')!;const pixel=(x:number,y:number)=>Array.from(ctx.getImageData(Math.round(node.width*x),Math.round(node.height*y),1,1).data);return {wall:pixel(.4,.12),lamp:pixel(.39,.25),sheet:pixel(.5,.55),pillow:pixel(.57,.35)}});
 const original=await read();let previous=original;
 await page.screenshot({path:'test-results/photo-sage.png'});
 for(const colour of ['Ivory','Terracotta','Midnight blue','Charcoal','Dusty rose','Sage']){
  await page.getByRole('button',{name:colour,exact:true}).click();await expect(page.locator('.photographic-room')).toHaveAttribute('data-colour',colour);
  await expect.poll(async()=>JSON.stringify((await read()).sheet)).not.toBe(JSON.stringify(previous.sheet));
  const current=await read();expect(current.wall).toEqual(original.wall);expect(current.lamp).toEqual(original.lamp);expect(current.pillow).not.toEqual(previous.pillow);previous=current;
 }
 await page.getByRole('button',{name:'Terracotta',exact:true}).click();await page.screenshot({path:'test-results/photo-terracotta.png'});

 await page.setViewportSize({width:390,height:844});await page.evaluate(()=>document.querySelector('#showroom')!.scrollIntoView({block:'start'}));await page.screenshot({path:'test-results/photo-mobile.png'});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});





