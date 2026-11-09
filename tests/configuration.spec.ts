import {test,expect} from '@playwright/test';
test('showroom configuration uses catalogue variants and persists them into the bag',async({page})=>{
 await page.goto('/');const panel=page.getByRole('complementary',{name:'Configure your bedding'});
 await panel.getByRole('combobox',{name:'Pattern',exact:true}).selectOption('Botanical');
 await expect(panel.getByRole('heading')).toHaveText('Botanical Printed Bedsheet');
 await expect(panel.getByRole('combobox',{name:'Size',exact:true})).toHaveValue('Queen');
 await panel.getByRole('combobox',{name:'Size',exact:true}).selectOption('Single');
 await panel.getByRole('button',{name:'Terracotta',exact:true}).click();
 await panel.getByRole('button',{name:'Increase showroom quantity'}).click();
 await panel.getByRole('button',{name:'Add to Cart',exact:true}).click();
 await page.getByRole('button',{name:'Shopping bag, 2 items'}).click();
 await expect(page.getByRole('dialog')).toContainText('Single / Terracotta · Cotton · Botanical');
 await expect(page.getByRole('dialog')).toContainText('₹4,398');
 await page.getByRole('button',{name:'Close bag'}).click();
 await panel.getByRole('combobox',{name:'Fabric',exact:true}).selectOption('Premium cotton');
 await expect(panel.getByRole('combobox',{name:'Pattern',exact:true})).toHaveValue('Solid');
 await expect(panel.getByRole('combobox',{name:'Size',exact:true})).toHaveValue('King');
});
test('reduced motion keeps shopping available without downloading 3D assets',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});const assets:string[]=[];page.on('request',r=>{if(r.url().includes('/showroom/')&&/\.(hdr|gltf|glb)/.test(r.url()))assets.push(r.url())});
 await page.goto('/');const panel=page.getByRole('complementary',{name:'Configure your bedding'});await expect(panel.getByRole('button',{name:'Add to Cart',exact:true})).toBeVisible();await expect(page.locator('[data-photo-ready=true]')).toBeVisible();await expect(page.getByRole('button',{name:'Pause room motion'})).toHaveCount(0);expect(assets).toEqual([]);
});


