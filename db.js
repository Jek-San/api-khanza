import mysql from 'mysql2'

// export const db = mysql.createConnection({
//   host: "https://apiblogapp.jekk.online/",
//   user: "u1574243_root",
//   password: "F@zZ6@526cqpbtS",
//   database: 'u1574243_BlogAppDb'
// })
export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: 'sik'
})