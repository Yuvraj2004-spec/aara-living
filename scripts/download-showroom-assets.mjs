import {mkdir,writeFile} from 'node:fs/promises';
import {dirname,join} from 'node:path';
const root='public/showroom';
async function download(url,path){await mkdir(dirname(path),{recursive:true});const r=await fetch(url);if(!r.ok)throw Error(`${r.status} ${url}`);const b=Buffer.from(await r.arrayBuffer());await writeFile(path,b);console.log(path,b.length);}
const assets=await Promise.all(['fabric_pattern_07','wood_floor_deck','poly_haven_studio','potted_plant_02'].map(async id=>[id,await(await fetch('https://api.polyhaven.com/files/'+id)).json()]));
const data=Object.fromEntries(assets);
await Promise.all([
 download(data.fabric_pattern_07.nor_gl['1k'].jpg.url,join(root,'linen-normal.jpg')),
 download(data.fabric_pattern_07.Rough['1k'].jpg.url,join(root,'linen-roughness.jpg')),
 download(data.wood_floor_deck.Diffuse['1k'].jpg.url,join(root,'oak-colour.jpg')),
 download(data.wood_floor_deck.nor_gl['1k'].jpg.url,join(root,'oak-normal.jpg')),
 download(data.wood_floor_deck.Rough['1k'].jpg.url,join(root,'oak-roughness.jpg')),
 download(data.poly_haven_studio.hdri['1k'].hdr.url,join(root,'daylight.hdr')),
]);
const model=data.potted_plant_02.gltf['1k'].gltf;
await download(model.url,join(root,'plant/plant.gltf'));
await Promise.all(Object.entries(model.include).map(([path,entry])=>download(entry.url,join(root,'plant',path))));
await writeFile(join(root,'ASSETS.md'),`# Showroom assets\n\nDownloaded from Poly Haven public asset API. All assets CC0: https://polyhaven.com/license\n\n- fabric_pattern_07: normal and roughness maps, 1K. https://polyhaven.com/a/fabric_pattern_07\n- wood_floor_deck: diffuse, normal, roughness maps, 1K. https://polyhaven.com/a/wood_floor_deck\n- poly_haven_studio: HDR environment, 1K. https://polyhaven.com/a/poly_haven_studio\n- potted_plant_02: glTF, binary and 1K textures. https://polyhaven.com/a/potted_plant_02\n\nGeometry for bedding, curtains and upholstered furniture is project-authored. No generated photograph is substituted for interactive geometry.\n`);
