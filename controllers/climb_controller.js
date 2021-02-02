import Climb from '../models/Climb.js'
import getVideoId from '../youtube_url.js'
import DatauriParser from 'datauri/parser.js'
import path from 'path'
import { uploader } from '../config/cloudinaryConfig.js'

const create = async (req, res) =>{
    console.log('Inside create')
    // console.log(req.file)
    let { gym, wall, colour, youtubeUrl } = req.body
    // console.log(gym, wall, colour, youtubeUrl)

    const parser = new DatauriParser()
    const fileExtension = path.extname(req.file.originalname).toString().toLowerCase()
    // console.log(fileExtension)
    const bufferContent = req.file.buffer
    // console.log(bufferContent)
    const file = parser.format(fileExtension, bufferContent).content
    console.log(file)

    // const image = req.file.path

    let video = getVideoId(youtubeUrl)

    const image = await uploader.upload(file).url



    let climb = new Climb({
        gym,
        wall,
        colour,
        image,
        video
    })

    console.log(climb)

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

}

export default { 
    create
}