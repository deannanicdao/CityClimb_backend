import Climb from '../models/Climb.js'
import getVideoId from '../youtube_url.js'

const create = (req, res) =>{
    console.log('Inside create')

    let { gym, wall, colour, youtubeUrl } = req.body

    const image = req.file.path
    let video = getVideoId(youtubeUrl)



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