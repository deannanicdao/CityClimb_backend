import Climb from '../models/Climb.js'
import getYoutubeId from '../helpers/extract_youtubeID.js'
import DatauriParser from 'datauri/parser.js'
import path from 'path'
import { uploader } from '../config/cloudinaryConfig.js'

const create = (req, res) => {
    console.log('Inside create')

    let { gym, wall, colour, youtubeUrl } = req.body
    console.log(gym, wall, colour, youtubeUrl)

    // Set removalDate to 10 years. Puts removalDate in document so it can be updated when needed 
    let removalDate = (Date.now()  + 3.1536e11)

    // Get the image's file extension and it's data in buffer form and
    // parse as a base64 data URI string
    // example output: data:image/jpeg;base64,/9j/4AAQSkZJRgABA...
    const file = new DatauriParser().format(path.extname(req.file.originalname).toString().toLowerCase(),req.file.buffer).content

    // Set video to the youtube ID. On the front end we only need the 11 character id to embed the video
    let video = getYoutubeId(youtubeUrl)


    uploader.upload(file, (uploadResponse, err) => {
    
        // fronted usage of image url is in format 
        // http://res.cloudinary.com/coderacademy/image/upload/${uploadResponse.version}/${uploadResponse.public_id}.${uploadResponse.format}
        // So setting image to string with this value decreases the size of document in the database
        const image = `/v${uploadResponse.version}/${uploadResponse.public_id}.${uploadResponse.format}`

        
        let climb = new Climb({
            gym,
            wall,
            colour,
            image,
            video,
            removalDate
        })

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



// PATCH method to edit climb 
const editClimb = (request, response) => {
    console.log('Inside EditClimb')

    let { gym, wall, colour, youtubeUrl } = request.body
    let climbId = request.params.climbId

    let video = getYoutubeId(youtubeUrl)

    const file = new DatauriParser().format(path.extname(req.file.originalname).toString().toLowerCase(),req.file.buffer).content

    uploader.upload(file, (uploadResponse, err) => {

        const image = `/v${uploadResponse.version}/${uploadResponse.public_id}.${uploadResponse.format}`

        let update = {
            gym: gym,
            wall: wall,
            colour: colour,
            image: image,
            video: video
        }

        console.log(update)

        Climb.findByIdAndUpdate(climbId, update, { new: true }, 
            (err, result) => {
                
                if (err) {
                    return response.status(400).json({
                        errors: err.message
                    })
                }
    
                response.status(200).json({
                    message: "Edited climb successfully",
                    result
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


// PATCH method to add removal date exactly 14 days from current time 
const addRemovalDate = (req, res) => {
    console.log('Inside: Add Removal Date')
    Climb.findByIdAndUpdate(req.params.climbId, { removalDate: (Date.now() + 12096e5)}, { new: true })
        .then(climb => res.status(200).send(climb))
        .catch(error => res.send(error))
}


// DELETE method to remove climb immediately
const removeClimb = (req, res) => {
    console.log('Inside: removeClimb')
    Climb.findByIdAndDelete(req.params.climbId)
    .then(confirmation => res.status(200).json({message: "Climb Deleted", confirmation}))
    .catch(error => res.send(error))
}

export { create, listClimbs, addRemovalDate, editClimb, removeClimb }
