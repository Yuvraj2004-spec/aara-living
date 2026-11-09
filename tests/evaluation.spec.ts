import {test,expect} from '@playwright/test';
test('evaluation reports all examples and exports reproducible results',async({page})=>{
  await page.addInitScript(()=>{
    class StubWorker{
      onmessage:((event:{data:unknown})=>void)|null=null;
      postMessage(message:{id:number}){setTimeout(()=>this.onmessage?.({data:{id:message.id,status:'ready',matches:[{id:'sage-cotton',score:.8},{id:'botanical',score:.6},{id:'everyday-sateen',score:.2}]}}),10)}
      terminate(){}
    }
    Object.defineProperty(window,'Worker',{value:StubWorker});
  });
  await page.goto('/search-evaluation');
  await page.getByRole('button',{name:'Run evaluation'}).click();
  await expect(page.getByRole('status')).toContainText('Complete.');
  await expect(page.locator('tbody tr')).toHaveCount(8);
  await expect(page.getByRole('columnheader',{name:'BM25 ranking'})).toBeVisible();
  await expect(page.getByRole('columnheader',{name:'Hybrid ranking'})).toBeVisible();
  await expect(page.getByText('Unrelated-query check:',{exact:false})).toContainText('irrelevant products');
  const download=page.waitForEvent('download');
  await page.getByRole('button',{name:'Download JSON results'}).click();
  expect((await download).suggestedFilename()).toBe('search-evaluation.json');
});
