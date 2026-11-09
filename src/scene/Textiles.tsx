import {Fringe} from './Fringe';
import {useMemo,useEffect} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import {RoundedBox} from '@react-three/drei';
import * as THREE from 'three';
import {pillowGeometry,sheetPoint,throwPoint,surface,seamCurve} from './geometry';
import type {RoomMaterials} from './materials';
function botanicalTexture(){
  const canvas=document.createElement('canvas');canvas.width=canvas.height=512;const ctx=canvas.getContext('2d')!;ctx.fillStyle='#fff';ctx.fillRect(0,0,512,512);
  ctx.strokeStyle='#5d755b';ctx.fillStyle='#819078';ctx.lineWidth=1.5;
  for(let x=40;x<512;x+=120)for(let y=40;y<512;y+=160){ctx.save();ctx.translate(x,y);ctx.rotate(-.4);ctx.beginPath();ctx.moveTo(0,-35);ctx.quadraticCurveTo(20,0,0,50);ctx.stroke();for(let i=0;i<4;i++){ctx.beginPath();ctx.ellipse((i%2?1:-1)*11,-20+i*17,15,5,i%2?.6:-.6,0,Math.PI*2);ctx.fill()}ctx.restore()}
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(3,3);return texture;
}
export function Textiles({materials,colour,pattern,textureUrl}:{materials:RoomMaterials;colour:string;pattern:string;textureUrl?:string}){
  const sheet=useMemo(()=>surface(128,128,sheetPoint),[]);
  const blanket=useMemo(()=>surface(128,60,throwPoint),[]);
  const pillows=useMemo(()=>[pillowGeometry(1),pillowGeometry(-1)],[]);
  const print=useMemo(botanicalTexture,[]);
  const fringe=useMemo(()=>Array.from({length:95},(_,i)=>{const p=throwPoint(i/94,1);p.y-=.015;p.z+=.08;return p}),[]);
  const piping=useMemo(()=>seamCurve(Array.from({length:161},(_,i)=>{
    const t=i/160*Math.PI*2,u=Math.sign(Math.cos(t))*Math.pow(Math.abs(Math.cos(t)),.25),v=Math.sign(Math.sin(t))*Math.pow(Math.abs(Math.sin(t)),.25);
    return new THREE.Vector3(u*.76*(1-.07*Math.pow(Math.abs(v),6)),0,v*.48*(1-.06*Math.pow(Math.abs(u),6)))
  }),.004),[]);
  const hems=useMemo(()=>[-1,1].map(side=>seamCurve(Array.from({length:81},(_,i)=>{const p=sheetPoint(side<0?.002:.998,i/80);p.y+=.003;return p}),.006)),[]);
  useEffect(()=>{let active=true;let owned:THREE.Texture|undefined;materials.cotton.map=pattern==='Botanical'?print:null;materials.cotton.needsUpdate=true;if(textureUrl)new THREE.TextureLoader().load(textureUrl,t=>{if(!active){t.dispose();return}owned=t;t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(3,3);materials.cotton.map=t;materials.cotton.needsUpdate=true;invalidate()});return()=>{active=false;owned?.dispose()}},[pattern,print,materials.cotton,textureUrl]);
  const invalidate=useThree(s=>s.invalidate);
  const target=useMemo(()=>new THREE.Color(colour),[colour]);
  useEffect(()=>invalidate(),[target,invalidate]);
  useFrame((_,dt)=>{materials.cotton.color.lerp(target,Math.min(1,dt*6));if(Math.abs(materials.cotton.color.r-target.r)+Math.abs(materials.cotton.color.g-target.g)+Math.abs(materials.cotton.color.b-target.b)>.001)invalidate()});
  useEffect(()=>()=>{sheet.dispose();blanket.dispose();pillows.forEach(g=>g.dispose());piping.dispose();hems.forEach(g=>g.dispose());print.dispose()},[sheet,blanket,pillows,piping,hems,print]);
  return <group name="bedding">
    <RoundedBox args={[3.38,.33,4.12]} position={[0,.78,.18]} radius={.15} smoothness={5} castShadow receiveShadow><meshStandardMaterial color="#ebe7dd" roughness={1}/></RoundedBox>
    <mesh name="interactive-sheet" geometry={sheet} material={materials.cotton} castShadow receiveShadow/>
    {hems.map((g,i)=><mesh key={i} geometry={g} material={materials.cotton} castShadow/>)}
    {[-.82,.82].map((x,i)=><group key={x} name="cotton-pillow" position={[x,1.245,-1.03+i*.06]} rotation={[-.24,i?-.08:.07,i?-.04:.035]}>
      {pillows.map((g,j)=><mesh key={j} geometry={g} material={materials.cotton} castShadow receiveShadow/>)}
      <mesh geometry={piping} material={materials.cotton}/>
    </group>)}
    <mesh name="knitted-throw" geometry={blanket} material={materials.knit} castShadow receiveShadow/>
    <Fringe points={fringe} colour="#b9a68a"/>
  </group>
}



