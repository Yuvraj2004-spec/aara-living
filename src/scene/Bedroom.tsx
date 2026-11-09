import type {RoomView} from '../components/RoomExperience';
import {AssetBoundary,ReplacementRoom,replacementModelUrl} from './ReplacementRoom';
import {Suspense,useEffect,useMemo,useRef,useState} from 'react';
import {Canvas,useFrame,useThree} from '@react-three/fiber';
import {ContactShadows,Environment,AdaptiveDpr} from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {Architecture,Furniture,Plant} from './Room';
import {Textiles} from './Textiles';
import {useShowroomMaterials} from './materials';

gsap.registerPlugin(ScrollTrigger);
function ModelUnavailable():never{throw new Error("The supplied showroom GLB could not be loaded or validated")}
function CameraChoreography({view}:{view?:RoomView}){
  const {camera,size,invalidate}=useThree();
  const aim=useMemo(()=>({x:0,y:1.3,z:0}),[]);
  useEffect(()=>{
    const mobile=size.width<700;
    camera.position.set(mobile?7:5.6,mobile?4.1:3.4,mobile?13:10);
    aim.x=0;aim.y=1.3;aim.z=0;
    const context=gsap.context(()=>{
      const timeline=gsap.timeline({onUpdate:invalidate,scrollTrigger:{trigger:'.showroom',start:'top top',end:'bottom bottom',scrub:1.4,invalidateOnRefresh:true}});
      timeline.to({}, {duration:.4}).to(camera.position,{x:4.2,y:2.9,z:7.4,duration:1.2,ease:'none'},.4).to(camera.position,{x:2,y:2.0,z:4.6,duration:1.2,ease:'none'},1.6);    });ScrollTrigger.refresh();return()=>context.revert();
  },[camera,size.width,size.height,aim,invalidate]);
  useEffect(()=>{if(!view||view.revision===0)return;const position=view.mode==='fabric'?{x:2,y:2,z:4.6}:{x:size.width<700?7:5.6,y:size.width<700?4.1:3.4,z:size.width<700?13:10};const tween=gsap.to(camera.position,{...position,duration:.65,ease:'power2.out',onUpdate:invalidate,overwrite:false});return()=>{tween.kill()}},[view,camera,size.width,invalidate]);
  useFrame(()=>camera.lookAt(aim.x,aim.y,aim.z));return null;
}
function LuxuryRoom({colour,pattern,textureUrl,quality,onReady,view,strictModel}:{colour:string;pattern:string;textureUrl?:string;quality:string;onReady:()=>void;view?:RoomView;strictModel?:boolean}){
  const materials=useShowroomMaterials();
  const gl=useThree(s=>s.gl),invalidate=useThree(s=>s.invalidate);
  useEffect(()=>{gl.shadowMap.autoUpdate=false;gl.shadowMap.needsUpdate=true;invalidate();return()=>{gl.shadowMap.autoUpdate=true}},[gl,quality,invalidate]);
  useEffect(()=>{onReady()},[onReady]);
  return <>
    <color attach="background" args={['#ded8cb']}/>
    <Environment files="/showroom/daylight.hdr" environmentIntensity={.48}/>
    <hemisphereLight args={['#e8edf0','#a28c6f',.35]}/>
    <directionalLight position={[-3.9,5.8,1.4]} intensity={2.1} color="#fff1d9" castShadow shadow-mapSize={quality==='low'?[512,512]:[1024,1024]} shadow-bias={-.0002} shadow-normalBias={.025} shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6} shadow-camera-near={.1} shadow-camera-far={18} shadow-radius={3}/>
    <rectAreaLight position={[-4.2,2.8,.2]} rotation={[0,-Math.PI/2,0]} width={3.5} height={3.5} color="#eaf2f6" intensity={2}/>
    <rectAreaLight position={[3.6,3,4]} rotation={[0,Math.PI/4,0]} width={4} height={4} color="#e8d2b3" intensity={.75}/>
    {replacementModelUrl?<AssetBoundary fallback={strictModel?<ModelUnavailable/>:<><Architecture materials={materials}/><Furniture materials={materials}/><Textiles materials={materials} colour={colour} pattern={pattern} textureUrl={textureUrl}/><Plant/></>}><ReplacementRoom url={replacementModelUrl} colour={colour} textureUrl={textureUrl}/></AssetBoundary>:<><Architecture materials={materials}/><Furniture materials={materials}/><Textiles materials={materials} colour={colour} pattern={pattern} textureUrl={textureUrl}/><Plant/></>}
    <ContactShadows position={[0,.045,.3]} opacity={.38} scale={10} blur={2.5} far={3} resolution={512} frames={1} color="#594b37"/>
    <CameraChoreography view={view}/><AdaptiveDpr pixelated/>
  </>;
}
export default function Bedroom({colour,pattern,textureUrl,quality="balanced",onContextLost,view,strictModel}:{colour:string;pattern:string;textureUrl?:string;quality?:"balanced"|"low";onContextLost?:()=>void;view?:RoomView;strictModel?:boolean}){
  const alive=useRef(true);useEffect(()=>{alive.current=true;return()=>{alive.current=false}},[]);
  const [ready,setReady]=useState(false);const [visible,setVisible]=useState(true);const wrapper=useRef<HTMLDivElement>(null);
  const onReady=useMemo(()=>()=>setReady(true),[]);
  useEffect(()=>{const observer=new IntersectionObserver(entries=>setVisible(entries[0].isIntersecting),{rootMargin:'100px'});if(wrapper.current)observer.observe(wrapper.current);return()=>observer.disconnect()},[]);
  return <div className="luxury-canvas" ref={wrapper} data-scene-ready={ready}>
    {!ready&&<div className="showroom-loading" role="status"><span/>Dressing your room…<small>Loading natural materials and daylight</small></div>}
    <Canvas shadows={{type:THREE.PCFSoftShadowMap}} dpr={quality==='low'?1:[1,1.5]} frameloop={visible?'demand':'never'} camera={{position:[5.6,3.4,10],fov:38,near:.1,far:40}} gl={{antialias:true,alpha:false,powerPreference:'high-performance',toneMapping:THREE.ACESFilmicToneMapping,toneMappingExposure:1}} aria-label="Luxury bedroom with interactive cotton bedding" onCreated={({gl})=>{gl.setClearColor('#ded8cb');gl.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();if(alive.current&&gl.domElement.isConnected)onContextLost?.()},{once:true})}}>
      <Suspense fallback={null}><LuxuryRoom colour={colour} pattern={pattern} textureUrl={textureUrl} quality={quality} onReady={onReady} view={view} strictModel={strictModel}/></Suspense>
    </Canvas>
    <div className="room-camera-guide" aria-hidden="true"><span>THE SANCTUARY</span><span>SCROLL TO MOVE CLOSER ↓</span></div>
  </div>;
}








