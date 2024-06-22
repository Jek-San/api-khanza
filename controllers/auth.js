import { db } from "../db.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// export const register = (req, res) => {
//   //CHECK EXISTING USER
//   const q = "SELECT * FROM users WHERE email = ? OR username = ? "

//   db.query(q, [req.body.email, req.body.username], (err, data) => {
//     if (err) return res.json(err)
//     console.log(req.body.email, req.body.username)

//     if (data.length) return res.status(409).json("User already exists!")

//     //Hash the password and create a user
//     const salt = bcrypt.genSaltSync(10);
//     const hash = bcrypt.hashSync(req.body.password, salt);

//     const q = "INSERT INTO users(`username`, `email`, `password`) VALUES (?)"
//     const values = [
//       req.body.username,
//       req.body.email,
//       hash,
//     ]

//     db.query(q, [values], (err, data) => {
//       if (err) return res.json(err);
//       return res.status(200).json("User has been created.")
//     })
//   })
// }

export const login = (req, res) => {
  // CHECK USER
  const q = `
    SELECT 
      AES_DECRYPT(id_user, 'nur') AS decrypted_username, 
      AES_DECRYPT(password, 'windi') AS decrypted_password 
    FROM user 
    WHERE id_user = AES_ENCRYPT(?, 'nur') AND password = AES_ENCRYPT(?, 'windi')
  `

  console.log(req.body.username)
  db.query(q, [req.body.username, req.body.password], (err, data) => {
    if (err) return res.json(err);
    if (data.length === 0) return res.status(404).json("User not found")

    // User found, fetch details from pegawai table using decrypted_username
    const decryptedUsername = data[0].decrypted_username;
    const pegawaiQuery = "SELECT nik, nama, jbtn FROM pegawai WHERE nik = ?"

    db.query(pegawaiQuery, [decryptedUsername], (err, pegawaiData) => {
      if (err) return res.json(err);
      if (pegawaiData.length === 0) return res.status(404).json("Pegawai not found")

      // Return selected details from pegawai table
      res.status(200).json(pegawaiData[0])
    })
  })
}

export const logout = (req, res) => {
  res.clearCookie("access_token", {
    sameSite: "none",
    secure: true
  }).status(200).json("User has been logged out")
}
