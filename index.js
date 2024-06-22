import express from "express"
import cors from "cors"
import postRoutes from "./routes/posts.js"
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import cookieParser from "cookie-parser"
import multer from "multer"

const app = express()
const corsOptions = {
  origin: 'http://localhost:5173', // Update this with your client's origin
  credentials: true, // Allow cookies to be sent
};

app.use(cors(corsOptions));
app.use(express.json())
app.use(cookieParser())

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../client/upload')
  },
  filename: function (req, file, cb) {

    cb(null, Date.now() + file.originalname)
  }
})

const upload = multer({ storage: storage })

app.post('/api/upload', upload.single('file'), function (req, res) {
  const file = req.file
  res.status(200).json(file.filename)
})

app.use("/api/posts", postRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)

app.listen(8000, () => {
  console.log("Connected")
}
)
