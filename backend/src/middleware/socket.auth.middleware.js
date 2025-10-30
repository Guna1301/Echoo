import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import {ENV} from '../lib/env.js';

export const socketAuthMiddleware = async (socket, next) => {
    try {
        const token = socket.handshake.headers.cookie
            ?.split('; ')
            .find(row => row.startsWith('jwt='))
            ?.split('=')[1];

        if(!token) {
            return next(new Error('Authentication error: No token provided'));
        }

        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        if(!decoded){
            console.log('socket auth failed: invalid token');
            return next(new Error('Authentication error: Invalid token'));
        }

        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            console.log('socket auth failed: user not found');
            return next(new Error('Authentication error: User not found'));
        }

        socket.user = user;
        socket.userId = user._id.toString();

        console.log('socket auth successful for user:', socket.userId);

        next();

    } catch (error) {
        console.error('socket auth error:', error);
        next(new Error('Authentication error: ' + error.message));
    }
}