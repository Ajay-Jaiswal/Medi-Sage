const express = require("express")
const mongoose = require("mongoose")
const app = express()
const PORT = 5000 || process.env.PORT
const route = require("./route/route")
const multer = require("multer")

mongoose.connect("mongodb+srv://lankesh:YZMPw6IXM8OY1d8G@cluster0.thxzujr.mongodb.net/student",{
    useNewUrlParser : true
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname)
    }
  })
  var upload = multer({ storage: storage })

  app.post("/upload",upload.single("files"), async function(req,res){
    const requestBody = req.body
    res.send({body : requestBody})
 })


app.use(express.json())
app.use("/",route)

app.listen(PORT, ()=>{
    console.log(`Server is connected on port ${PORT}`)
})

////



