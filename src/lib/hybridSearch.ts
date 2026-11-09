import {type Product} from './catalogue';
import {productDocument} from './semantic';
export const retrievalConfig={k1:1.2,b:.75,rrfConstant:60};
const stopWords=new Set(['a','an','the','for','with','and','of','in','to','is','me','i','want']);
export function tokenize(text:string){return (text.normalize('NFKC').toLowerCase().match(/[\p{L}\p{N}]+/gu)??[]).filter(t=>!stopWords.has(t))}
export function rankBM25(query:string,items:Product[]){
  const terms=[...new Set(tokenize(query))];if(!terms.length||!items.length)return [];
  const documents=items.map(p=>({id:p.id,tokens:tokenize(productDocument(p))}));
  const average=documents.reduce((sum,d)=>sum+d.tokens.length,0)/documents.length||1;
  const {k1,b}=retrievalConfig;
  return documents.map(d=>{
    let score=0;
    for(const term of terms){
      const tf=d.tokens.filter(t=>t===term).length;if(!tf)continue;
      const df=documents.filter(doc=>doc.tokens.includes(term)).length;
      const idf=Math.log(1+(documents.length-df+.5)/(df+.5));
      score+=idf*(tf*(k1+1))/(tf+k1*(1-b+b*d.tokens.length/average));
    }
    return {id:d.id,score};
  }).filter(d=>d.score>0).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
}
/** Merge ranks, not incompatible raw BM25/cosine scores. One vote per ID/list. */
export function reciprocalRankFusion(lists:string[][],constant=retrievalConfig.rrfConstant){
  if(!Number.isFinite(constant)||constant<0)throw new Error('Invalid rank constant');
  const scores=new Map<string,number>();
  for(const list of lists)[...new Set(list)].forEach((id,i)=>scores.set(id,(scores.get(id)??0)+1/(constant+i+1)));
  return [...scores].map(([id,score])=>({id,score})).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
}
