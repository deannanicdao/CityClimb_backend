import multer from 'multer'

const storage = multer.memoryStorage()

const multerUpload = multer({
    storage: storage
})


export default multerUpload.single('image')