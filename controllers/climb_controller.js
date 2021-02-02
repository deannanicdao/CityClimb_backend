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

    uploader.upload(file,(uploadResponse, err) => {
        // console.log(1)
        // console.log(uploadResponse)
        const image = `/${uploadResponse.version}/${uploadResponse.public_id}.${uploadResponse.format}`
        // actual url is http://res.cloudinary.com/coderacademy/image/upload/${uploadResponse.version}/${uploadResponse.public_id}.${uploadResponse.format}
        let climb = new Climb({
            gym,
            wall,
            colour,
            image,
            video
        })
        // console.log(2)
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
    })
}


// GET
// Find all climbs
const listClimbs = async (request, response) => {
    try {
        // console.log(request)
        if(request.params.gym){
            const gym = request.params.gym
            let climbs = await Climb.find({ gym: gym})
            if (climbs) {
                response.send(climbs)
            }
        } else {
        let climbs = await Climb.find()
        if (climbs) {
            response.send(climbs)
        }
        }
    } catch (err) {
        console.error(err.message)
        response.status(500).send('Server error')
    }
}


// GET
// Find climb by id
const readClimb = async (request, response) => {
    try {
        let climb = await Climb.findById(request.params.climbId)
        if (climb) {
            response.send(climb)
        } else {
            response.send('Climb not found.')
        }
    } catch (err) {
        console.error(err.message)
        response.status(500).send('Server error')
    }
}



// PATCH method to add removal date exactly 14 days from current time 
const addRemovalDate = (req, res) => {
    Climb.findByIdAndUpdate(req.params.climbId, { removalDate: (Date.now() + 12096e5)}, { new: true })
        .then(document => res.send(document))
        .catch(error => res.send(error))
}





export default { 
    create,
    addRemovalDate,
    readClimb,
    listClimbs
}