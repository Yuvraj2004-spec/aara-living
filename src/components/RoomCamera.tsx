import {useEffect,useRef,useState} from 'react';
import {Camera,X,Upload,Check} from 'lucide-react';
import {colours} from '../lib/catalogue';
import {maskedMedian,recolour} from '../lib/photoColour';
import {demoRoomSuggestions,polygonArea,type Point,type RoomTone,type RoomVibe} from '../lib/roomSuggestions';

export default function RoomCamera({selectedColour,onApply}:{selectedColour:string;onApply:(name:string)=>void}){
  const [open,setOpen]=useState(false);
  const trigger=useRef<HTMLButtonElement>(null);
  return <><button ref={trigger} className="room-camera-trigger" onClick={()=>setOpen(true)} aria-haspopup="dialog"><Camera size={20}/><span>Try in your room<small>Camera demo</small></span></button>{open&&<CameraDialog selectedColour={selectedColour} onApply={onApply} close={()=>{setOpen(false);requestAnimationFrame(()=>trigger.current?.focus())}}/>}</>;
}

function CameraDialog({selectedColour,onApply,close}:{selectedColour:string;onApply:(name:string)=>void;close:()=>void}){
  const dialog=useRef<HTMLDialogElement>(null),video=useRef<HTMLVideoElement>(null),canvas=useRef<HTMLCanvasElement>(null);
  const stream=useRef<MediaStream|null>(null),alive=useRef(true),request=useRef(0),image=useRef<ImageData|null>(null);
  const [live,setLive]=useState(false),[starting,setStarting]=useState(false),[hasImage,setHasImage]=useState(false),[points,setPoints]=useState<Point[]>([]);
  const [colour,setColour]=useState(selectedColour),[status,setStatus]=useState('Capture or upload a photo to begin.');
  const [tone,setTone]=useState<RoomTone>('Warm neutrals'),[vibe,setVibe]=useState<RoomVibe>('Calm'),[suggest,setSuggest]=useState(false);
  const colourHex=colours.find(c=>c.name===colour)!.hex;
  const valid=points.length===4&&polygonArea(points)>.001;
  function stop(){request.current++;stream.current?.getTracks().forEach(track=>track.stop());stream.current=null;if(video.current)video.current.srcObject=null;setLive(false);setStarting(false)}
  useEffect(()=>{
    alive.current=true;const previous=document.activeElement as HTMLElement|null;
    dialog.current?.showModal();const overflow=document.body.style.overflow;document.body.style.overflow='hidden';
    return()=>{alive.current=false;request.current++;stream.current?.getTracks().forEach(track=>track.stop());document.body.style.overflow=overflow;previous?.focus()};
  },[]);
  async function startCamera(){
    if(!navigator.mediaDevices?.getUserMedia){setStatus('Camera access needs HTTPS or localhost and a supported browser. You can upload a photo instead.');return}
    stop();const id=++request.current;setStarting(true);setStatus('Requesting camera permission…');
    try{
      const next=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:1280}},audio:false});
      if(!alive.current||id!==request.current){next.getTracks().forEach(track=>track.stop());return}
      stream.current=next;setLive(true);setStarting(false);if(video.current){video.current.srcObject=next;await video.current.play()}
      if(alive.current)setStatus('Frame your bed, then capture a still photo.');
    }catch{if(alive.current&&id===request.current){stop();setStatus('Camera unavailable or permission denied. You can upload a room photo instead.')}}
  }
  function loadPhoto(source:CanvasImageSource,width:number,height:number){
    if(!canvas.current||!width||!height)return;
    const scale=Math.min(1,1280/Math.max(width,height));const target=canvas.current;
    target.width=Math.round(width*scale);target.height=Math.round(height*scale);
    const ctx=target.getContext('2d',{willReadFrequently:true})!;ctx.drawImage(source,0,0,target.width,target.height);
    image.current=ctx.getImageData(0,0,target.width,target.height);setHasImage(true);setPoints([]);stop();setStatus('Tap the four corners of the visible bedsheet in clockwise order.');
  }
  async function upload(file:File|undefined){
    if(!file)return;
    if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>15e6){setStatus('Choose a JPG, PNG or WebP photo under 15 MB.');return}
    const id=++request.current;const url=URL.createObjectURL(file),photo=new Image();
    photo.onload=()=>{URL.revokeObjectURL(url);if(alive.current&&id===request.current)loadPhoto(photo,photo.naturalWidth,photo.naturalHeight)};
    photo.onerror=()=>{URL.revokeObjectURL(url);if(alive.current)setStatus('This image could not be opened. Try a JPG or PNG.')};photo.src=url;
  }
  useEffect(()=>{
    const target=canvas.current,original=image.current;if(!target||!original)return;
    const ctx=target.getContext('2d')!;ctx.putImageData(original,0,0);
    if(valid){
      const mask=document.createElement('canvas');mask.width=target.width;mask.height=target.height;const m=mask.getContext('2d')!;
      m.beginPath();points.forEach((p,i)=>i?m.lineTo(p.x*target.width,p.y*target.height):m.moveTo(p.x*target.width,p.y*target.height));m.closePath();m.fillStyle='#fff';m.fill();
      const maskData=m.getImageData(0,0,target.width,target.height);
      ctx.putImageData(new ImageData(recolour(original.data,maskData.data,colourHex,maskedMedian(original.data,maskData.data)),target.width,target.height),0,0);
    }
    if(points.length){ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x*target.width,p.y*target.height):ctx.moveTo(p.x*target.width,p.y*target.height));if(points.length===4)ctx.closePath();ctx.stroke();points.forEach((p,i)=>{ctx.fillStyle='#414b3b';ctx.beginPath();ctx.arc(p.x*target.width,p.y*target.height,12,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.font='14px sans-serif';ctx.textAlign='center';ctx.fillText(String(i+1),p.x*target.width,p.y*target.height+5)})}
  },[points,colourHex,hasImage,valid]);
  return <dialog className="camera-dialog" ref={dialog} aria-labelledby="camera-title" onCancel={e=>{e.preventDefault();close()}}><div className="camera-dialog-heading"><div><span className="eyebrow">YOUR ROOM · PRIVATE CAMERA DEMO</span><h2 id="camera-title">See how it <em>feels.</em></h2></div><button onClick={close} aria-label="Close room camera"><X/></button></div>
    <p className="camera-explainer">Photos stay in this browser and are discarded when you close. This demo uses a manually selected area and preset colour suggestions. Automatic bed detection and AI room analysis await API integration.</p>
    <div className="camera-layout"><div><div className="camera-stage"><video ref={video} autoPlay playsInline muted hidden={!live}/><canvas ref={canvas} hidden={!hasImage||live} aria-label={`Your room with ${colour} colour preview`} onClick={event=>{if(points.length>=4||!hasImage)return;const r=event.currentTarget.getBoundingClientRect();setPoints(p=>[...p,{x:Math.max(0,Math.min(1,(event.clientX-r.left)/r.width)),y:Math.max(0,Math.min(1,(event.clientY-r.top)/r.height))}])}}/>{!hasImage&&!live&&<div className="camera-placeholder"><Camera size={40}/><p>A new perspective on your room.</p></div>}</div>
    <div className="camera-actions"><button className="button dark" disabled={starting} onClick={startCamera}><Camera size={16}/>{starting?'Starting…':'Start camera'}</button>{live&&<><button className="button" onClick={()=>{const v=video.current;if(v&&v.readyState>=2)loadPhoto(v,v.videoWidth,v.videoHeight);else setStatus('Wait for the camera image to appear.')}}>Capture photo</button><button className="button" onClick={stop}>Stop camera</button></>}<label className="button camera-upload"><Upload size={16}/>Upload photo<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>{void upload(e.target.files?.[0]);e.target.value=''}}/></label></div>
    <p role="status" aria-live="polite">{points.length?`${points.length}/4 corners marked. ${points.length===4?(valid?'Colour preview ready.':'Area too small; reset and try again.'):status}`:status}</p>{hasImage&&<div className="camera-actions"><button className="text-link" onClick={()=>{setPoints([]);setStatus('Tap four corners clockwise.')}}>Reset selection</button><button className="text-link" onClick={()=>setPoints(p=>p.slice(0,-1))} disabled={!points.length}>Undo corner</button></div>}
    <small>Approximate colour visualisation. The selected area can include objects and existing prints; perspective, fabric patterns and exact colour matching are not simulated.</small></div>
    <div className="camera-options"><h3>Try a bedsheet colour</h3><div className="camera-colours">{colours.map(c=><button key={c.name} aria-pressed={colour===c.name} onClick={()=>setColour(c.name)}><i style={{background:c.hex}}/>{c.name}{colour===c.name&&<Check size={13}/>}</button>)}</div><label>Room palette<select value={tone} onChange={e=>{setTone(e.target.value as RoomTone);setSuggest(false)}}>{['Warm neutrals','Cool neutrals','Colourful'].map(t=><option key={t}>{t}</option>)}</select></label><label>Desired mood<select value={vibe} onChange={e=>{setVibe(e.target.value as RoomVibe);setSuggest(false)}}>{['Calm','Cosy','Bold'].map(v=><option key={v}>{v}</option>)}</select></label><button className="button full" onClick={()=>setSuggest(true)}>Explore demo suggestions</button>{suggest&&<div className="camera-suggestions"><p>Preset suggestions for your chosen palette and mood.</p>{demoRoomSuggestions(tone,vibe,colour).map(c=><button key={c.name} onClick={()=>setColour(c.name)}><i style={{background:c.hex}}/><span>Try {c.name}<small>{c.reason}</small></span></button>)}</div>}<button className="button dark full" onClick={()=>{onApply(colour);close()}}>Use {colour} in showroom</button><small>Applies the colour to your current product selection.</small></div></div>
  </dialog>;
}
