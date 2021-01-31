import Climb from '../models/Climb.js'
import getVideoId from '../youtube_url.js'

const create = (req, res) =>{
    console.log('Inside create')
    console.log(req.file)

    let { gym, wall, colour, video } = req.body

    const image = req.file.path
    video = getVideoId(video)

    const climb = new Climb({
        gym,
        wall,
        colour,
        image,
        video
    })

    climb.save((err, climb) => {
        if(err){
            return res.status(400).json({
                errors: err.message
            })
        }

        return res.status(200).json({
            message: "Created climb successfully",
            climb
        })
    })

}

export default { 
    create
}