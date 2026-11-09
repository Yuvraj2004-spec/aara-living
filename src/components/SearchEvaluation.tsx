import {rankBM25,reciprocalRankFusion,retrievalConfig} from '../lib/hybridSearch';
import {useEffect,useRef,useState} from 'react';
import {products} from '../lib/catalogue';
import {evaluationCases,retrievalMetrics} from '../lib/searchEvaluation';

type Row={query:string;relevant:string[];keyword:string[];semantic:string[];bm25:string[];hybrid:string[];elapsedMs:number};
export default function SearchEvaluation(){
  const [rows,setRows]=useState<Row[]>([]),[status,setStatus]=useState('Ready to run.'),[running,setRunning]=useState(false);
  const worker=useRef<Worker|null>(null),generation=useRef(0);
  useEffect(()=>()=>{generation.current++;worker.current?.terminate()},[]);
  async function run(){
    const generationId=++generation.current;
    setRunning(true);setRows([]);setStatus('Loading embedding model. First run requires a download.');
    let instance:Worker|null=null;
    try{
      instance=new Worker(new URL('../lib/semantic.worker.ts',import.meta.url),{type:'module'});worker.current=instance;
      for(let i=0;i<evaluationCases.length;i++){
        const item=evaluationCases[i],start=performance.now();
        const semantic=await new Promise<string[]>((resolve,reject)=>{
          const timer=setTimeout(()=>reject(new Error('Model download or inference timed out.')),180000);
          instance!.onerror=()=>{clearTimeout(timer);reject(new Error('Embedding worker unavailable.'))};
          instance!.onmessage=event=>{
            if(event.data.id!==i||event.data.status==='loading')return;
            clearTimeout(timer);
            if(event.data.status==='error')reject(new Error('Model could not load or run. Check your connection.'));
            else resolve(event.data.matches.map((m:{id:string})=>m.id));
          };
          instance!.postMessage({id:i,query:item.query});
        });
        if(generation.current!==generationId)return;
        const keyword=products.filter(p=>p.name.toLowerCase().includes(item.query.toLowerCase())).map(p=>p.id);
        const bm25=rankBM25(item.query,products).map(m=>m.id);
        const hybrid=reciprocalRankFusion([bm25,semantic]).map(m=>m.id);
        setRows(previous=>[...previous,{...item,keyword,semantic,bm25,hybrid,elapsedMs:performance.now()-start}]);
        setStatus(`Completed ${i+1} of ${evaluationCases.length} queries.`);
      }
      setStatus('Complete. Results are for this browser and this small development dataset.');
    }catch(error){if(generation.current===generationId)setStatus(error instanceof Error?error.message:'Evaluation failed.')}
    finally{instance?.terminate();if(generation.current===generationId){worker.current=null;setRunning(false)}}
  }
  function download(){
    const blob=new Blob([JSON.stringify({recordedAt:new Date().toISOString(),model:'Xenova/all-MiniLM-L6-v2',dtype:'q8',pooling:'mean',normalized:true,k:3,retrievalConfig,catalogue:products,notes:'Development labels; no relevance cutoff. First query includes model/index initialization, and may use cached downloads. Not a production benchmark.',rows:rows.map(r=>({...r,keywordMetrics:retrievalMetrics(r.keyword,r.relevant),semanticMetrics:retrievalMetrics(r.semantic,r.relevant),bm25Metrics:retrievalMetrics(r.bm25,r.relevant),hybridMetrics:retrievalMetrics(r.hybrid,r.relevant)}))},null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='search-evaluation.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  const name=(ids:string[])=>ids.map(id=>products.find(p=>p.id===id)?.name??id).join(' → ')||'No results';
  const summary=(key:'keyword'|'semantic'|'bm25'|'hybrid')=>{
    const measured=rows.flatMap(r=>{const m=retrievalMetrics(r[key],r.relevant);return m?[m]:[]});
    if(!measured.length)return 'No scored queries yet';
    const avg=(field:keyof typeof measured[number])=>(measured.reduce((s,m)=>s+m[field],0)/measured.length).toFixed(3);
    return `P@3 ${avg('precision')} · Recall@3 ${avg('recall')} · MRR@3 ${avg('reciprocalRank')} · nDCG@3 ${avg('ndcg')}`;
  };
  return <main className="section-pad search-evaluation"><span className="eyebrow">DEVELOPER DEMONSTRATION</span><h1>Search evaluation</h1><p>Compare the original name-substring baseline, BM25 keyword retrieval, real browser embeddings and hybrid rank fusion. Eight manually labelled development examples across {products.length} demo products; this is not a held-out quality benchmark.</p><p>First-query time includes model loading and product indexing. Later times include query embedding, keyword scoring and rank fusion. Download cache and device affect timings. Unrelated queries are reported separately because semantic search currently ranks every product without a rejection threshold.</p><div className="evaluation-actions"><button className="button dark" disabled={running} onClick={run}>{running?'Running…':'Run evaluation'}</button><button className="button" disabled={running||!rows.length} onClick={download}>Download JSON results</button></div><p role="status" aria-live="polite">{status}</p><p><strong>Keyword:</strong> {summary('keyword')}<br/><strong>Semantic:</strong> {summary('semantic')}<br/><strong>BM25:</strong> {summary('bm25')}<br/><strong>Hybrid:</strong> {summary('hybrid')}</p><p>Metrics use k=3 and binary relevance. Queries with no relevant products are excluded from metric averages. Precision penalises missing results; nDCG and MRR reward relevant results earlier in the ranking.</p><div className="evaluation-table"><table><caption>Per-query retrieval results</caption><thead><tr><th>Query / expected</th><th>Keyword ranking</th><th>Semantic ranking</th><th>BM25 ranking</th><th>Hybrid ranking</th><th>Elapsed</th></tr></thead><tbody>{rows.map(r=><tr key={r.query}><td>{r.query}<small>Expected: {name(r.relevant)}</small>{!r.relevant.length&&<small>Unrelated-query check: {r.semantic.length?'semantic search returned irrelevant products':'no semantic results'}</small>}</td><td>{name(r.keyword)}</td><td>{name(r.semantic)}</td><td>{name(r.bm25)}</td><td>{name(r.hybrid)}</td><td>{Math.round(r.elapsedMs)} ms</td></tr>)}</tbody></table></div></main>;
}
