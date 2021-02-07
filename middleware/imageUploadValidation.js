export default (req, res, next) => {

    // if no file is attached skip image validation 
    if(!(req.file)){
        next()
    } 

    // Check type of image. Accept only png || jpg || jpeg
    const regex = /.+\/(?:(jpg|png|jpeg|JPG|PNG|JPEG))/ 

    if(!(req.file.mimetype).match(regex)){
        // first we remove the file 
        return res.status(400).json({
            errors: "file not supported - please use only .png, .jpg or .jpeg image files"
        })
    }

    // check file size is less than 5mb 
    if(req.file.size > 1024 * 1024 * 5){
        // first we remove the file 
        return res.status(400).json({
            errors: "file too large please upload image less than 5mb"
        })
    }
    
    next()

}