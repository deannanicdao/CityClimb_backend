import Climb from '../models/Climb.js'
import getVideoId from '../youtube_url.js'

const create = (req, res) =>{
    console.log('Inside create')
    // console.log(req.file)
    console.log(req)
    let { gym, wall, colour, youtubeUrl } = req.body
    console.log(gym, wall, colour, youtubeUrl)
    console.log(req.body)

    // const image = req.file.path
    let video = getVideoId(youtubeUrl)

    // try {
        
    // } catch (error) {
        
    // }

    let climb = new Climb({
        gym,
        wall,
        colour,
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

    // Climb.create({
    //     gym: gym,
    //     wall: wall,
    //     colour: colour,
    //     // image,
    //     video: video
    // })
    // .then((climb) => {
    //     res.status(200).json({
    //         message: "Created climb successfully",
    //         climb
    //     })
    // })
    // .catch((err) => {
    //     res.status(400).json({
    //         errors: err.message
    //     })})
}

export default { 
    create
}