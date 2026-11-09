
import {useEffect,useRef,useState} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {verifiedStory,videoTime,type FabricStoryData} from '../lib/fabricStories';
gsap.registerPlugin(ScrollTrigger);
export default function FabricStory({productId}:{productId:string}){
 const story=verifiedStory(productId);
 return story?<VerifiedFootage key={story.video} story={story}/>:null;
}
function VerifiedFootage({story}:{story:FabricStoryData}){
 const section=useRef<HTMLElement>(null),video=useRef<HTMLVideoElement>(null),progress=useRef<HTMLDivElement>(null);
 const [ready,setReady]=useState(false),[failed,setFailed]=useState(false),[manual,setManual]=useState(false),[motion,setMotion]=useState(false);
 useEffect(()=>{const query=matchMedia('(prefers-reduced-motion: reduce)');const connection=(navigator as Navigator&{connection?:{saveData?:boolean}}).connection;const update=()=>setMotion(!query.matches&&!connection?.saveData);update();query.addEventListener('change',update);return()=>query.removeEventListener('change',update)},[]);
 useEffect(()=>{
  const el=video.current;if(!ready||!motion||manual||failed||!el||!section.current)return;
  let frame=0,target=0;el.pause();
  const seek=()=>{frame=0;if(!el.seeking&&Math.abs(el.currentTime-target)>.025)el.currentTime=target};
  const seeked=()=>{if(Math.abs(el.currentTime-target)>.025&&!frame)frame=requestAnimationFrame(seek)};
  el.addEventListener('seeked',seeked);
  const context=gsap.context(()=>{
   gsap.to(progress.current,{scaleX:1,ease:'none',scrollTrigger:{trigger:section.current,start:'top top',end:'bottom bottom',scrub:true,onUpdate:self=>{target=videoTime(self.progress,Math.min(el.duration,story.durationSeconds));if(!frame)frame=requestAnimationFrame(seek)}}});
   const captions=section.current!.querySelectorAll<HTMLElement>('[data-fabric-observation]');
   captions.forEach((caption,index)=>{const begin=story.observations[index].atSeconds/story.durationSeconds;const end=(story.observations[index+1]?.atSeconds??story.durationSeconds)/story.durationSeconds;
    ScrollTrigger.create({trigger:section.current,start:'top top',end:'bottom bottom',onUpdate:self=>{const active=self.progress>=begin&&self.progress<end;caption.classList.toggle('is-current',active)}})
   });
  },section);ScrollTrigger.refresh();return()=>{context.revert();cancelAnimationFrame(frame);el.removeEventListener('seeked',seeked)};
 },[ready,motion,manual,failed,story]);
 return <section id="fabric-story" className={`fabric-story ${ready&&motion&&!manual&&!failed?'fabric-story-scrub':''}`} ref={section} aria-labelledby="fabric-story-title">
  <div className="fabric-story-sticky">
   <div className="fabric-footage"><video ref={video} poster={story.poster} preload="metadata" controls={manual||!motion} playsInline muted onLoadedMetadata={()=>{if(!video.current||!Number.isFinite(video.current.duration)||video.current.duration<=0){setFailed(true);return}if(Math.abs(video.current.duration-story.durationSeconds)>.5){setFailed(true);return}setReady(true)}} onError={()=>setFailed(true)} aria-label={story.footageDescription}><source src={story.video}/><p>Your browser cannot play the original footage.</p></video><div className="fabric-playhead" ref={progress}/></div>
   <div className="fabric-story-copy"><span className="eyebrow">THE FABRIC, UP CLOSE</span><h2 id="fabric-story-title">{story.title}</h2><p>{story.footageDescription}</p><p className="fabric-story-instruction">{failed?'Footage is unavailable. Scroll animation is disabled.':manual||!motion?'Use the video controls to inspect the original recording.':'Scroll to move through the original product recording.'}</p>
    <ol className="fabric-observations">{story.observations.map((item,index)=><li key={item.atSeconds} data-fabric-observation className={index===0?'is-current':''}><span>{String(index+1).padStart(2,'0')}</span><div><h3>{item.title}</h3><p>{item.description}</p></div></li>)}</ol>
    {motion&&!failed&&<button className="text-link" onClick={()=>setManual(v=>!v)}>{manual?'Use scroll animation':'Use video controls instead'}</button>}
    <details className="fabric-evidence"><summary>Product footage & construction sources</summary><p>Reviewed {story.verifiedOn} by {story.verifiedBy}.</p><ul>{story.observations.map(item=><li key={item.atSeconds}>{item.title}: {item.evidenceReference}</li>)}</ul><p>The sequence uses original footage. No extra layers or generated material imagery are added.</p></details>
   </div>
  </div>
 </section>
}


