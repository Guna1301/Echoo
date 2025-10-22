import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useChatStore = create((set,get)=>({
    allContacts: [],
    chats: [],
    message : [],
    activeTab: "chats",
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isSoundEnabled: localStorage.getItem('isSoundEnabled') === 'true' ? true : false,

    toggleSound: ()=>{
        localStorage.setItem('isSoundEnabled', !get().isSoundEnabled)
        set({isSoundEnabled: !get().isSoundEnabled})
    },

    setActiveTab: (tab)=> set({activeTab: tab}),

    setSelectedUser: (user)=> set({selectedUser: user}),

    getAllContacts: async()=>{
        set({isUsersLoading: true})
        try {
            const res = await axiosInstance.get('/messages/contacts');
            set({allContacts: res.data})
        } catch (error) {
            console.error("Error fetching contacts:", error);
            toast.error("Failed to load contacts. Please try again.")
        }finally{
            set({isUsersLoading: false})
        }
    },

    getMyChatPartners: async()=>{
        set({isUsersLoading: true})
        try {
            const res = await axiosInstance.get('/messages/chats');
            set({chats: res.data})
        } catch (error) {
            console.error("Error fetching chat partners:", error);
            toast.error("Failed to load chat partners. Please try again.")
        }finally{
            set({isUsersLoading: false})
        }
    }

}))