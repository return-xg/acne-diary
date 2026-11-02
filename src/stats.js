export const types = ['红肿痘','脓包痘','小丘疹','闭口粉刺','黑头','囊肿或结节','其他'];
export const regions = ['额头','眉间','左脸颊','右脸颊','鼻梁','鼻头','左鼻翼','右鼻翼','人中','下巴','下巴下方（颏下）','左下颌缘','右下颌缘','颈部','其他'];
export const symptoms = ['出油','干燥','泛红','刺痛','瘙痒','脱皮','紧绷','敏感'];
export function today(){ const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
export function dates(n,end=today()){const d=new Date(end+'T12:00:00'); return Array.from({length:n},(_,i)=>{const x=new Date(d);x.setDate(d.getDate()-n+1+i);return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`;});}
export function total(values){const v=values.filter(x=>typeof x==='number' && Number.isFinite(x));return v.length?v.reduce((a,b)=>a+b,0):null;}
export function series(records,n,kind,type=0){return dates(n).map(date=>{const r=records.find(r=>r.date===date&&!r.skipped);return {date,value:r?.counts?.[type]?.[kind]??null};});}
export function summary(records,n){const ds=dates(n),rs=records.filter(r=>ds.includes(r.date)&&!r.skipped);const values=rs.flatMap(r=>r.counts.map(c=>c.fresh));const scores=rs.map(r=>r.skin?.[3]).filter(x=>typeof x==='number');return {days:rs.length,missing:n-rs.length,fresh:total(values),assessed:values.filter(x=>x!==null).length,irritation:scores.length?scores.reduce((a,b)=>a+b,0)/scores.length:null};}
export function streak(records){let n=0;const ds=dates(records.length+1).reverse();if(!records.some(r=>r.date===ds[0]&&!r.skipped))ds.shift();for(const d of ds){if(!records.some(r=>r.date===d&&!r.skipped))break;n++;}return n;}
