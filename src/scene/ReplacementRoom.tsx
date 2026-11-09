import {useEffect,useMemo,Component} from 'react';
import {useGLTF} from '@react-three/drei';
import {useFrame,useThree} from '@react-three/fiber';
import * as THREE from 'three';
export const replacementModelUrl=import.meta.env.VITE_SHOWROOM_MODEL_URL as string|undefined;
export class AssetBoundary extends Component<{children:React.ReactNode;fallback:React.ReactNode},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true}}render(){return this.state.failed?this.props.fallback:this.props.children}}
/** Exact material names form the asset contract; room materials are never recoloured. */
export function ReplacementRoom({url,colour,textureUrl}:{url:string;colour:string;textureUrl?:string}){
 const {scene}=useGLTF(url,false,true);
 const invalidate=useThree(s=>s.invalidate);
 const {model,bedding,owned,originalMaps}=useMemo(()=>{const model=scene.clone(true);const bedding:THREE.MeshStandardMaterial[]=[],owned:THREE.Material[]=[];model.traverse(object=>{if(!(object instanceof THREE.Mesh))return;object.castShadow=object.receiveShadow=true;const clone=(material:THREE.Material)=>{const copy=material.clone();owned.push(copy);if(['bedding_sheet','bedding_pillowcase'].includes(material.name)&&copy instanceof THREE.MeshStandardMaterial){bedding.push(copy)}return copy};object.material=Array.isArray(object.material)?object.material.map(clone):clone(object.material)});if(!bedding.length)throw Error('GLB lacks bedding_sheet / bedding_pillowcase materials');return {model,bedding,owned,originalMaps:bedding.map(m=>m.map)}},[scene]);
 const target=useMemo(()=>new THREE.Color(colour),[colour]);
 useEffect(()=>{invalidate()},[target,invalidate]);
 useEffect(()=>{bedding.forEach((m,i)=>{m.map=originalMaps[i];m.needsUpdate=true});invalidate();if(!textureUrl)return;let active=true;let texture:THREE.Texture|undefined;new THREE.TextureLoader().load(textureUrl,t=>{texture=t;if(!active){t.dispose();return}t.colorSpace=THREE.SRGBColorSpace;t.flipY=false;bedding.forEach(m=>{m.map=t;m.needsUpdate=true});invalidate()});return()=>{active=false;texture?.dispose()}},[textureUrl,bedding,originalMaps,invalidate]);
 useFrame((_,dt)=>{let moving=false;bedding.forEach(m=>{m.color.lerp(target,Math.min(1,dt*6));moving ||= Math.abs(m.color.r-target.r)+Math.abs(m.color.g-target.g)+Math.abs(m.color.b-target.b)>.001});if(moving)invalidate()});
 useEffect(()=>()=>owned.forEach(m=>m.dispose()),[owned]);
 return <primitive object={model}/>;
}

