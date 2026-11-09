import type {Product} from './catalogue';

export function productDocument(p:Product){
  return `${p.name}. ${p.category}. Fabric: ${p.fabric}. Colour: ${p.colour}${p.colour==='Sage'?' green':''}. Pattern: ${p.pattern}. ${p.threadCount} thread count. Sizes: ${p.sizes.join(', ')}.`;
}

export function cosineSimilarity(a:number[],b:number[]){
  if(!a.length||a.length!==b.length)throw new Error('Embedding dimensions must match.');
  let dot=0,aa=0,bb=0;
  for(let i=0;i<a.length;i++){dot+=a[i]*b[i];aa+=a[i]*a[i];bb+=b[i]*b[i]}
  return aa&&bb?dot/Math.sqrt(aa*bb):0;
}

export function rankDocuments(query:number[],documents:{id:string;vector:number[]}[]){
  return documents.map(d=>({id:d.id,score:cosineSimilarity(query,d.vector)})).sort((a,b)=>b.score-a.score);
}
