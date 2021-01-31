import multer from 'multer'
import path from 'path'

// first set storage to => file name and destination
const storage = multer.diskStorage({
    //our destination uploads folder
    destination: function (req, res, cb){
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        console.log('Inside upload')
        console.log(file)

        // generate unique name for each image
        cb(null, 'cityclimb' + '-' + Date.now() + path.extname(file.originalname))
    }
})


// file filter
const fileFilter = (req, file, cb) => {
    cb(null, true)
}

let upload = multer({
    storage: storage,
    fileFilter: fileFilter
})

// export upload as single file

export default upload.single('climbImage')