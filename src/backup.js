// Restore preserves photo identity; only its private file reference is replaced.
export const PHOTO_RESTORE_SQL = 'INSERT INTO photos (id,date,file,data) VALUES (?,?,?,?) ON CONFLICT(id) DO UPDATE SET date=excluded.date,file=excluded.file,data=excluded.data';
