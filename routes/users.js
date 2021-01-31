const express = require('express');
const router = express.Router();
const User = require('./../models/User');
const { check, validationResult } = require('express-validator');
// const gravatar = require('gravatar');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const normalize = require('normalize-url');

// GET
// Find all users
router.get("/", async (request, response) => {
    try {
        let users = await User.find()
        if (users) {
            response.send(users)
        }
    } catch (err) {
        console.error(err.message)
        response.status(500).send('Server error')
    }
    
})

// GET
// Find user by id
router.get("/:id", async (request, response) => {
    try {
        let user = await User.findById(request.params.id)
        if (user) {
            response.send(user)
        } else {
            response.send('User not found.')
        }
    } catch (err) {
        console.error(err.message)
        response.status(500).send('Server error')
    }
   
})

// REGISTER
// Register a new user
router.post("/", [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('staffNumber', 'Please enter a valid staff number').isLength({ min: 6 }),
    check('password', 'Please enter a valid password with 6 or more characters').isLength({ min: 6 })
], async (request, response) => 
    {
        let errors = validationResult(request)
        if (!errors.isEmpty()) {
            return response.status(400).json({ errors: errors.array() })
        }
        
        const { name, email, staffNumber, password } = request.body

        try {
            let user = await User.findOne({ name })

            if (user) {
                response.status(400).json({ errors: [ { msg: 'User already exists' }] })
            }

            user = new User({
                name,
                email,
                staffNumber,
                password
            })

            await user.save()

            response.status(201).send(user)
        } catch (err) {
            console.error(err.message)
            response.status(500).send('Server error')
        }
    }
)

// UPDATE
// Update an entire user
router.put("/:id", (request, response) => {
    User.findOneAndReplace({ _id: request.params.id }, request.body)
    .then(document => response.send(document))
    .catch(error => response.send(error))
})

// Update existing fields of user
router.patch("/:id", (request, response) => {
    User.findByIdAndUpdate(request.params.id, request.body)
        .then(document => response.send(document))
        .catch(error => response.send(error))
})

// DELETE
// Remove a user
router.delete("/:id", (request, response) => {
    User.findByIdAndDelete(request.params.id)
        .then(confirmation => response.send(console.log(confirmation)))
        // TODO: Returns the deleted object - change this to return status
		.catch(error => response.send(error))
})

// OLD CODE

// // @route    GET /users
// // @desc     Find all users
// // @access   Public
// router.get("/", async (request, response) => {
//     try {
//         let users = await User.find()
//         if (users) {
//             response.send(users)
//         }
//     } catch (err) {
//         console.error(err.message)
//         response.status(500).send('Server error')
//     }
    
// })

// router.get("/:id", async (request, response) => {
//     try {
//         let user = await User.findById(request.params.id)
//         if (user) {
//             response.send(user)
//         }
//     } catch (err) {
//         console.error(err.message)
//         response.status(500).send('Server error')
//     }
   
// })

// // @route    POST /users
// // @desc     Register user
// // @access   Public
// router.post("/", [
//     check('name', 'Name is required').notEmpty(),
//     check('email', 'Please include a valid email').isEmail(),
//     check('staffNumber', 'Please enter a valid staff number').isLength({ min: 6 }),
//     check('password', 'Please enter a valid password with 6 or more characters').isLength({ min: 6 })
// ], async (request, response) => 
//     {
//         let errors = validationResult(request)
//         if (!errors.isEmpty()) {
//             return response.status(400).json({ errors: errors.array() })
//         }
        
//         const { name, email, staffNumber, password } = request.body

//         try {
//             let user = await User.findOne({ staffNumber })

//             if(user) {
//                 response.status(400).json({ errors: [ { msg: 'User already exists. Please login.' }] })
//             }

//             user = new User({
//                 name,
//                 email,
//                 staffNumber,
//                 password
//             })

//             await user.save()

//             response.send('User added.')
//         } catch (err) {
//             console.error(err.message)
//             response.status(500).send('Server error')
//         }
//     }
// )

// router.post(
//   '/',
//   check('name', 'Name is required').notEmpty(),
//   check('email', 'Please include a valid email').isEmail(),
//   check(
//     'password',
//     'Please enter a password with 6 or more characters'
//   ).isLength({ min: 6 }),
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { name, email, password } = req.body;

//     try {
//       let user = await User.findOne({ email });

//       if (user) {
//         return res
//           .status(400)
//           .json({ errors: [{ msg: 'User already exists' }] });
//       }

//       const avatar = normalize(
//         gravatar.url(email, {
//           s: '200',
//           r: 'pg',
//           d: 'mm'
//         }),
//         { forceHttps: true }
//       );

//       user = new User({
//         name,
//         email,
//         avatar,
//         password
//       });

//       const salt = await bcrypt.genSalt(10);

//       user.password = await bcrypt.hash(password, salt);

//       await user.save();

//       const payload = {
//         user: {
//           id: user.id
//         }
//       };

//       jwt.sign(
//         payload,
//         config.get('jwtSecret'),
//         { expiresIn: '5 days' },
//         (err, token) => {
//           if (err) throw err;
//           res.json({ token });
//         }
//       );
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Server error');
//     }
//   }
// );

module.exports = router;