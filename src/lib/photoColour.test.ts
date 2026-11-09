import {describe,it,expect} from 'vitest';
import {recolour,maskedMedian,toLinear} from './photoColour';
describe('photographic bedding colour',()=>{
 it('maps neutral midtone to the exact swatch while leaving unmasked room pixels identical',()=>{
  const source=new Uint8ClampedArray([180,180,180,255,60,80,90,255]);const mask=new Uint8ClampedArray([255,255,255,255,0,0,0,0]);const result=recolour(source,mask,'#87917c',toLinear(180));
  expect(Array.from(result.slice(0,4))).toEqual([135,145,124,255]);expect(Array.from(result.slice(4))).toEqual([60,80,90,255]);
 });
 it('retains the photographed shadow and highlight ordering',()=>{const source=new Uint8ClampedArray([80,80,80,255,180,180,180,255,220,220,220,255]);const mask=new Uint8ClampedArray(12).fill(255);const result=recolour(source,mask,'#b66b50',toLinear(180));expect(result[0]).toBeLessThan(result[4]);expect(result[4]).toBeLessThan(result[8]);expect(result[5]).toBe(107)});
 it('computes calibration from opaque masked pixels',()=>{expect(maskedMedian(new Uint8ClampedArray([180,180,180,255]),new Uint8ClampedArray([255,255,255,255]))).toBeCloseTo(toLinear(180))});
});
