export const referencePatterns=['Stripes','Gingham','Polka dots','Floral'] as const;

/** Illustrative screen-space print masks, not photographed product textures. */
export function drawReferencePattern(ctx:CanvasRenderingContext2D,pattern:string,width:number,height:number){
  ctx.fillStyle='#fff';ctx.strokeStyle='#fff';
  if(pattern==='Stripes'){
    for(let x=0;x<width;x+=32)ctx.fillRect(x,0,7,height);
  }else if(pattern==='Gingham'){
    ctx.globalAlpha=.65;
    for(let x=0;x<width;x+=42)ctx.fillRect(x,0,20,height);
    for(let y=0;y<height;y+=42)ctx.fillRect(0,y,width,20);
    ctx.globalAlpha=1;
  }else if(pattern==='Polka dots'){
    for(let y=0;y<height;y+=35)for(let x=0;x<width;x+=35){ctx.beginPath();ctx.arc(x+(Math.round(y/35)%2)*17,y,3,0,Math.PI*2);ctx.fill()}
  }else if(pattern==='Floral'){
    for(let y=0;y<height;y+=53)for(let x=0;x<width;x+=55){
      ctx.save();ctx.translate(x+(Math.round(y/53)%2)*25,y);
      for(let i=0;i<5;i++){ctx.rotate(Math.PI*2/5);ctx.beginPath();ctx.ellipse(0,5,2.5,5,0,0,Math.PI*2);ctx.fill()}
      ctx.restore();
    }
  }
}
