import {pipeline,env} from '@huggingface/transformers';
import {products} from './catalogue';
import {productDocument,rankDocuments} from './semantic';

env.allowLocalModels=false;
// WASM executes inside this worker; avoid a nested runtime worker.
env.backends.onnx.wasm!.numThreads=1;
type Extractor=(text:string,options:{pooling:'mean';normalize:boolean})=>Promise<{data:ArrayLike<number>}>;
const createExtractor=pipeline as unknown as (task:string,model:string,options:{dtype:string;device:string})=>Promise<Extractor>;
let extractor:Promise<Extractor>|undefined;
let documents:Promise<{id:string;vector:number[]}[]>|undefined;
async function embed(text:string){
  extractor??=createExtractor('feature-extraction','Xenova/all-MiniLM-L6-v2',{dtype:'q8',device:'wasm'});
  const model=await extractor;
  const output=await model(text,{pooling:'mean',normalize:true});
  return Array.from(output.data,Number);
}
// Serialize inference while the UI may submit newer requests.
let queue=Promise.resolve();
self.onmessage=(event:MessageEvent<{id:number;query:string}>)=>{
  const {id,query}=event.data;
  queue=queue.then(async()=>{
    try{
      self.postMessage({id,status:'loading'});
      documents??=Promise.all(products.map(async p=>({id:p.id,vector:await embed(productDocument(p))})));
      const indexed=await documents;
      const matches=rankDocuments(await embed(query),indexed);
      self.postMessage({id,status:'ready',matches});
    }catch{
      extractor=undefined;documents=undefined;
      self.postMessage({id,status:'error'});
    }
  });
};
