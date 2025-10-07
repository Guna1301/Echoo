import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { ENV } from '../lib/env.js';


export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if(!token){
            console.log("No token found in cookies");
            return res.status(401).json({message: 'Not authorized, no token'});
        }

        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        if(!decoded){
            console.log("Token verification failed");
            return res.status(401).json({message: 'Not authorized, token failed'});
        }

        const user = await User.findById(decoded.userId).select('-password');
        if(!user){
            console.log("User not found for the given token");
            return res.status(401).json({message: 'Not authorized, user not found'});
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protectRoute middleware:", error);
        res.status(500).json({message: 'Internal Server error'});
    }
}