import {it,expect} from 'vitest';
import {demoRoomSuggestions,polygonArea} from './roomSuggestions';
import {colours} from './catalogue';
it('uses valid catalogue colours and excludes the current colour',()=>{
  for(const tone of ['Warm neutrals','Cool neutrals','Colourful'] as const)for(const vibe of ['Calm','Cosy','Bold'] as const){const result=demoRoomSuggestions(tone,vibe,'Sage');expect(result.length).toBeGreaterThan(0);expect(result.every(c=>c.name!=='Sage'&&colours.some(x=>x.name===c.name))).toBe(true)}
});
it('rejects collapsed selections through zero area',()=>{
  expect(polygonArea([{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:0,y:1}])).toBe(1);
  expect(polygonArea([{x:0,y:0},{x:0,y:0},{x:0,y:0},{x:0,y:0}])).toBe(0);
});
