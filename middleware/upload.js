import multer from 'multer'


// first set storage to => file name and destination
// const storage = multer.diskStorage({
//     //our destination uploads folder
//     destination: function (req, res, cb){
//         cb(null, './uploads/')
//     },
//     filename: function (req, file, cb) {
//         console.log('Inside upload')
//         console.log(file)

//         // generate unique name for each image
//         cb(null, 'cityclimb' + '-' + Date.now() + path.extname(file.originalname))
//     }
// })

const storage = multer.memoryStorage()
// const multerUpload = multer()

// file filter
// const fileFilter = (req, file, cb) => {
//     cb(null, true)
// }

const multerUpload = multer({
    storage: storage
    // ,
    // fileFilter: fileFilter
})

// upload as single file
// const upload = multerUpload.single('image')

// const dUri = new Datauri()

// const dataUri = req => dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer) 

export default multerUpload.single('image')