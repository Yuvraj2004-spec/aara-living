import {test,expect} from '@playwright/test';

test('real embedding model loads and searches in browser',async({page})=>{
  test.skip(!process.env.RUN_MODEL_TEST,'Opt-in network/model download smoke test');
  test.setTimeout(180000);
  await page.goto('/collection');
  await page.getByLabel('Search by meaning').check();
  await page.getByLabel('What are you looking for?').fill('botanical print');
  await expect(page.getByText(/Sorted by meaning.*Your filters still apply/)).toBeVisible({timeout:160000});
  await expect(page.locator('.product-card').first()).toContainText('Botanical');
});

test('meaning ranking preserves exact filters and clear search restores catalogue',async({page})=>{
  // Tests UI integration, not actual model quality or network downloads.
  await page.addInitScript(()=>{
    class StubWorker{
      onmessage:((event:{data:unknown})=>void)|null=null;
      postMessage(message:{id:number}){setTimeout(()=>this.onmessage?.({data:{id:message.id,status:'ready',matches:[{id:'botanical',score:.8},{id:'sage-cotton',score:.6},{id:'everyday-sateen',score:.2}]}}),20)}
      terminate(){}
    }
    Object.defineProperty(window,'Worker',{value:StubWorker});
  });
  await page.goto('/collection');
  await page.getByLabel('Search by meaning').check();
  await page.getByLabel('What are you looking for?').fill('leaf print');
  await expect(page.getByText(/Sorted by meaning.*Your filters still apply/)).toBeVisible();
  await expect(page.locator('.product-card').first()).toContainText('Botanical');
  await page.getByRole('combobox',{name:'size',exact:true}).selectOption('King');
  await expect(page.locator('.product-card')).toHaveCount(2);
  await expect(page.locator('.product-card').first()).toContainText('Sage Cotton');
  await page.getByRole('button',{name:'Clear search',exact:true}).click();
  await expect(page.getByRole('combobox',{name:'Sort products'})).toBeEnabled();
});

test('failed model falls back to keyword results',async({page})=>{
  await page.addInitScript(()=>{Object.defineProperty(window,'Worker',{value:class{constructor(){throw new Error('Unavailable')}}})});
  await page.goto('/collection');
  await page.getByLabel('Search by meaning').check();
  await page.getByLabel('What are you looking for?').fill('Sateen');
  await expect(page.getByText(/Meaning search is unavailable/)).toBeVisible();
  await expect(page.locator('.product-card')).toHaveCount(1);
});
