import { db } from "../db.js";

export const getRanap = (req, res) => {
  const searchQuery = req.query.search ? `%${req.query.search}%` : '';
  const fromDate = req.query.fromDate ? req.query.fromDate : '1970-01-01';
  const toDate = req.query.toDate ? req.query.toDate : new Date().toISOString().split('T')[0];

  let query = `
    SELECT 
        rp.no_rawat AS "No Rawat",
        p.nm_pasien AS "Nama Pasien",
        p.alamat AS "Alamat Pasien",
        rp.p_jawab AS "Penanggung Jawab",
        rp.hubunganpj AS "Hubungan Pj",
        rp.status_bayar AS "Jenis Bayar",
        k.kd_kamar AS "Kamar",
        ki.diagnosa_awal AS "Diagnosa Awal",
        ki.diagnosa_akhir AS "Diagnosa Akhir",
        ki.tgl_masuk AS "Tgl Masuk",
        ki.jam_masuk AS "Jam Masuk",
        ki.tgl_keluar AS "Tgl Keluar",
        ki.jam_keluar AS "Jam Keluar",
        ki.ttl_biaya AS "Total Biaya",
        ki.stts_pulang AS "Status Pulang",
        ki.lama AS "Lama",
        GROUP_CONCAT(d.nm_dokter SEPARATOR ', ') AS "Docter P.J",
        rp.status_bayar AS "Status Bayar",
        p.agama AS "Agama"
    FROM 
        kamar_inap ki
    LEFT JOIN 
        reg_periksa rp ON ki.no_rawat = rp.no_rawat
    LEFT JOIN 
        pasien p ON rp.no_rkm_medis = p.no_rkm_medis
    LEFT JOIN 
        kamar k ON ki.kd_kamar = k.kd_kamar
    LEFT JOIN 
        dpjp_ranap dr ON rp.no_rawat = dr.no_rawat
    LEFT JOIN 
        dokter d ON dr.kd_dokter = d.kd_dokter
    WHERE 
        DATE(ki.tgl_masuk) BETWEEN ? AND ?
    `;

  const params = [fromDate, toDate];

  if (searchQuery.length > 1) {
    query += `
      AND (
        rp.no_rawat LIKE ? 
        OR rp.no_rkm_medis LIKE ? 
        OR p.nm_pasien LIKE ? 
        OR rp.status_lanjut LIKE ?
      )
    `;
    for (let i = 0; i < 4; i++) {
      params.push(searchQuery);
    }
  }

  query += `
    GROUP BY rp.no_rawat, p.nm_pasien, p.alamat, rp.p_jawab, rp.hubunganpj, 
             rp.status_bayar, k.kd_kamar, ki.diagnosa_awal, ki.diagnosa_akhir, 
             ki.tgl_masuk, ki.jam_masuk, ki.tgl_keluar, ki.jam_keluar, 
             ki.ttl_biaya, ki.stts_pulang, ki.lama, p.agama
    ORDER BY ki.tgl_masuk DESC
  `;

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
