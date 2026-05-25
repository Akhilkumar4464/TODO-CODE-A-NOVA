import express from 'express'
import bcrypt from 'bcryptjs'

import authMiddleware from '../middlewares/auth.middleware.js'
import { User } from '../models/User.model.js'
import generateOTP from '../utils/generateOTP.js'
import { sendOTPEmail } from '../config/mailer.js'
import generateToken from '../utils/generateToken.js'

const router = express.Router()


// Register route
router.post('/register', async (req, res) => {
  try {
    const { UserName, gmail, password } = req.body

    const existingUser = await User.findOne({ gmail })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const otp = generateOTP()
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    const user = new User({
      UserName,
      gmail,
      password: hashedPassword,
      otp,
      otpExpires,
      isVerified: false,
    })

    await user.save()

    await sendOTPEmail(gmail, UserName, otp)


    return res
      .status(201)
      .json({ message: 'User registered successfully. OTP sent to email.' })
  } catch (error) {
    return res.status(500).json({ message: 'Server error' })
  }
})

// OTP verification
router.post('/verify-otp', async (req, res) => {
  try {
    const { gmail, otp } = req.body

    const user = await User.findOne({ gmail })
    if (!user) {
      return res.status(400).json({ message: 'User not found' })
    }

    if (user.isVerified) {
      return res.status(200).json({ message: 'Account already verified' })
    }

    if (!user.otp || !user.otpExpires) {
      return res.status(400).json({ message: 'OTP not found. Please register again.' })
    }

    if (String(user.otp) !== String(otp)) {
      return res.status(400).json({ message: 'Invalid OTP' })
    }

    if (user.otpExpires.getTime() < Date.now()) {
      return res.status(400).json({ message: 'OTP expired. Please register again.' })
    }

    user.isVerified = true
    user.otp = null
    user.otpExpires = null

    await user.save()

    return res.status(200).json({ message: 'OTP verified successfully. You can login now.' })
  } catch (error) {
    return res.status(500).json({ message: 'Server error' })
  }
})

// Login route
router.post('/login', async (req, res) => {
  try {
    const { gmail, password } = req.body

    const user = await User.findOne({ gmail })
    if (!user) {
      return res.status(400).json({ message: 'User not found' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Account not verified. Please verify OTP.' })
    }

    const token = generateToken(user)

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        UserName: user.UserName,
        gmail: user.gmail,
      },
    })
  } catch (error) {
    return res.status(500).json({ message: 'Server error' })
  }
})

// Logout route
router.post('/logout', (req, res) => {
  // JWT is stateless; frontend should clear token.
  return res.status(200).json({ message: 'Logout successful' })
})

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    // authMiddleware sets req.user = { id, gmail }
    const user = await User.findById(req.user.id).select('-password -otp -otpExpires')
    return res.status(200).json(user)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})


export default router



 