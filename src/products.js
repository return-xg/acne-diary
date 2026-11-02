/** Include legacy usage references whose products were physically deleted. */
/** @param {import('./db').Product[]} products @param {import('./db').RecordData[]} records */
export function productCatalog(products, records) {
  const catalog = [...products];
  const ids = new Set(catalog.map(p=>p.id));
  for (const record of records) for (const usage of record.usage) {
    if (ids.has(usage.productId)) continue;
    ids.add(usage.productId);
    catalog.push({id:usage.productId,name:'已删除产品（名称未知）',category:'历史产品',concentration:'',note:'旧版本已删除名称，仅保留原产品ID和使用记录。',start:'',stop:'',frequency:'',region:'',deletedAt:'unknown'});
  }
  return catalog;
}
