import {test,expect} from '@playwright/test';
test('camera demo handles denied permissions, local photo preview and colour application',async({page})=>{
  await page.addInitScript(()=>{Object.defineProperty(navigator.mediaDevices,'getUserMedia',{value:()=>Promise.reject(new DOMException('Denied','NotAllowedError'))})});
  await page.goto('/');await page.getByRole('button',{name:/Try in your room/}).click();
  const dialog=page.getByRole('dialog',{name:'See how it feels.'});
  await expect(dialog).toContainText('Automatic bed detection and AI room analysis await API integration.');
  await dialog.getByRole('button',{name:'Start camera',exact:true}).click();
  await expect(dialog.getByRole('status')).toContainText('permission denied');
  await dialog.locator('input[type=file]').setInputFiles('public/showroom/photographic-room.png');
  const canvas=dialog.locator('canvas');await expect(canvas).toBeVisible();
  const bounds=await canvas.boundingBox();expect(bounds).not.toBeNull();
  for(const [x,y] of [[.3,.45],[.7,.45],[.8,.85],[.2,.85]])await canvas.click({position:{x:bounds!.width*x,y:bounds!.height*y}});
  await expect(dialog.getByRole('status')).toContainText('Colour preview ready');
  const before=await canvas.evaluate((el:HTMLCanvasElement)=>el.toDataURL());
  await dialog.getByRole('button',{name:'Terracotta',exact:true}).click();
  await expect.poll(()=>canvas.evaluate((el:HTMLCanvasElement)=>el.toDataURL())).not.toBe(before);
  await dialog.getByRole('button',{name:'Explore demo suggestions'}).click();
  await expect(dialog).toContainText('Preset suggestions');
  await dialog.getByRole('button',{name:'Use Terracotta in showroom'}).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.locator('.photographic-room')).toHaveAttribute('data-colour','Terracotta');
});

test('closing camera stops live tracks and mobile modal fits',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.addInitScript(()=>{
    (window as unknown as {stops:number}).stops=0;
    Object.defineProperty(navigator.mediaDevices,'getUserMedia',{value:async()=>{
      const source=document.createElement('canvas');source.width=320;source.height=240;
      const stream=source.captureStream();for(const track of stream.getTracks()){const original=track.stop.bind(track);track.stop=()=>{(window as unknown as {stops:number}).stops++;original()}}return stream;
    }});
  });
  await page.goto('/');await page.getByRole('button',{name:/Try in your room/}).click();
  const dialog=page.getByRole('dialog');
  await dialog.getByRole('button',{name:'Start camera',exact:true}).click();
  await expect(dialog.getByRole('button',{name:'Stop camera',exact:true})).toBeVisible();
  expect(await dialog.evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
  await dialog.getByRole('button',{name:'Close room camera'}).click();
  expect(await page.evaluate(()=>(window as unknown as {stops:number}).stops)).toBeGreaterThan(0);
  await expect(page.getByRole('button',{name:/Try in your room/})).toBeFocused();
});
