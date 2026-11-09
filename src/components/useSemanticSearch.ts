import {useEffect,useRef,useState} from 'react';

type SearchState={query:string;status:'idle'|'loading'|'ready'|'error';matches:{id:string;score:number}[]};
export function useSemanticSearch(enabled:boolean,query:string){
  const worker=useRef<Worker|null>(null);
  const sequence=useRef(0);
  const [state,setState]=useState<SearchState>({query:'',status:'idle',matches:[]});
  useEffect(()=>()=>worker.current?.terminate(),[]);
  useEffect(()=>{
    const id=++sequence.current;
    if(!enabled||!query.trim()){setState({query,status:'idle',matches:[]});return}
    setState({query,status:'loading',matches:[]});
    const timer=setTimeout(()=>{
      try{
        worker.current??=new Worker(new URL('../lib/semantic.worker.ts',import.meta.url),{type:'module'});
        worker.current.onmessage=event=>{
          if(event.data.id!==sequence.current)return;
          setState({query,status:event.data.status,matches:event.data.matches??[]});
        };
        worker.current.onerror=()=>{
          if(id!==sequence.current)return;
          worker.current?.terminate();worker.current=null;
          setState({query,status:'error',matches:[]});
        };
        worker.current.postMessage({id,query:query.trim().slice(0,300)});
      }catch{setState({query,status:'error',matches:[]})}
    },400);
    return()=>{clearTimeout(timer);sequence.current++};
  },[enabled,query]);
  return state;
}
