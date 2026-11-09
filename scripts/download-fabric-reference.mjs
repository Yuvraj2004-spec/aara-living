import {writeFile} from 'node:fs/promises';
const metadata=await(await fetch('https://api.polyhaven.com/info/fabric_pattern_07')).json();console.log(JSON.stringify(metadata));
const files=await(await fetch('https://api.polyhaven.com/files/fabric_pattern_07')).json();
const entry=files.col_1['2k'].jpg;
const response=await fetch(entry.url);if(!response.ok)throw Error('Download failed');await writeFile('public/fabric/woven-reference.jpg',Buffer.from(await response.arrayBuffer()));console.log('Downloaded base colour image',entry.size);
