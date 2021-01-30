import Climb from '../models/Climb.js'

const create = (req, res) =>{

    const { gym, wall, colour, setter, video } = req.body

    const image = req.file.path

    const climb = new Climb({
        gym,
        wall,
        colour,
        setter,
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
            message: "Created category successfully",
            climb
        })
    })

}

export default { 
    create
}