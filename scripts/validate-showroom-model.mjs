import {readFile} from 'node:fs/promises';
const path=process.argv[2];if(!path){console.error('Usage: node scripts/validate-showroom-model.mjs public/showroom/room.glb');process.exit(1)}
const file=await readFile(path);if(file.readUInt32LE(0)!==0x46546c67||file.readUInt32LE(4)!==2)throw Error('Expected GLB 2.0');
if(file.readUInt32LE(8)!==file.length)throw Error('Invalid GLB length');
if(file.readUInt32LE(16)!==0x4e4f534a)throw Error('Expected JSON chunk');
const model=JSON.parse(file.subarray(20,20+file.readUInt32LE(12)).toString('utf8').trim());
const names=new Set((model.materials??[]).map(m=>m.name));for(const name of ['bedding_sheet','bedding_pillowcase'])if(!names.has(name))throw Error(`Missing required material: ${name}`);
for(const image of model.images??[])if(image.uri&&!image.uri.startsWith('data:'))throw Error('Embed all image resources in the GLB');
const count=(model.meshes??[]).reduce((sum,m)=>sum+m.primitives.reduce((n,p)=>n+(p.indices===undefined?(model.accessors[p.attributes.POSITION].count):(model.accessors[p.indices].count))/3,0),0);
if(count>450000)throw Error(`Triangle budget exceeded: ${count}`);if(file.length>18000000)throw Error('Desktop GLB exceeds 18 MB budget');
console.log(JSON.stringify({path,megabytes:(file.length/1e6).toFixed(2),triangles:Math.round(count),materials:[...names],extensions:model.extensionsUsed??[],status:'Structural contract passed. Visual, scale, licensing and camera review still required.'},null,2));
