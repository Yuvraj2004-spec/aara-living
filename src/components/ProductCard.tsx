import {Link} from 'react-router-dom';
import {ArrowUpRight} from 'lucide-react';
import {type Product,colours,money} from '../lib/catalogue';
import {roomLink,savingPercent} from '../lib/offers';
export default function ProductCard({product:p}:{product:Product}){
  return <article className="product-card"><Link to={roomLink(p)} className="product-image"><img src={p.image} loading="lazy" alt={`${p.name}, illustrative room image; preview selected colour on the bed`}/><span className="product-label">{p.demoOffer?'DEMO OFFER':p.featured?'THE ESSENTIALS':'JUST ARRIVED'}</span><span className="quick-view">View on bed <ArrowUpRight size={17}/></span></Link><div className="product-meta"><div><span className="eyebrow">{p.fabric} · {p.threadCount} TC</span><Link to={roomLink(p)}><h3>{p.name}</h3></Link></div><span className="card-price">{money(p.price)}{savingPercent(p)>0&&<><del>{money(p.compareAtPrice!)}</del><small>{savingPercent(p)}% off sample MRP</small></>}</span></div><div className="mini-swatches">{colours.map(c=><Link key={c.name} to={roomLink(p,c.name)} aria-label={`Preview ${p.name} in ${c.name}`} style={{background:c.hex}} className="card-colour"/>)}</div><Link className="product-details-link" to={`/product/${p.id}`}>Product details →</Link></article>;
}
