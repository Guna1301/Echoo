import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE==='development' ? 'http://localhost:3000' : '/';

export const useAuthStore = create((set,get)=>({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isLoggingOut: false,
    isUpdatingProfile: false,
    socket:null,
    onlineUsers:[],

    checkAuth: async ()=>{
        try {
            const res = await axiosInstance.get('/auth/check')
            set({authUser:res.data})

            get().connectSocket();
        } catch (error) {
            console.log("Auth Check Failed:",error)
            set({authUser:null})
        }finally{
            set({isCheckingAuth:false})
        }
    },


    signup : async(data) =>{
        set({isSigningUp:true})
        try {
            const res = await axiosInstance.post('/auth/signup', data)
            set({authUser:res.data})

            toast.success("Signup Successful!")

            get().connectSocket();
        } catch (error) {
            console.log("Signup Failed:",error)
            toast.error("Signup Failed. Please try again.")
            set({authUser:null})
        }finally{
            set({isSigningUp:false})
        }
    },


    login : async(data) =>{
        set({isLoggingIn:true})
        try {
            const res = await axiosInstance.post('/auth/login', data)
            set({authUser:res.data})

            toast.success("logged in Successfully!")

            get().connectSocket();
        } catch (error) {
            console.log("login Failed:",error)
            toast.error("login Failed. Please try again.")
            set({authUser:null})
        }finally{
            set({isLoggingIn:false})
        }
    },

    logout: async()=>{
        set({isLoggingOut:true})
        try {
            const res = await axiosInstance.post('/auth/logout')
            set({authUser:null})
            toast.success("Logged out Successfully!")

            get().disconnectSocket();
        } catch (error) {
            console.log("Logout Failed:",error)
            toast.error("Logout Failed. Please try again.")
        }finally{
            set({isLoggingOut:false})
        }
    },

    updateProfile: async(data)=>{
        set({isUpdatingProfile:true})
        try {
            const res = await axiosInstance.put('/auth/update-profile', data)
            set({authUser:res.data})
            toast.success("Profile updated successfully!")
        } catch (error) {
            console.log("Profile update failed:", error)
            toast.error("Profile update failed. Please try again.")
        }finally{
            set({isUpdatingProfile:false})
        }
    },

    connectSocket: ()=>{
        const authUser = get().authUser;
        if(!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {withCredentials:true});

        socket.connect();

        set({socket});

        socket.on('getOnlineUsers', (userIds)=>{
            set({onlineUsers:userIds})
        });
    },

    disconnectSocket: ()=>{
        const socket = get().socket;
        if(socket.connected){
            socket.disconnect();
            set({socket:null});
        }
    }

}))