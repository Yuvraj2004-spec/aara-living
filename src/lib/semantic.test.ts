import {describe,it,expect} from 'vitest';
import {cosineSimilarity,productDocument,rankDocuments} from './semantic';
import {products} from './catalogue';
describe('semantic retrieval',()=>{
  it('ranks by direction rather than vector magnitude',()=>{
    expect(rankDocuments([1,0],[{id:'wrong',vector:[0,100]},{id:'match',vector:[5,0]}]).map(m=>m.id)).toEqual(['match','wrong']);
    expect(cosineSimilarity([1,0],[-1,0])).toBe(-1);
  });
  it('handles zero vectors and rejects incompatible embeddings',()=>{
    expect(cosineSimilarity([0,0],[1,0])).toBe(0);
    expect(()=>cosineSimilarity([1],[1,2])).toThrow();
  });
  it('indexes actual product attributes without inventing comfort claims',()=>{
    const text=productDocument(products[1]);
    expect(text).toContain('Sage green');expect(text).toContain('King, Queen, Single');
    expect(text).not.toContain('organic');
  });
});
