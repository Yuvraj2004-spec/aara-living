import {z} from 'zod';
const localAsset=z.string().regex(/^\/fabric\/[a-zA-Z0-9_/-]+\.(mp4|webm|jpg|jpeg|png|webp)$/,'Use a local product asset in /fabric/');
const observation=z.object({atSeconds:z.number().nonnegative(),title:z.string().min(1),description:z.string().min(1),evidenceReference:z.string().min(1)});
export const fabricStorySchema=z.object({
 productId:z.string().min(1),title:z.string().min(1),
 sourceKind:z.literal('original-product-footage'),
 video:localAsset.refine(p=>/\.(mp4|webm)$/.test(p)),
 poster:localAsset.refine(p=>/\.(jpg|jpeg|png|webp)$/.test(p)),
 durationSeconds:z.number().positive(),
 verifiedBy:z.string().min(1),verifiedOn:z.iso.date(),
 rightsConfirmed:z.literal(true),constructionConfirmed:z.literal(true),
 footageDescription:z.string().min(1),
 observations:z.array(observation).min(1),
}).superRefine((story,ctx)=>{let previous=-1;for(const [index,item] of story.observations.entries()){if(item.atSeconds<=previous||item.atSeconds>=story.durationSeconds)ctx.addIssue({code:'custom',path:['observations',index,'atSeconds'],message:'Observations must be ordered and within the recorded duration'});previous=item.atSeconds}});
export type FabricStoryData=z.infer<typeof fabricStorySchema>;
// Intentionally empty: no original product footage or verified construction was supplied.
// Never fill this with generated imagery, sample catalogue claims, or guessed layers.
export const fabricStories:FabricStoryData[]=[];
export function verifiedStory(productId:string):FabricStoryData|undefined{
 const candidate=fabricStories.find(s=>s.productId===productId);if(!candidate)return;
 const result=fabricStorySchema.safeParse(candidate);return result.success?result.data:undefined;
}
export function videoTime(progress:number,duration:number){return Math.max(0,Math.min(1,progress))*Math.max(0,duration-.04)}
