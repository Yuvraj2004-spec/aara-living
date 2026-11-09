import {describe,it,expect} from 'vitest';
import {fabricStorySchema,verifiedStory,videoTime} from './fabricStories';
// Metadata-only fixtures, never published or represented as genuine product evidence.
const record={productId:'test-only',title:'Test recording',sourceKind:'original-product-footage',video:'/fabric/test.mp4',poster:'/fabric/test.jpg',durationSeconds:10,verifiedBy:'Test reviewer',verifiedOn:'2026-11-01',rightsConfirmed:true,constructionConfirmed:true,footageDescription:'Test fixture only',observations:[{atSeconds:0,title:'Test observation',description:'Test metadata',evidenceReference:'Test source'}]};
describe('fabric evidence publication gate',()=>{
 it('does not invent a story from demonstration catalogue data',()=>{expect(verifiedStory('sage-cotton')).toBeUndefined();expect(verifiedStory('cloud-comforter')).toBeUndefined()});
 it('requires reviewed original footage metadata rather than generated assets',()=>{expect(fabricStorySchema.safeParse(record).success).toBe(true);expect(fabricStorySchema.safeParse({...record,sourceKind:'ai-generated'}).success).toBe(false);expect(fabricStorySchema.safeParse({...record,constructionConfirmed:false}).success).toBe(false);expect(fabricStorySchema.safeParse({...record,rightsConfirmed:false}).success).toBe(false)});
 it('rejects missing evidence and observations outside the actual declared duration',()=>{expect(fabricStorySchema.safeParse({...record,observations:[{...record.observations[0],evidenceReference:''}]}).success).toBe(false);expect(fabricStorySchema.safeParse({...record,observations:[{...record.observations[0],atSeconds:11}]}).success).toBe(false)});
 it('clamps scroll seeks within the recording',()=>{expect(videoTime(-1,10)).toBe(0);expect(videoTime(2,10)).toBeLessThan(10);expect(videoTime(.5,10)).toBeCloseTo(4.98)});
});
