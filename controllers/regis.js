import { db } from "../db.js";

export const getRegistrasi = (req, res) => {
  const searchQuery = req.query.search ? `%${req.query.search}%` : '';
  const fromDate = req.query.fromDate ? req.query.fromDate : '1970-01-01';
  const toDate = req.query.toDate ? req.query.toDate : new Date().toISOString().split('T')[0];

  let query = `
    SELECT reg_periksa.*, pasien.nm_pasien 
    FROM reg_periksa 
    LEFT JOIN pasien ON reg_periksa.no_rkm_medis = pasien.no_rkm_medis 
    WHERE DATE(tgl_registrasi) BETWEEN ? AND ?
  `;

  const params = [fromDate, toDate];

  if (searchQuery.length > 1) {
    query += `
      AND (
        reg_periksa.no_rawat LIKE ? 
        OR reg_periksa.no_rkm_medis LIKE ? 
        OR pasien.nm_pasien LIKE ? 
        OR reg_periksa.status_lanjut LIKE ?
      )
    `;
    for (let i = 0; i < 4; i++) {
      params.push(searchQuery);
    }
  }

  query += ' ORDER BY reg_periksa.tgl_registrasi DESC';

  console.log('SQL Query:', query);
  console.log('Parameters:', params);

  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: 'Failed to retrieve data',
        error: err,
      });
    }
    console.log('Results length:', results.length);
    res.json(results);
  });
};
