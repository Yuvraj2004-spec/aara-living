import * as THREE from 'three';

/** Authored textile surfaces: dense enough for folds, independent of render frames. */
export function surface(columns:number,rows:number,point:(u:number,v:number)=>THREE.Vector3){
  const positions:number[]=[],uvs:number[]=[],indices:number[]=[];
  for(let j=0;j<=rows;j++)for(let i=0;i<=columns;i++){
    const u=i/columns,v=j/rows,p=point(u,v);positions.push(p.x,p.y,p.z);uvs.push(u,v);
  }
  for(let j=0;j<rows;j++)for(let i=0;i<columns;i++){
    const a=j*(columns+1)+i,b=a+1,c=a+columns+1,d=c+1;
    indices.push(a,c,b,b,c,d);
  }
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));
  geometry.setIndex(indices);geometry.computeVertexNormals();return geometry;
}
const smooth=(a:number,b:number,x:number)=>THREE.MathUtils.smoothstep(x,a,b);
export function sheetPoint(u:number,v:number){
  const rawX=(u-.5)*4.25,rawZ=-1.82+v*4.85;
  const side=Math.max(0,Math.abs(rawX)-1.70),foot=Math.max(0,rawZ-2.25);
  const x=Math.sign(rawX)*(Math.min(Math.abs(rawX),1.70)+.13*Math.sin(Math.min(side/.4,1)*Math.PI*.5));
  const z=Math.min(rawZ,2.25)+.14*Math.sin(Math.min(foot/.66,1)*Math.PI*.5);
  const edge=smooth(1.15,1.65,Math.abs(rawX));
  const folds=.009*Math.sin(rawX*11+rawZ*3)+.004*Math.sin(rawX*23-rawZ*9)+.003*Math.sin(rawZ*26+rawX*4);
  const pull=.025*Math.sin(rawX*3+rawZ*4)*Math.exp(-((rawZ-.6)**2)/1.8);
  const drape=(side*.98+foot*.9);
  return new THREE.Vector3(x,1.025-drape+folds*(.3+edge)+pull+.025*Math.cos(rawZ*1.7),z);
}
export function throwPoint(u:number,v:number){
  const raw=(u-.5)*4.38,side=Math.max(0,Math.abs(raw)-1.76);
  const x=Math.sign(raw)*(Math.min(Math.abs(raw),1.76)+.12*Math.sin(side*3));
  const z=.93+v*1.07+.11*Math.sin(u*5+.3)+.025*Math.sin(u*26);
  const wrinkles=.014*Math.sin(u*27+v*3)+.017*Math.sin(v*11+u*9)+.004*Math.sin(u*61);
  return new THREE.Vector3(x,1.10-side*.95+wrinkles+.07*Math.sin(v*Math.PI),z);
}
export function pillowGeometry(sign:1|-1){return surface(64,40,(a,b)=>{
  const u=a*2-1,v=b*2-1,inflate=Math.pow(Math.max(0,(1-u*u)*(1-v*v)),.42);
  const crease=(Math.sin(v*47+u*8)*Math.exp(-Math.pow((Math.abs(u)-.88)*10,2)) + Math.sin(u*40-v*4)*Math.exp(-Math.pow((Math.abs(v)-.87)*11,2)))*.004;
  return new THREE.Vector3(u*.76*(1-.07*Math.pow(Math.abs(v),6)),sign*(.23*inflate+crease*inflate),v*.48*(1-.06*Math.pow(Math.abs(u),6)));
})}
export function curtainGeometry(width:number,height:number,phase:number){return surface(100,40,(u,v)=>{
  const x=(u-.5)*width;
  const pleat=Math.sin(u*Math.PI*18+phase)*.092+Math.sin(u*Math.PI*36+phase)*.016;
  return new THREE.Vector3(x,-v*height,pleat*(.7+v*.5)+.02*Math.sin(v*4+u*8));
})}
export function seamCurve(points:THREE.Vector3[],radius=.008){return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),points.length*2,radius,5,false)}

