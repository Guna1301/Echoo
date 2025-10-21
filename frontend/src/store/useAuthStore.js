import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set,get)=>({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,

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
    }

}))