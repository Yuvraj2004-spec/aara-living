import {useEffect,useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {Search,X,SlidersHorizontal} from 'lucide-react';
import {products,colours,money,defaultFilters,filterProducts} from '../lib/catalogue';
import {budgetFromSearch} from '../lib/offers';
import {useSemanticSearch} from './useSemanticSearch';
import ProductCard from './ProductCard';
import {rankBM25,reciprocalRankFusion} from '../lib/hybridSearch';

export default function Collection(){
  const location=useLocation(),navigate=useNavigate();
  const params=new URLSearchParams(location.search);
  const [f,setF]=useState({...defaultFilters,category:params.get('category')||'All',max:budgetFromSearch(location.search)});
  const [sort,setSort]=useState('featured'),[query,setQuery]=useState(''),[limit,setLimit]=useState(8);
  const [semantic,setSemantic]=useState(false),[filtersOpen,setFiltersOpen]=useState(false);
  const [strategy,setStrategy]=useState('hybrid');
  const search=useSemanticSearch(semantic,query);
  useEffect(()=>{setF(s=>({...s,category:new URLSearchParams(location.search).get('category')||'All',max:budgetFromSearch(location.search)}));setLimit(8)},[location.search]);
  const ranked=!!(semantic&&query.trim()&&search.query===query&&search.status==='ready');
  const lexical=rankBM25(query,products);
  const ranking=ranked?(strategy==='hybrid'?reciprocalRankFusion([lexical.map(m=>m.id),search.matches.map(m=>m.id)]):search.matches):lexical;
  const candidates=filterProducts(products,f,sort);
  const position=(id:string)=>{const index=ranking.findIndex(m=>m.id===id);return index<0?Number.MAX_SAFE_INTEGER:index};
  const relevant=query.trim()?candidates.filter(p=>ranking.some(m=>m.id===p.id)):candidates;
  const result=query.trim()&&(ranked||sort==='featured')?relevant.sort((a,b)=>position(a.id)-position(b.id)):relevant;
  const select=(key:'category'|'fabric'|'colour'|'size'|'pattern',values:string[])=><label>{key}<select value={f[key]} onChange={e=>setF({...f,[key]:e.target.value})}>{['All',...values].map(v=><option key={v}>{v}</option>)}</select></label>;
  return <main className="catalogue section-pad"><span className="eyebrow">THE COLLECTION</span><h1>Find your <em>comfort.</em></h1><p>Thoughtfully chosen bedsheets. Find your fabric, colour and perfect fit.</p>{params.has('max')&&<p className="budget-selection">Shopping under {money(f.max)} · choose a bedsheet to preview it in the room.</p>}
    <div className="collection-search"><label htmlFor="bedsheet-search">What are you looking for?</label><div className="collection-search-field"><Search size={20} aria-hidden="true"/><input id="bedsheet-search" autoFocus={params.get('search')==='1'} maxLength={300} placeholder={semantic?'Try “green cotton bedding”':'Search bedsheets…'} value={query} onChange={e=>setQuery(e.target.value)}/>{query&&<button aria-label="Clear search" onClick={()=>setQuery('')}><X size={18}/></button>}</div><label className="semantic-toggle"><input type="checkbox" checked={semantic} onChange={e=>setSemantic(e.target.checked)}/> Search by meaning</label>{semantic&&<label className="search-strategy">Search strategy<select aria-label="Search strategy" value={strategy} onChange={e=>setStrategy(e.target.value)}><option value="hybrid">Meaning + keywords</option><option value="semantic">Meaning only</option></select></label>}<p className="search-status" role="status" aria-live="polite">{semantic?(search.status==='loading'?'Preparing meaning search… First use downloads an embedding model.':search.status==='error'?'Meaning search is unavailable. Showing keyword results; switch it off and on to retry.':search.status==='ready'?strategy==='hybrid'?'Sorted by meaning and keywords. Your filters still apply.':'Sorted by meaning. Your filters still apply.':'Search in your browser. First use downloads a model; no account needed.'):'Search names and product details, or turn on meaning search to describe your bedsheet.'}</p></div>
    <button className="filter-toggle button" aria-expanded={filtersOpen} aria-controls="catalogue-filters" onClick={()=>setFiltersOpen(!filtersOpen)}><SlidersHorizontal size={16}/> {filtersOpen?'Hide filters':'Filters & sizes'}</button>
    <div className="catalogue-layout"><aside id="catalogue-filters" className={filtersOpen?'filters-expanded':''}><h3><SlidersHorizontal size={16}/> Refine your selection</h3>{select('category',['Bedsheets'])}{select('fabric',['Cotton','Premium cotton'])}{select('colour',colours.map(c=>c.name))}{select('size',['King','Queen','Single'])}{select('pattern',['Solid','Botanical'])}<label>Up to {money(f.max)}<input type="range" min="0" max="5000" step="1" value={f.max} onChange={e=>setF({...f,max:+e.target.value})}/></label><label>Minimum thread count<select value={f.thread} onChange={e=>setF({...f,thread:+e.target.value})}><option value="0">Any</option><option value="250">250</option><option value="300">300</option><option value="400">400</option></select></label><label className="check-label"><input type="checkbox" checked={f.available} onChange={e=>setF({...f,available:e.target.checked})}/> In stock only</label><button className="text-link" onClick={()=>{setF(defaultFilters);setQuery('');navigate('/collection',{replace:true})}}>Clear filters</button></aside>
      <div><div className="catalogue-toolbar"><span role="status">{result.length} considered essentials</span><select disabled={ranked} aria-label="Sort products" value={ranked?'featured':sort} onChange={e=>setSort(e.target.value)}><option value="featured">{ranked?'Best meaning match':'Featured'}</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="newest">Newest</option></select></div><div className="product-grid catalogue-grid">{result.slice(0,limit).map(p=><ProductCard key={p.id} product={p}/>)}</div>{!result.length&&<p className="notice">No pieces match these filters. Try a different selection.</p>}{result.length>limit&&<button className="button" onClick={()=>setLimit(limit+8)}>Discover more</button>}<p className="demo-note">Demonstration catalogue. Sample stock does not represent availability for sale.</p></div>
    </div></main>;
}
