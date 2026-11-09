import {it,expect} from 'vitest';
import {retrievalMetrics} from './searchEvaluation';
it('scores ordering, missing results and duplicate IDs correctly',()=>{
  expect(retrievalMetrics(['a','b','c'],['a','b'])).toMatchObject({precision:2/3,recall:1,reciprocalRank:1,ndcg:1});
  expect(retrievalMetrics(['c','a','a'],['a'])).toMatchObject({precision:1/3,recall:1,reciprocalRank:.5});
  expect(retrievalMetrics([],['a'])).toEqual({precision:0,recall:0,reciprocalRank:0,ndcg:0});
  expect(retrievalMetrics(['a'],[])).toBeNull();
  expect(()=>retrievalMetrics([],[],0)).toThrow();
});
