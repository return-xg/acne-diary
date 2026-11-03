/** @param {{current:number|null,fresh:number|null}[]} counts */
export function assessedTypes(counts){return counts.flatMap((c,i)=>c.current!==null||c.fresh!==null?[i]:[]);}
/** @param {{current:number|null,fresh:number|null}[]} counts @param {number[]} [selected] */
export function visibleCountTypes(counts,selected=[]){return [...new Set([...selected.filter(i=>Number.isInteger(i)&&i>=0&&i<counts.length),...assessedTypes(counts)])];}
/** Removing a row explicitly returns that type to unknown, never zero. */
/** @param {{current:number|null,fresh:number|null}[]} counts @param {number} index */
export function clearCountType(counts,index){return counts.map((c,i)=>i===index?{current:null,fresh:null}:{...c});}
