import { db } from "../db.js";
import jwt from 'jsonwebtoken'

export const getPosts = (req, res) => {
  const q = req.query.cat ? "SELECT * FROM posts WHERE cat=?" :
    "SELECT * FROM posts";

  db.query(q, [req.query.cat], (err, data) => {
    if (err) return res.status(500).send(err)

    return res.status(200).json(data)
  })
}
export const getPost = (req, res) => {
  const q = "SELECT p.`id`,  u.`username`, p.`title`, p.`desc`, p.`img`, u.`img` as userImg , p.`cat`, p.`date` FROM `users` u JOIN `posts` p ON u.`id` = p.`userId`WHERE p.`id` = ?"

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data[0]);
  });
}


export const addPost = (req, res) => {
  console.log("post is in call")

  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Token is not valid!")


  if (!token) return res.status(401).json("Not authenticated")
  console.log("token is recieved")

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    console.log(req.body.img)
    console.log("token is valid")


    const q = "INSERT INTO posts (`title`, `desc`, `img`, `date`, `userId`, `cat`) VALUES (?)"
    const values = [
      req.body.title,
      req.body.desc,
      req.body.img,
      req.body.date,
      userInfo.id,
      req.body.cat,
    ]


    db.query(q, [values], (err, data) => {
      console.log(values)
      if (err) {
        console.log(err)
        return res.status(500).json(err);
      }
      return res.json("Post has been created.")
    })

  })


}


export const deletePost = (req, res) => {
  console.log(req)
  const token = req.cookies.access_token


  jwt.verify(token, "jwtkey", (err, userInfo) => {
    console.log(token)
    if (err) return res.status(403).json("Token is not valid")
    const postId = req.params.id
    const q = "DELETE FROM posts WHERE `id` = ? AND  `userId` = ? "

    db.query(q, [postId, userInfo.id], (err, data) => {
      if (err) return res.status(403).json("You can only delete your post!")

      return res.json("Post has been deleted")
    })
  })
}
export const updatePost = (req, res) => {
  console.log("update has been call")
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Token is not valid!")


  if (!token) return res.status(401).json("Not authenticated")
  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const postId = req.params.id

    const q = "UPDATE posts SET `title` =?,`desc` =?,`img` =?,`cat` =? WHERE `id` = ? AND `userId` = ? "
    const values = [
      req.body.title,
      req.body.desc,
      req.body.img,
      req.body.cat,
      postId,
      userInfo.id
    ]
    console.log(values)

    db.query(q, values, (err, data) => {
      if (err) {
        console.log(err)
        return res.status(500).json(err);
      }
      console.log("post has been succed")
      return res.json("Post has been updated.")
    })

  })
}