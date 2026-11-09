import {test,expect} from '@playwright/test';

test('homepage bedsheet choices live inside the room and update the bag',async({page})=>{
  await page.goto('/');
  const panel=page.getByRole('complementary',{name:'Configure your bedding'});
  await expect(page.locator('.collection-section')).toHaveCount(0);
  await panel.getByRole('combobox',{name:'Choose your bedsheet'}).selectOption('botanical');
  await expect(panel.getByRole('heading',{name:'Botanical Printed Bedsheet'})).toBeVisible();
  await expect(panel.getByRole('combobox',{name:'Pattern',exact:true})).toHaveValue('Botanical');
  await expect(panel.getByRole('combobox',{name:'Size',exact:true})).toHaveValue('Queen');
  await panel.getByRole('button',{name:'Add to Cart',exact:true}).click();
  await page.getByRole('button',{name:'Shopping bag, 1 items'}).click();
  await expect(page.getByRole('dialog')).toContainText('Botanical Printed Bedsheet');
  await expect(page.getByRole('dialog')).toContainText('Queen / Sage');
  await page.getByRole('button',{name:'Close bag'}).click();
  await page.setViewportSize({width:390,height:844});
  await expect(panel.getByRole('combobox',{name:'Choose your bedsheet'})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('reference prints appear on the bed and cannot be purchased as real products',async({page})=>{
  await page.goto('/');
  const room=page.locator('.photographic-room');
  await expect(room).toHaveAttribute('data-photo-ready','true');
  const canvas=room.locator('canvas');
  let previous=await canvas.evaluate((el:HTMLCanvasElement)=>el.toDataURL());
  for(const pattern of ['Stripes','Gingham','Polka dots','Floral']){
    await page.getByLabel('Explore reference patterns').selectOption(pattern);
    await expect(canvas).toHaveAttribute('aria-label',new RegExp(pattern.toLowerCase()));
    await expect.poll(()=>canvas.evaluate((el:HTMLCanvasElement)=>el.toDataURL())).not.toBe(previous);
    await expect(page.getByRole('button',{name:'Add to Cart',exact:true})).toBeDisabled();
    await expect(page.getByRole('button',{name:'Buy Now',exact:true})).toBeDisabled();
    previous=await canvas.evaluate((el:HTMLCanvasElement)=>el.toDataURL());
  }
  await page.getByLabel('Explore reference patterns').selectOption('');
  await expect(page.getByRole('button',{name:'Add to Cart',exact:true})).toBeEnabled();
});
