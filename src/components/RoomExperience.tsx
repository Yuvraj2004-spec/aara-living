import {Component,lazy,Suspense,useEffect,useState} from 'react';
import PhotographicRoom from './PhotographicRoom';
const Bedroom=lazy(()=>import('../scene/Bedroom'));
export type RoomView={mode:'room'|'fabric';revision:number};
class SceneBoundary extends Component<{children:React.ReactNode;fallback:React.ReactNode},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true}}render(){return this.state.failed?this.props.fallback:this.props.children}}
export default function RoomExperience({colour,colourName,pattern,motion,view}:{colour:string;colourName:string;pattern:string;motion:boolean;view:RoomView}){
 const [webgl,setWebgl]=useState(false),[lost,setLost]=useState(false);
 const model=import.meta.env.VITE_SHOWROOM_MODEL_URL;
 useEffect(()=>{if(!model)return;const canvas=document.createElement('canvas');const gl=canvas.getContext('webgl2');setWebgl(!!gl);gl?.getExtension('WEBGL_lose_context')?.loseContext()},[model]);
 const fallback=<PhotographicRoom colour={colour} colourName={colourName} pattern={pattern} motion={motion} view={view}/>;
 return model&&webgl&&motion&&!lost?<SceneBoundary fallback={fallback}><Suspense fallback={fallback}><Bedroom colour={colour} pattern={pattern} view={view} strictModel onContextLost={()=>setLost(true)}/></Suspense></SceneBoundary>:fallback;
}
