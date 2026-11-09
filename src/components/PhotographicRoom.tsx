import type {RoomView} from './RoomExperience';
import {useEffect,useRef,useState} from 'react';


import {maskedMedian,recolour} from '../lib/photoColour';
import {bedPreviews} from './photoMask';
import {drawReferencePattern,referencePatterns} from '../lib/referencePatterns';


type LoadedRoom={pixels:ImageData;mask:ImageData;reference:number;width:number;height:number};
export default function PhotographicRoom({colour,colourName,pattern,motion,view,size="King"}:{colour:string;colourName:string;pattern:string;motion:boolean;view?:RoomView;size?:string}){
 const preview=bedPreviews[size]??bedPreviews.King;const sourceUrl=preview.image;
 const [loadVersion,setLoadVersion]=useState(0);
 const canvas=useRef<HTMLCanvasElement>(null),visual=useRef<HTMLDivElement>(null),room=useRef<LoadedRoom|null>(null);
 const [ready,setReady]=useState(false),[error,setError]=useState(false);
 useEffect(()=>{let active=true;setReady(false);setError(false);room.current=null;const img=new Image();img.onload=()=>{if(!active||!canvas.current)return;
  const width=Math.min(1536,img.naturalWidth),height=Math.round(width*img.naturalHeight/img.naturalWidth);
  const source=document.createElement('canvas');source.width=width;source.height=height;const ctx=source.getContext('2d',{willReadFrequently:true})!;ctx.drawImage(img,0,0,width,height);const pixels=ctx.getImageData(0,0,width,height);
  ctx.clearRect(0,0,width,height);ctx.save();ctx.scale(width,height);ctx.fillStyle='#fff';for(const path of preview.paths)ctx.fill(new Path2D(path));ctx.restore();const mask=ctx.getImageData(0,0,width,height);
  room.current={pixels,mask,reference:maskedMedian(pixels.data,mask.data),width,height};canvas.current.width=width;canvas.current.height=height;setLoadVersion(v=>v+1);setReady(true);
 };img.onerror=()=>{if(active)setError(true)};img.src=sourceUrl;return()=>{active=false;room.current=null}},[sourceUrl,preview]);
 useEffect(()=>{if(!ready||!room.current||!canvas.current)return;const {pixels,mask,reference,width,height}=room.current;
  let print:Uint8ClampedArray|undefined;
  if(pattern==='Botanical'){const tile=document.createElement('canvas');tile.width=width;tile.height=height;const ctx=tile.getContext('2d')!;ctx.fillStyle='#fff';for(let y=height*.4;y<height;y+=34)for(let x=0;x<width;x+=43){ctx.save();ctx.translate(x+Math.sin(y*.03)*7,y);ctx.rotate(-.5+Math.sin(x*.1)*.25);ctx.beginPath();ctx.ellipse(0,0,3,8,0,0,Math.PI*2);ctx.fill();ctx.restore()}print=ctx.getImageData(0,0,width,height).data}
  if(referencePatterns.some(p=>p===pattern)){const tile=document.createElement('canvas');tile.width=width;tile.height=height;const ctx=tile.getContext('2d')!;drawReferencePattern(ctx,pattern,width,height);print=ctx.getImageData(0,0,width,height).data}
  const result=new ImageData(recolour(pixels.data,mask.data,colour,reference,print),width,height);canvas.current.getContext('2d')!.putImageData(result,0,0);
 },[ready,colour,pattern,loadVersion]);
 return <div className="photographic-room" data-photo-ready={ready} data-colour={colourName} data-bed-size={size}>
  <div ref={visual} className="photographic-room-image"><img src={sourceUrl} fetchPriority="high" alt={`${size} bed in the furnished concept bedroom`}/><canvas ref={canvas} role="img" aria-label={`${size} bed with ${colourName} ${pattern.toLowerCase()} bedding in the photographic room`} style={{opacity:ready?1:0}}/></div>
  {!ready&&!error&&<div className="photo-status" role="status">Preparing your room…</div>}
  {error&&<p className="room-render-error" role="alert">Room preview unavailable. Your bedding selection is still available.</p>}
  <span className="photographic-disclosure">Concept size preview · proportions illustrative, not product dimensions</span>
 </div>
}





