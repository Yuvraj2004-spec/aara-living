import {test,expect} from '@playwright/test';
test('budget links enforce prices and product clicks select the room colour and size',async({page})=>{
  for(const [max,count] of [[299,1],[599,2],[799,3],[1299,4],[1599,5]]){
    await page.goto('/');
    await page.getByRole('link',{name:`SHOP UNDER ₹${new Intl.NumberFormat('en-IN').format(max)} Explore bedsheets`,exact:true}).click();
    await expect(page).toHaveURL(new RegExp(`max=${max}`));
    await expect(page.locator('.catalogue-grid .product-card')).toHaveCount(count);
    await page.reload();
    await expect(page.locator('.catalogue-grid .product-card')).toHaveCount(count);
  }
  await page.getByRole('link',{name:'Midnight Cotton Single',exact:true}).click();
  const panel=page.getByRole('complementary',{name:'Configure your bedding'});
  await expect(panel.getByRole('heading',{name:'Midnight Cotton Single'})).toBeVisible();
  await expect(page.locator('.photographic-room')).toHaveAttribute('data-colour','Midnight blue');
  await expect(page.locator('.photographic-room')).toHaveAttribute('data-bed-size','Single');
});
test('deal bar uses the same price as room and cart; budget layout fits mobile',async({page})=>{
  await page.setViewportSize({width:390,height:844});await page.goto('/');
  await expect(page.locator('.daily-deal')).toContainText('Demo offer');
  await expect(page.locator('.daily-deal')).toContainText('₹499');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.getByRole('link',{name:'See it on the bed'}).click();
  const panel=page.getByRole('complementary',{name:'Configure your bedding'});
  await expect(panel.getByRole('heading',{name:'Sage Everyday Single'})).toBeVisible();
  await panel.getByRole('button',{name:'Add to Cart',exact:true}).click();
  await page.getByRole('button',{name:'Shopping bag, 1 items'}).click();
  await expect(page.getByRole('dialog')).toContainText('₹499');
});
