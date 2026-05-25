import express  from 'express';
import { User } from '../models/User.model.js';
import bcrypt from 'bcryptjs';
import authMiddleware from '../middlewares/auth.middleware.js';
import jwt from 'jsonwebtoken';
 const router = express.Router();

 // Register route
    router.post('/register',async(req,res)=>{
        try {
            const {UserName,gmail,password} = req.body;
            const existingUser = await User.findOne({gmail});
            if (existingUser){
                return res.status(400).json({message:'User already exists'})
            }
            
           const salt = await bcrypt.genSalt(10);
           const hashedPassword = await bcrypt.hash(password,salt);
            const user = new User({
                UserName,
                gmail,
               password :hashedPassword});
            await user.save();
            res.status(201).json({message:'User registered successfully'})
        } catch (error) {
            res.status(500).json({message:'Server error'})
        }
    })
    
 // Login route
     router.post('/login',async(req,res)=>{
            try {
                const {gmail,password} = req.body;
                const user = await User.findOne({gmail});
                if (!user){
                    return res.status(400).json({message:'User not found'})

                }
                const isMatch = await bcrypt.compare(password,user.password);
                if (!isMatch){
                    return res.status(400).json({message:'Invalid credentials'})
                }

                // Generate JWT token
                const token = jwt.sign({
                    id: user._id,
                    UserName: user.UserName,
                    gmail: user.gmail
                }, process.env.JWT_SECRET, { expiresIn: '1h' });

                res.status(200).json({

    message: 'Login successful',

    token,

    user: {
        id: user._id,
        UserName: user.UserName,
        gmail: user.gmail
    }

});
            } catch (error) {
                res.status(500).json({ message: 'Server error' });
            }
        })

        // Logout route
         router.post('/logout',(req,res)=>{
            // Invalidate the user's session or token here
            res.status(200).json({message:'Logout successful'})
        })


  router.get('/profile', authMiddleware, async (req, res) => {

    try {

        const user = await User.findById(req.user.userId);

        res.status(200).json(user);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
});

 export default router;

 