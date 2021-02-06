import Climb from '../models/Climb.js'
import getVideoId from '../youtube_url.js'
import DatauriParser from 'datauri/parser.js'
import path from 'path'
import { uploader } from '../config/cloudinaryConfig.js'

const create = (req, res) => {
    console.log('Inside create')

    let { gym, wall, colour, youtubeUrl } = req.body
    let removalDate = (Date.now()  + 3.1536e11)

    // Ensure gym value is lower case to match Schema definition 
    gym = gym.toLowerCase()

    const parser = new DatauriParser()
    const fileExtension = path.extname(req.file.originalname).toString().toLowerCase()
    const bufferContent = req.file.buffer
    const file = parser.format(fileExtension, bufferContent).content
    // console.log(file)

    let video = getVideoId(youtubeUrl)

    uploader.upload(file, (uploadResponse, err) => {
        // console.log(1)
        // console.log(uploadResponse)
        const image = `/v${uploadResponse.version}/${uploadResponse.public_id}.${uploadResponse.format}`

        // actual url is http://res.cloudinary.com/coderacademy/image/upload/${uploadResponse.version}/${uploadResponse.public_id}.${uploadResponse.format}
        let climb = new Climb({
            gym,
            wall,
            colour,
            image,
            video,
            removalDate
        })
        // console.log(2)
        console.log(climb)

        climb.save((err, climb) => {
            if (err) {
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
// Find a climb or multiple climbs
const listClimbs = async (request, response) => {
    try {
        let climbs
        // Return a single climb
        if (request.params.climbId) {
            climbs = await Climb.findById(request.params.climbId)
        } 
        // Return a list of climbs in the gym that are a specific colour
        else if (request.params.gym && request.params.colour) {
            console.log(request.params)
            // console.log(request.params.colour)
            const gym = request.params.gym
            const colour = request.params.colour
            climbs = await Climb.find({ gym: gym, colour: colour })
        } 
        // Return all climbs in a gym 
        else if (request.params.gym) {
            const gym = request.params.gym
            climbs = await Climb.find({ gym: gym })
        } 
        // Return all climbs 
        else {
            climbs = await Climb.find()
        }
        response.send(climbs)

    } catch (err) {
        console.error(err.message)
        response.status(500).send('Server error')
    }
}


// GET
// Find climb by id
// const readClimb = async (request, response) => {
//     try {
//         let climb = await Climb.findById(request.params.climbId)
//         if (climb) {
//             response.send(climb)
//         } else {
//             response.send('Climb not found.')
//         }
//     } catch (err) {
//         console.error(err.message)
//         response.status(500).send('Server error')
//     }
// }



// PATCH method to add removal date exactly 14 days from current time 
const addRemovalDate = (req, res) => {
    console.log('Inside: Add Removal Date')
    Climb.findByIdAndUpdate(req.params.climbId, { removalDate: (Date.now() + 12096e5)}, { new: true })
        .then(document => res.send(document))
        .catch(error => res.send(error))
}



// const addRemovalDate = (req, res) => {
//     console.log('Inside: Add Removal Date')
//     Climb.findByIdAndUpdate(req.params.climbId, { removalDate: (Date.now() + 12096e5)}, { new: true })
//         .then(document => res.send(document))
//         .catch(error => res.send(error))
// }

export { create, listClimbs, addRemovalDate }

// export default {
//     create,
//     addRemovalDate,
//     // readClimb,
//     listClimbs
// }