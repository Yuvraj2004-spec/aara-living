const r=await fetch('https://api.polyhaven.com/assets?t=textures&c=cotton');const d=await r.json();console.log(Object.entries(d).map(([id,v])=>({id,name:v.name})).slice(0,40));
