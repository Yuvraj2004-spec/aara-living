import {colours} from './catalogue';
export type RoomTone='Warm neutrals'|'Cool neutrals'|'Colourful';
export type RoomVibe='Calm'|'Cosy'|'Bold';
// Explicit demo presets. Replace behind a server adapter when AI credentials exist.
export function demoRoomSuggestions(tone:RoomTone,vibe:RoomVibe,current:string){
  const choices=vibe==='Bold'?['Midnight blue','Terracotta','Charcoal']:vibe==='Cosy'?['Terracotta','Ivory','Dusty rose']:tone==='Cool neutrals'?['Dusty rose','Ivory','Sage']:tone==='Colourful'?['Ivory','Charcoal','Sage']:['Sage','Ivory','Midnight blue'];
  return choices.filter(name=>name!==current).map(name=>({...colours.find(c=>c.name===name)!,reason:vibe==='Bold'?'A deeper accent to try.':vibe==='Cosy'?'A warmer, softer palette to explore.':'A quieter palette to explore.'}));
}
export type Point={x:number;y:number};
export function polygonArea(points:Point[]){return Math.abs(points.reduce((sum,p,i)=>{const next=points[(i+1)%points.length];return sum+p.x*next.y-next.x*p.y},0))/2}
