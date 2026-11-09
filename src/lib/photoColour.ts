/** Recolour in linear light; calibrate the masked median to the same sRGB hex as the swatch. */
export const toLinear=(value:number)=>{const c=value/255;return c<=.04045?c/12.92:Math.pow((c+.055)/1.055,2.4)};
export const toSRGB=(value:number)=>Math.round(255*(value<=.0031308?12.92*value:1.055*Math.pow(value,1/2.4)-.055));
export function colourChannels(hex:string){return [1,3,5].map(i=>toLinear(parseInt(hex.slice(i,i+2),16)))}
export function maskedMedian(source:Uint8ClampedArray,mask:Uint8ClampedArray){
 const values:number[]=[];for(let i=0;i<source.length;i+=16){if(mask[i+3]>250)values.push(.2126*toLinear(source[i])+.7152*toLinear(source[i+1])+.0722*toLinear(source[i+2]))}
 values.sort((a,b)=>a-b);return Math.max(.01,values[Math.floor(values.length/2)]??.5);
}
export function recolour(source:Uint8ClampedArray,mask:Uint8ClampedArray,hex:string,reference:number,pattern?:Uint8ClampedArray){
 const result=new Uint8ClampedArray(source),target=colourChannels(hex);
 for(let i=0;i<source.length;i+=4){const alpha=mask[i+3]/255;if(!alpha)continue;
  const luminance=.2126*toLinear(source[i])+.7152*toLinear(source[i+1])+.0722*toLinear(source[i+2]);
  const shade=luminance/reference;
  const ink=pattern?1-pattern[i+3]/255*.55:1;
  for(let channel=0;channel<3;channel++){const tinted=toSRGB(Math.min(1,Math.max(0,target[channel]*shade*ink)));result[i+channel]=Math.round(source[i+channel]*(1-alpha)+tinted*alpha)}
 }
 return result;
}
