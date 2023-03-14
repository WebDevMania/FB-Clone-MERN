const multer = require("multer")
const uploadRouter = require("express").Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
       cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
      cb(null, req.body.imageUrl)
    }
})

const upload = multer({ storage: storage });

uploadRouter.post('/', upload.single('photo'), (req, res) => {
    console.log(req.body)
    try {
        return res.status(201).json({msg: 'Successfully uploaded'})
    } catch (error) {
        return res.status(500).json(error)
    }
})

module.exports = uploadRouter