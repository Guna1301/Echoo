import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import cloudinary from "../lib/cloudinary.js";
import { ENV } from "../lib/env.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";

import bcrypt from "bcryptjs";


export const signup = async(req, res) => {
    const {fullName, email, password} = req.body;

    try {
        if(!fullName || !email || !password){
            // console.log(!fullName, !email, !password);
            return res.status(400).json({message: 'All fields are required'});
        }

        if(password.length < 6){
            return res.status(400).json({message: 'Password must be at least 6 characters'});
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const user = await User.findOne({ email });
        if(user){
            return res.status(400).json({message: 'User already exists'});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })

        if(newUser){
            const savedUser = await newUser.save();
            generateToken(newUser._id,res);
            

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            })

            // TODO: Send welcome email to user
            try {
                await sendWelcomeEmail(savedUser.email,savedUser.fullName,ENV.CLIENT_URL);
            } catch (error) {
                console.error("Error sending welcome email:", error);
            }
        }else{
            return res.status(400).json({message: 'Invalid user data'});
        }
        
    } catch (error) {
        console.log("Error in signup:", error);
        res.status(500).json({message: 'Internal Server error'});
    }
}


export const login = async(req, res) => {
    const {email, password} = req.body;

    try {
        if(!email || !password){
            return res.status(400).json({message: 'All fields are required'});
        }

        const user = await User.findOne({ email });

        if(!user){
            return res.status(400).json({message: 'Invalid credentials'});
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message: 'Invalid credentials'});
        }

        if(user && isPasswordCorrect){
            generateToken(user._id,res);
            res.status(200).json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic,
            })
        }
        
    } catch (error) {
        console.log("Error in login:", error);
        res.status(500).json({message: 'Internal Server error'});
    }
}


export const logout = (_, res) => {
    res.cookie("jwt", "", {maxAge: 0});
    res.status(200).json({message: 'Logged out successfully'});
}


export const updateProfile = async (req, res) => {
    try {
        const { fullName, profilePic } = req.body;

        if (!fullName?.trim()) {
            return res.status(400).json({ message: 'Full name is required' });
        }

        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.fullName = fullName.trim();

        if (profilePic) {
            try {
                const uploadedResponse = await cloudinary.uploader.upload(profilePic, {
                    folder: 'profile_pics',
                    width: 150,
                    height: 150,
                    crop: 'fill',
                });

                if (uploadedResponse.secure_url) {
                    user.profilePic = uploadedResponse.secure_url;
                }
            } catch (uploadErr) {
                console.error("Cloudinary upload error:", uploadErr);
                return res.status(500).json({ message: 'Profile picture upload failed' });
            }
        }

        const updatedUser = await user.save();

        const { password, ...safeUser } = updatedUser._doc;

        res.status(200).json(safeUser);

    } catch (error) {
        console.error("Error in updateProfile:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
