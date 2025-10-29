import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import toast from "react-hot-toast";

export const useChatStore = create((set,get)=>({
    allContacts: [],
    chats: [],
    messages : [],
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
    },

    getMessagesByUserId: async(userId)=>{
        set({isMessagesLoading: true})
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({messages: res.data})
        } catch (error) {
            console.error("Error fetching messages:", error);
            toast.error("Failed to load messages. Please try again.")
        }finally{
            set({isMessagesLoading: false})
        }
    },

    sendMessage: async(messageData)=>{
        const {selectedUser,messages} = get();
        const {authUser} = useAuthStore.getState();
        
        const tempId = `temp-${Date.now()}`;

        const optimisticMessage = {
            _id: tempId,
            senderId: authUser._id,
            receiverId: selectedUser._id,
            text: messageData.text,
            image: messageData.image,
            createdAt: new Date().toISOString(),
            isOptimistic: true
        }

        set({messages: [...messages, optimisticMessage]})

        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser?._id}`, messageData);
            set({messages: messages.concat(res.data)})
        } catch (error) {
            set({messages: messages.filter(msg=> msg._id !== tempId)})
            toast.error("Failed to send message. Please try again.")
            console.error("Error sending message:", error);
        }
    }

}))