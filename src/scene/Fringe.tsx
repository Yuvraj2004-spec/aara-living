import {useLayoutEffect,useRef} from 'react';
import * as THREE from 'three';
export function Fringe({points,colour,length=.14}:{points:THREE.Vector3[];colour:string;length?:number}){
 const ref=useRef<THREE.InstancedMesh>(null);
 useLayoutEffect(()=>{const dummy=new THREE.Object3D();points.forEach((p,i)=>{dummy.position.copy(p);dummy.rotation.set(Math.PI/2,0,.05*Math.sin(i));dummy.scale.set(1,length+Math.sin(i*3)*.015,1);dummy.updateMatrix();ref.current!.setMatrixAt(i,dummy.matrix)});ref.current!.instanceMatrix.needsUpdate=true;ref.current!.computeBoundingSphere()},[points,length]);
 return <instancedMesh ref={ref} args={[undefined,undefined,points.length]}><cylinderGeometry args={[.003,.002,1,3]}/><meshStandardMaterial color={colour} roughness={1}/></instancedMesh>
}
