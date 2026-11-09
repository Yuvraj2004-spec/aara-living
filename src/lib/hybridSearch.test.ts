import {it,expect} from 'vitest';
import {rankBM25,reciprocalRankFusion,tokenize} from './hybridSearch';
import {products} from './catalogue';
it('retrieves attributes beyond name substrings and handles empty/unrelated queries',()=>{
  expect(rankBM25('400 thread count',products)[0].id).toBe('everyday-sateen');
  expect(rankBM25('running shoes',products)).toEqual([]);
  expect(rankBM25('the and for',products)).toEqual([]);
  expect(tokenize('SAGE—Cotton! 400')).toEqual(['sage','cotton','400']);
});
it('fuses consensus and deduplicates rankings with stable tie breaks',()=>{
  const fused=reciprocalRankFusion([['a','b'],['b','c']]);
  expect(fused[0].id).toBe('b');
  expect(reciprocalRankFusion([['a','a'],['b']])).toEqual(reciprocalRankFusion([['a'],['b']]));
  expect(reciprocalRankFusion([])).toEqual([]);
  expect(()=>reciprocalRankFusion([], -1)).toThrow();
});
