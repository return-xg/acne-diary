// The caller owns the transaction so record and photo dates change atomically.
export async function saveEditedRecordInTransaction(tx,record,previousDate){
 const target=await tx.getFirstAsync('SELECT id FROM daily WHERE date=?',record.date);
 if(target&&target.id!==record.id)throw Error('这一天已有记录，请选择其他日期，不会覆盖原记录');
 if(previousDate){
  const source=await tx.getFirstAsync('SELECT id FROM daily WHERE date=?',previousDate);
  if(!source||source.id!==record.id)throw Error('原记录已变化，请返回列表重新打开');
  await tx.runAsync('UPDATE daily SET date=?,data=? WHERE id=?',record.date,JSON.stringify(record),record.id);
  if(previousDate!==record.date){
   const photos=await tx.getAllAsync('SELECT id,data FROM photos WHERE date=?',previousDate);
   for(const row of photos){
    const photo={...JSON.parse(row.data),date:record.date};
    await tx.runAsync('UPDATE photos SET date=?,data=? WHERE id=?',record.date,JSON.stringify(photo),row.id);
   }
  }
 }else{
  await tx.runAsync('INSERT INTO daily VALUES (?,?,?) ON CONFLICT(date) DO UPDATE SET data=excluded.data',record.id,record.date,JSON.stringify(record));
 }
}
