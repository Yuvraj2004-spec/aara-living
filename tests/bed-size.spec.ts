import {test,expect} from '@playwright/test';
test('size selector swaps the visible bed and preserves colour, pattern and cart size',async({page})=>{
 await page.goto('/');const room=page.locator('.photographic-room'),panel=page.getByRole('complementary',{name:'Configure your bedding'});
 await expect(room).toHaveAttribute('data-photo-ready','true');await panel.getByRole('button',{name:'Terracotta',exact:true}).click();
 const image=room.locator('img'),canvas=room.locator('canvas');
 let last=await canvas.evaluate((el:HTMLCanvasElement)=>el.toDataURL());
 for(const size of ['Queen','Single','King']){
  await panel.getByRole('combobox',{name:'Size',exact:true}).selectOption(size);
  await expect(room).toHaveAttribute('data-bed-size',size);await expect(room).toHaveAttribute('data-photo-ready','true');
  await expect.poll(()=>canvas.evaluate((el:HTMLCanvasElement)=>{const p=el.getContext('2d')!.getImageData(el.width/2,el.height/2,1,1).data;return p[3]===255?el.toDataURL():''})).not.toBe(last);
  await expect(canvas).toHaveAttribute('aria-label',new RegExp(size+' bed with Terracotta'));
  await expect(image).toHaveAttribute('src',`/showroom/warm-room-${size.toLowerCase()}.png`);
  await room.screenshot({path:`test-results/bed-${size.toLowerCase()}.png`});last=await canvas.evaluate((el:HTMLCanvasElement)=>el.toDataURL());
 }
 await panel.getByRole('combobox',{name:'Pattern',exact:true}).selectOption('Botanical');await panel.getByRole('combobox',{name:'Size',exact:true}).selectOption('Single');await expect(panel.getByRole('combobox',{name:'Pattern',exact:true})).toHaveValue('Botanical');await expect(room).toHaveAttribute('data-bed-size','Single');await panel.getByRole('button',{name:'Add to Cart',exact:true}).click();await page.getByRole('button',{name:'Shopping bag, 1 items'}).click();await expect(page.getByRole('dialog')).toContainText('Single / Terracotta · Cotton · Botanical');
});

test('product page preview retains the chosen bed size',async({page})=>{
 await page.goto('/product/sage-cotton');await page.getByRole('button',{name:'Single',exact:true}).click();await page.getByRole('link',{name:'View in bedroom'}).click();const room=page.locator('.photographic-room');await expect(room).toHaveAttribute('data-bed-size','Single');await expect(room).toHaveAttribute('data-photo-ready','true');await expect(page.locator('#room-size')).toHaveValue('Single');
});

test('Queen has its own preview and scrolling does not zoom the room',async({page})=>{
 await page.goto('/#showroom');const panel=page.getByRole('complementary',{name:'Configure your bedding'});await panel.getByRole('combobox',{name:'Size',exact:true}).selectOption('Queen');
 const room=page.locator('.photographic-room');await expect(room).toHaveAttribute('data-bed-size','Queen');await expect(room).toHaveAttribute('data-photo-ready','true');await expect(room.locator('img')).toHaveAttribute('src','/showroom/warm-room-queen.png');
 const transform=()=>page.locator('.photographic-room-image').evaluate(el=>getComputedStyle(el).transform);
 expect(await transform()).toBe('none');const top=await page.locator('#showroom').evaluate(el=>el.getBoundingClientRect().top+scrollY);await page.evaluate(y=>scrollTo(0,y+300),top);expect(await transform()).toBe('none');await expect(page.getByRole('button',{name:'Pause room motion'})).toHaveCount(0);await expect(page.locator('.fabric-editorial')).toHaveCount(0);
});
