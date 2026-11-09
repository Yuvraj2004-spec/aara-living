export type EvaluationCase={query:string;relevant:string[]};
// Manually authored development examples, not a held-out benchmark.
export const evaluationCases:EvaluationCase[]=[
  {query:'Sage Cotton Bedsheet',relevant:['sage-cotton']},
  {query:'green cotton bedding',relevant:['sage-cotton','botanical','sage-essential-demo']},
  {query:'leaf print sheet',relevant:['botanical']},
  {query:'plain ivory sateen',relevant:['everyday-sateen']},
  {query:'400 thread count',relevant:['everyday-sateen']},
  {query:'botanical pattern',relevant:['botanical']},
  {query:'premium cotton set',relevant:['everyday-sateen']},
  {query:'running shoes',relevant:[]},
];
export function retrievalMetrics(ranked:string[],relevant:string[],k=3){
  if(!Number.isInteger(k)||k<1)throw new Error('k must be a positive integer');
  if(!relevant.length)return null;
  const ids=[...new Set(ranked)].slice(0,k),truth=new Set(relevant);
  const hits=ids.filter(id=>truth.has(id)).length;
  const first=ids.findIndex(id=>truth.has(id));
  const dcg=ids.reduce((s,id,i)=>s+(truth.has(id)?1/Math.log2(i+2):0),0);
  const ideal=Array.from({length:Math.min(k,truth.size)},(_,i)=>1/Math.log2(i+2)).reduce((a,b)=>a+b,0);
  return {precision:hits/k,recall:hits/truth.size,reciprocalRank:first<0?0:1/(first+1),ndcg:dcg/ideal};
}
