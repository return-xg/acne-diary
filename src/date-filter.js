/** @template {{date:string}} T @param {T[]} records @param {{start:string,end:string}|null} range */
export function filterByDate(records,range){return records.filter(r=>!range||(r.date>=range.start&&r.date<=range.end)).sort((a,b)=>b.date.localeCompare(a.date));}
export function formatLocalDate(date){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
export function recentRange(days,end){const date=new Date(end+'T12:00:00');date.setDate(date.getDate()-days+1);return {start:formatLocalDate(date),end};}
