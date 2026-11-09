import {Fringe} from './Fringe';
import {useMemo,useEffect} from 'react';
import {RoundedBox,useGLTF} from '@react-three/drei';
import * as THREE from 'three';
import {curtainGeometry} from './geometry';
import type {RoomMaterials} from './materials';

type Vec3=[number,number,number];
export function Joinery({at,size,material,radius=.015}:{at:Vec3;size:Vec3;material:THREE.Material;radius?:number}){return <RoundedBox position={at} args={size} radius={radius} smoothness={3} material={material} castShadow receiveShadow/>}
function Panel({x,y,width,height,materials}:{x:number;y:number;width:number;height:number;materials:RoomMaterials}){return <group position={[x,y,-2.64]}>{[-1,1].map(s=><group key={s}><Joinery at={[s*width/2,0,.015]} size={[.025,height,.028]} material={materials.trim}/><Joinery at={[0,s*height/2,.015]} size={[width,.025,.028]} material={materials.trim}/></group>)}</group>}
function Curtains({materials}:{materials:RoomMaterials}){
  const geometries=useMemo(()=>[curtainGeometry(1.15,4.1,0),curtainGeometry(1.2,4.1,.7)],[]);
  useEffect(()=>()=>geometries.forEach(g=>g.dispose()),[geometries]);
  return <group position={[-4.45,4.15,.1]} rotation={[0,Math.PI/2,0]}>
    {geometries.map((geometry,i)=><mesh key={i} position={[(i?1:-1)*1.48,0,.22]} geometry={geometry} material={materials.linen} castShadow receiveShadow/>)}
    <mesh position={[0,.06,.24]} rotation={[0,0,Math.PI/2]} material={materials.brass}><cylinderGeometry args={[.025,.025,4.8,12]}/></mesh>
    {[-1,1].flatMap(side=>Array.from({length:10},(_,i)=><mesh key={`${side}-${i}`} position={[side*1.48-.5+i*.11,.005,.23]} rotation={[0,Math.PI/2,0]} material={materials.brass}><torusGeometry args={[.045,.008,6,12]}/></mesh>))}
  </group>
}
function BotanicalArt({x,materials,index}:{x:number;materials:RoomMaterials;index:number}){
  const texture=useMemo(()=>{
    const canvas=document.createElement('canvas');canvas.width=512;canvas.height=640;const c=canvas.getContext('2d')!;c.fillStyle='#eee6d8';c.fillRect(0,0,512,640);c.strokeStyle='#5b6351';c.lineWidth=3;
    c.beginPath();c.moveTo(245,540);c.bezierCurveTo(200,390,315,250,240,90);c.stroke();
    for(let i=0;i<9;i++){const y=135+i*41,x=250+Math.sin(i*.7)*17,dir=(i+index)%2?1:-1;c.save();c.translate(x,y);c.rotate(dir*.7);c.fillStyle=['#67725a','#849071','#56684e'][i%3];c.beginPath();c.moveTo(0,0);c.bezierCurveTo(dir*85,-58,dir*105,-18,dir*20,20);c.quadraticCurveTo(dir*5,10,0,0);c.fill();c.restore()}
    c.fillStyle='#8b8878';c.font='12px serif';c.fillText(index?'OLEA EUROPAEA':'BOTANICAL STUDY',180,590);const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;return t;
  },[index]);useEffect(()=>()=>texture.dispose(),[texture]);
  return <group position={[x,3.05,-2.5]}><Joinery at={[0,0,0]} size={[1.05,1.35,.06]} material={materials.wood}/><mesh position={[0,0,.035]}><planeGeometry args={[.94,1.24]}/><meshStandardMaterial color="#f7f1e6" roughness={1}/></mesh><mesh position={[0,0,.038]}><planeGeometry args={[.72,1.02]}/><meshStandardMaterial map={texture} roughness={1}/></mesh></group>
}
export function Architecture({materials}:{materials:RoomMaterials}){return <group name="architecture">
  <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.015,1]} receiveShadow material={materials.floor}><planeGeometry args={[14,13]}/></mesh>
  <Joinery at={[0,2.3,-2.75]} size={[12,4.6,.15]} material={materials.wall}/>
  <mesh position={[0,4.6,2.8]} rotation={[Math.PI/2,0,0]} material={materials.wall} receiveShadow><planeGeometry args={[14,12]}/></mesh>
  <Joinery at={[-4.6,2.3,-2.3]} size={[.18,4.6,1]} material={materials.wall}/>
  <Joinery at={[-4.6,2.3,3.6]} size={[.18,4.6,3.3]} material={materials.wall}/>
  <Joinery at={[-4.6,4.4,.0]} size={[.18,.4,4.6]} material={materials.wall}/>
  <Joinery at={[0,.12,-2.63]} size={[12,.24,.09]} material={materials.trim}/>
  <Joinery at={[0,4.35,-2.6]} size={[12,.16,.16]} material={materials.trim}/>
  <Joinery at={[0,4.47,-2.57]} size={[12,.06,.23]} material={materials.trim}/>
  {[-3.5,-1.18,1.18,3.5].map(x=><Panel key={x} x={x} y={2.24} width={2.05} height={3.75} materials={materials}/>)}
  <group position={[-4.56,2.1,.1]}>
    <mesh rotation={[0,Math.PI/2,0]} position={[-.06,0,0]}><planeGeometry args={[4.15,4.05]}/><meshBasicMaterial color="#e0e8dc"/></mesh>
    {[-2.05,0,2.05].map(z=><Joinery key={z} at={[.045,0,z]} size={[.07,4.15,.055]} material={materials.trim}/>)}
    {[-2.02,2.02].map(y=><Joinery key={y} at={[.045,y,0]} size={[.08,.07,4.2]} material={materials.trim}/>)}
    <Joinery at={[.065,-1.1,0]} size={[.09,.045,4.2]} material={materials.trim}/>
    {/* Exterior balcony rails remain beyond the glazing, with a bright sky plane. */}
    {[-1.7,-1.1,-.5,.1,.7,1.3,1.9].map(z=><Joinery key={z} at={[-.02,-1.45,z]} size={[.035,1.05,.025]} material={materials.brass}/>)}
  </group>
  <Curtains materials={materials}/>
  <RoundedBox args={[6.3,.045,6.1]} position={[0,.016,.85]} radius={.02} smoothness={3} material={materials.rug} receiveShadow/>
  {[-1,1].map(side=><Fringe key={side} points={Array.from({length:95},(_,i)=>new THREE.Vector3(-3.09+i*.066,.025,.85+side*3.12))} colour="#c1b59f"/>)}
  <BotanicalArt x={-.67} index={0} materials={materials}/><BotanicalArt x={.67} index={1} materials={materials}/>
</group>}
function Lamp({materials}:{materials:RoomMaterials}){
  const shade=useMemo(()=>new THREE.MeshPhysicalMaterial({color:'#e4d4b7',roughness:1,side:THREE.DoubleSide,emissive:'#f8c77b',emissiveIntensity:.2,normalMap:materials.linen.normalMap,normalScale:new THREE.Vector2(.1,.1)}),[materials]);
  useEffect(()=>()=>shade.dispose(),[shade]);
  return <group position={[0,.97,0]}>
    <mesh position={[0,.055,0]} material={materials.brass} castShadow><cylinderGeometry args={[.22,.24,.055,48]}/></mesh>
    <mesh position={[0,.31,0]} castShadow><latheGeometry args={[[new THREE.Vector2(.1,0),new THREE.Vector2(.16,.06),new THREE.Vector2(.17,.2),new THREE.Vector2(.12,.35),new THREE.Vector2(.055,.39)],48]}/><meshPhysicalMaterial color="#bcb49e" roughness={.45} clearcoat={.3}/></mesh>
    <mesh position={[0,.48,0]} material={materials.brass}><cylinderGeometry args={[.025,.025,.2,16]}/></mesh>
    <mesh position={[0,.73,0]} material={shade} castShadow><cylinderGeometry args={[.27,.39,.47,64,1,true]}/></mesh>
    {[-1,1].map(s=><mesh key={s} position={[0,.73+s*.235,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[s===1?.27:.39,.008,6,64]}/><meshStandardMaterial color="#d1b88e" roughness={.9}/></mesh>)}
    <pointLight position={[0,.61,0]} color="#ffd69d" intensity={5} distance={3.6} decay={2}/>
    <mesh position={[0,.61,0]}><sphereGeometry args={[.045,12,12]}/><meshBasicMaterial color="#ffe6b2"/></mesh>
  </group>
}
export function Furniture({materials}:{materials:RoomMaterials}){return <group name="furniture">
  <Joinery at={[0,.42,.17]} size={[3.45,.49,4.17]} material={materials.linen} radius={.12}/>
  {[-1.38,1.38].flatMap(x=>[-1.45,1.7].map(z=><mesh key={`${x}-${z}`} position={[x,.15,z]} material={materials.wood} castShadow><cylinderGeometry args={[.055,.045,.28,12]}/></mesh>))}
  <Joinery at={[0,1.32,-2.07]} size={[3.85,2.48,.22]} material={materials.linen} radius={.15}/>
  {Array.from({length:15},(_,i)=><Joinery key={i} at={[-1.78+i*.254,1.43,-1.905]} size={[.246,2.18,.19]} material={materials.linen} radius={.075}/>)}
  {[-2.6,2.6].map((x,i)=><group key={x} position={[x,0,-1.32]}>
    <Joinery at={[0,.59,0]} size={[1.12,.64,.85]} material={materials.wood} radius={.025}/>
    <Joinery at={[0,.935,0]} size={[1.17,.06,.9]} material={materials.wood}/>
    {[.45,.74].map(y=><group key={y}><Joinery at={[0,y,.435]} size={[1.02,.26,.025]} material={materials.wood}/><mesh position={[0,y,.46]} rotation={[Math.PI/2,0,0]} material={materials.brass}><cylinderGeometry args={[.026,.026,.035,16]}/></mesh></group>)}
    {[-.43,.43].flatMap(a=>[-.3,.3].map(b=><Joinery key={`${a}-${b}`} at={[a,.15,b]} size={[.055,.28,.055]} material={materials.wood}/>))}
    <Lamp materials={materials}/>
    {!i&&<group position={[.32,.99,.17]} rotation={[0,.14,0]}><Joinery at={[0,0,0]} size={[.23,.035,.34]} material={materials.trim}/><Joinery at={[0,.035,0]} size={[.26,.025,.35]} material={materials.linen}/></group>}
  </group>)}
</group>}
export function Plant(){
  const {scene}=useGLTF('/showroom/plant/plant-optimized.glb',false,true);
  const model=useMemo(()=>{const copy=scene.clone(true);copy.traverse(o=>{if(o instanceof THREE.Mesh){o.castShadow=true;o.receiveShadow=true}});const bounds=new THREE.Box3().setFromObject(copy);const scale=1.8/bounds.getSize(new THREE.Vector3()).y;const center=bounds.getCenter(new THREE.Vector3());copy.position.set(-center.x*scale,-bounds.min.y*scale,-center.z*scale);copy.scale.setScalar(scale);return copy},[scene]);
  return <group position={[-3.65,.02,-.15]}><primitive object={model}/></group>
}




