
import PhotographicRoom from './PhotographicRoom';
import RoomCamera from './RoomCamera';
import {useEffect,useRef,useState} from 'react';
import {Link,useLocation,useNavigate} from 'react-router-dom';
import {ArrowRight,Check,Minus,Plus,ShoppingBag} from 'lucide-react';
import {products,colours,money,type Product} from '../lib/catalogue';
import {useCart} from '../lib/cart';
import {referencePatterns} from '../lib/referencePatterns';
const bedding=products.filter(p=>['Bedsheets','Bedding sets'].includes(p.category));
export default function Showroom(){
 const location=useLocation(),navigate=useNavigate();
 const requested=new URLSearchParams(location.search);
 const initial=bedding.find(p=>p.id===requested.get('product'))??bedding.find(p=>p.id==='sage-cotton')!;
 const [product,setProduct]=useState<Product>(initial),[size,setSize]=useState(initial.sizes.includes(requested.get('size')??'')?requested.get('size')!:(initial.sizes.includes('King')?'King':initial.sizes[0]));
 const [colour,setColour]=useState(colours.find(c=>c.name===requested.get('colour'))??colours[1]);
 const [quantity,setQuantity]=useState(1),[added,setAdded]=useState(false);
 const [referencePattern,setReferencePattern]=useState('');
 useEffect(()=>setReferencePattern(''),[product.id]);

 const add=useCart(s=>s.add);const section=useRef<HTMLElement>(null);
 useEffect(()=>{const params=new URLSearchParams(location.search);const p=bedding.find(x=>x.id===params.get('product'));if(p){setProduct(p);setSize(p.sizes.includes(params.get("size")??"")?params.get("size")!:p.sizes[0]);setQuantity(1)}const c=colours.find(x=>x.name===params.get('colour'));if(c)setColour(c)},[location.search]);
 const choose=(p:Product)=>{setProduct(p);if(!p.sizes.includes(size))setSize(p.sizes[0]);setQuantity(1);setAdded(false)};
 const put=()=>{add({productId:product.id,size,colour:colour.name,quantity,fabric:product.fabric,pattern:product.pattern});setAdded(true)};
 return <><section className="showroom shopping-showroom photographic-showroom" id="showroom" ref={section} aria-label="Bedroom showroom and bedding configuration">
  <div className="room-sticky">
   <div className="room-visual">
    <PhotographicRoom colour={colour.hex} colourName={colour.name} pattern={referencePattern||product.pattern} motion={false} size={size}/>
    <RoomCamera selectedColour={colour.name} onApply={name=>{setColour(colours.find(c=>c.name===name)!);setAdded(false)}}/>
    <div className="room-editorial"><span className="eyebrow">THE AARA SANCTUARY</span><h2>Your Room.<br/><em>Your Rhythm.</em></h2><p>Natural cotton. Quiet colours. A little more comfort.</p></div>
    <span className="room-badge">{size.toUpperCase()} BED · {colour.name.toUpperCase()}</span>   </div>
   <aside className="room-copy configuration-panel" aria-label="Configure your bedding">
    <span className="eyebrow">MAKE IT YOURS · DEMONSTRATION COLLECTION</span>
    <label htmlFor="room-product" className="room-product-picker">Choose your bedsheet<select id="room-product" value={product.id} onChange={e=>choose(bedding.find(p=>p.id===e.target.value)!)}>{bedding.map(p=><option key={p.id} value={p.id}>{p.name} · {money(p.price)}</option>)}</select></label>
    <h2>{product.name}</h2><p className="showroom-price">{money(product.price)} <small>per set</small></p>
    <p>Soft {product.fabric.toLowerCase()}, thoughtfully chosen for everyday comfort. {product.threadCount} thread count.</p>
    <label htmlFor="room-fabric">Fabric<select id="room-fabric" value={product.fabric} onChange={e=>{const p=bedding.find(p=>p.fabric===e.target.value&&p.pattern===product.pattern)??bedding.find(p=>p.fabric===e.target.value)!;choose(p)}}>{['Cotton','Premium cotton'].map(f=><option key={f}>{f}</option>)}</select></label>
    <div className="colour-caption">Colour — <strong>{colour.name}</strong></div><div className="swatches">{colours.map(c=><button key={c.name} title={c.name} aria-label={c.name} aria-pressed={c.name===colour.name} className={c.name===colour.name?'selected':''} style={{background:c.hex}} onClick={()=>{setColour(c);setAdded(false)}}>{c.name===colour.name&&<Check size={13}/>}</button>)}</div>
    <div className="config-row"><label htmlFor="room-size">Size<select id="room-size" value={size} onChange={e=>{setSize(e.target.value);setAdded(false)}}>{['King','Queen','Single'].map(s=><option key={s} disabled={!product.sizes.includes(s)}>{s}</option>)}</select></label><label htmlFor="room-pattern">Pattern<select id="room-pattern" value={product.pattern} onChange={e=>choose(bedding.find(p=>p.fabric===product.fabric&&p.pattern===e.target.value)!)}>{['Solid','Botanical'].map(p=><option key={p} disabled={!bedding.some(x=>x.fabric===product.fabric&&x.pattern===p)}>{p}</option>)}</select></label></div>
    <label htmlFor="room-reference-pattern">Explore reference patterns<select id="room-reference-pattern" value={referencePattern} onChange={e=>setReferencePattern(e.target.value)}><option value="">Selected product pattern</option>{referencePatterns.map(p=><option key={p}>{p}</option>)}</select></label>
    {referencePattern&&<p className="reference-pattern-note" role="status">{referencePattern} reference preview only. Illustrative placement; folds and print scale are approximate. To purchase, return to the selected product pattern.</p>}
    <div className="quantity-row"><span>Quantity</span><div className="quantity-control"><button aria-label="Decrease showroom quantity" disabled={quantity<=1} onClick={()=>setQuantity(q=>q-1)}><Minus size={13}/></button><output aria-label="Selected quantity">{quantity}</output><button aria-label="Increase showroom quantity" disabled={quantity>=product.stock} onClick={()=>setQuantity(q=>q+1)}><Plus size={13}/></button></div><span>{money(product.price*quantity)}</span></div>
    <button className="button dark full" disabled={!!referencePattern} onClick={put}>{added?'Added to your bag':'Add to Cart'}<ShoppingBag size={15}/></button><button className="button full" disabled={!!referencePattern} onClick={()=>{put();navigate('/checkout')}}>Buy Now <ArrowRight size={15}/></button><span className="sr-only" role="status">{added?`${quantity} ${product.name}, ${size}, ${colour.name}, ${product.pattern} added to bag`:''}</span>
    <details><summary>Delivery & returns</summary><p>Draft: shipping ₹149; complimentary above ₹2,999. Delivery dates and return terms require owner confirmation. No live purchases.</p><Link to="/policies/refunds">Read the draft return policy →</Link></details>
    <div className="room-preview-controls"><small>Colours update directly in this room. Lighting and your screen affect their appearance.</small></div>    <small className="sample-stock">Sample stock: {product.stock}. No real availability or payment implied.</small>
   </aside>
  </div>
  <div className="showroom-outro"><span className="eyebrow">FIND YOUR EVERYDAY COMFORT</span><Link to="/collection">Explore the collection <ArrowRight size={18}/></Link></div>
 </section></>
}








