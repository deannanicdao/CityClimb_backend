import Climb from '../models/Climb.js'
import getVideoId from '../youtube_url.js'
import DatauriParser from 'datauri/parser.js'
import path from 'path'
import { uploader } from '../config/cloudinaryConfig.js'



const create = (req, res) =>{
    console.log('Inside create')

    let { gym, wall, colour, youtubeUrl } = req.body


    const parser = new DatauriParser()
    const fileExtension = path.extname(req.file.originalname).toString().toLowerCase()
    const bufferContent = req.file.buffer
    const file = parser.format(fileExtension, bufferContent).content
    // console.log(file)

    let video = getVideoId(youtubeUrl)

    uploader.upload(file,(url, err) => {
        // console.log(1)
        const image = url.url
        let climb = new Climb({
            gym,
            wall,
            colour,
            image,
            video
        })
        // console.log(2)

        climb.save((err, climb) => {
            if(err){
                return res.status(400).json({
                    errors: err.message
                })
            }
    
            res.status(200).json({
                message: "Created climb successfully",
                climb
            })
        })
    })
}

export default { 
    create
}