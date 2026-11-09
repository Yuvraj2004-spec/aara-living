import {Link} from 'react-router-dom';
import {ArrowRight,ArrowUpRight} from 'lucide-react';
import {products,money} from '../lib/catalogue';
import {budgets,roomLink,savingPercent} from '../lib/offers';

export default function BudgetShopping(){
  const deal=products.find(p=>p.id==='sage-essential-demo')!;
  return <section className="budget-shopping" aria-label="Bedsheet deals and budgets">
    <div className="daily-deal"><div className="deal-kicker"><span className="eyebrow">DEAL OF THE DAY</span><small>Demo offer</small></div><div className="deal-description"><strong>{deal.name}</strong><span>A little everyday comfort, for less.</span></div><div className="deal-price"><strong>{money(deal.price)}</strong><del>{money(deal.compareAtPrice!)}</del><span>{savingPercent(deal)}% off sample MRP</span></div><Link to={roomLink(deal)} className="text-link">See it on the bed <ArrowRight size={16}/></Link></div>
    <div className="budget-heading"><div><span className="eyebrow">COMFORT WITHIN REACH</span><h2>Find your <em>price.</em></h2></div><Link to="/collection" className="text-link">All bedsheets <ArrowUpRight size={16}/></Link></div>
    <div className="budget-grid">{budgets.map(max=><Link key={max} to={`/collection?max=${max}`} className="budget-card"><span>SHOP UNDER</span><strong>{money(max)}</strong><span className="budget-card-foot">Explore bedsheets <ArrowUpRight size={17}/></span></Link>)}</div>
    <p className="budget-disclosure">Sample products, prices and MRP for demonstration. Room images are illustrative; these offers are not available for live purchase.</p>
  </section>;
}
