import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set,get)=>({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isLoggingOut: false,

    checkAuth: async ()=>{
        try {
            const res = await axiosInstance.get('/auth/check')
            set({authUser:res.data})
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
        } catch (error) {
            console.log("Logout Failed:",error)
            toast.error("Logout Failed. Please try again.")
        }finally{
            set({isLoggingOut:false})
        }
    }

}))