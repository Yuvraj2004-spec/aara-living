import {useMemo,useEffect} from 'react';
import {useTexture} from '@react-three/drei';
import * as THREE from 'three';

export function useShowroomMaterials(){
  const originals=useTexture(['/showroom/linen-normal.jpg','/showroom/linen-roughness.jpg','/showroom/oak-colour.jpg','/showroom/oak-normal.jpg','/showroom/oak-roughness.jpg']);
  const maps=useMemo(()=>originals.map((t,i)=>{const texture=t.clone();texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(i<2?12:3,i<2?12:3);texture.anisotropy=4;if(i===2)texture.colorSpace=THREE.SRGBColorSpace;texture.needsUpdate=true;return texture}),[originals]);
  const [linenNormal,linenRoughness,oak,oakNormal,oakRoughness]=maps;
  const materials=useMemo(()=>({
    cotton:new THREE.MeshPhysicalMaterial({color:'#87917c',roughness:.92,normalMap:linenNormal,normalScale:new THREE.Vector2(.12,.12),sheen: .35,sheenColor:'#e9ebdf',sheenRoughness:.9,side:THREE.DoubleSide}),
    linen:new THREE.MeshPhysicalMaterial({color:'#c7b89f',normalMap:linenNormal,normalScale:new THREE.Vector2(.2,.2),roughness:.95,sheen:.25,sheenRoughness:1,side:THREE.DoubleSide}),
    knit:new THREE.MeshPhysicalMaterial({color:'#c7b396',normalMap:linenNormal,roughnessMap:linenRoughness,normalScale:new THREE.Vector2(.65,.65),roughness:.95,sheen:.5,side:THREE.DoubleSide}),
    wood:new THREE.MeshStandardMaterial({map:oak,normalMap:oakNormal,roughnessMap:oakRoughness,color:'#a78b6d',normalScale:new THREE.Vector2(.2,.2),roughness:.65}),
    floor:new THREE.MeshStandardMaterial({map:oak,normalMap:oakNormal,roughnessMap:oakRoughness,color:'#dbb68e',normalScale:new THREE.Vector2(.18,.18),roughness:.67}),
    wall:new THREE.MeshStandardMaterial({color:'#e2dcd0',roughness:1}),
    trim:new THREE.MeshStandardMaterial({color:'#eae4d8',roughness:.8}),
    brass:new THREE.MeshStandardMaterial({color:'#9d7b44',metalness:.8,roughness:.32}),
    rug:new THREE.MeshStandardMaterial({color:'#c8bdab',normalMap:linenNormal,normalScale:new THREE.Vector2(.5,.5),roughness:1}),
  }),[linenNormal,linenRoughness,oak,oakNormal,oakRoughness]);
  useMemo(()=>{for(const material of [materials.floor,materials.wood]){material.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace("#include <map_fragment>","#include <map_fragment>\nfloat grainLuma = dot(diffuseColor.rgb, vec3(0.2126,0.7152,0.0722));\ndiffuseColor.rgb = mix(diffuseColor.rgb, grainLuma * vec3(1.18,1.07,0.91),0.88);")};material.customProgramCacheKey=()=>"natural-oak-v1"}},[materials]);
  useEffect(()=>()=>{Object.values(materials).forEach(m=>m.dispose());maps.forEach(t=>t.dispose())},[materials,maps]);
  return materials;
}
export type RoomMaterials=ReturnType<typeof useShowroomMaterials>;

