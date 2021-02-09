import Climb from '../models/Climb.js'
import getYoutubeId from '../helpers/extract_youtubeID.js'
import DatauriParser from 'datauri/parser.js'
import path from 'path'
import { uploader } from '../config/cloudinaryConfig.js'

const create = (req, res) => {
    console.log('Inside create')

    let { gym, title, colour, youtubeUrl } = req.body
    console.log(gym, title, colour, youtubeUrl)

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
        // console.log(image)
        
        let climb = new Climb({
            gym,
            title,
            colour,
            image,
            video,
            removalDate
        })
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



// PATCH method to edit climb 
const editClimb = (req, res) => {
    console.log('Inside EditClimb')

    let { gym, title, colour, youtubeUrl } = req.body
    let climbId = req.params.climbId

    let video = getYoutubeId(youtubeUrl)

    const file = new DatauriParser().format(path.extname(req.file.originalname).toString().toLowerCase(),req.file.buffer).content

    uploader.upload(file, (uploadResponse, err) => {

        const image = `/v${uploadResponse.version}/${uploadResponse.public_id}.${uploadResponse.format}`

        let update = {
            gym: gym,
            title: title,
            colour: colour,
            image: image,
            video: video
        }

        console.log(update)

        Climb.findByIdAndUpdate(climbId, update, { new: true }, 
            (err, result) => {
                
                if (err) {
                    return res.status(400).json({
                        errors: err.message
                    })
                }
    
                res.status(200).json({
                    message: "Edited climb successfully",
                    result
                })
            })
        })
    }
    
// GET
// Find a climb or multiple climbs
const listClimbs = async (req, res) => {
    try {
        let climbs
        // Return a single climb
        if (req.params.climbId) {
            climbs = await Climb.findById(req.params.climbId)
        } 
        // Return a list of climbs in the gym that are a specific colour
        else if (req.params.gym && req.params.colour) {
            console.log(req.params)
            const gym = req.params.gym
            const colour = req.params.colour
            climbs = await Climb.find({ gym: gym, colour: colour })
        } 
        // Return all climbs in a gym 
        else if (req.params.gym) {
            const gym = req.params.gym
            climbs = await Climb.find({ gym: gym })
        } 
        // Return all climbs 
        else {
            climbs = await Climb.find()
        }
        res.send(climbs)

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
}


// PATCH method to add removal date exactly 14 days (12096e5) from current time 
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
