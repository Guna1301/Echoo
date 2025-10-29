import { useChatStore } from "../store/useChatStore"
import { useAuthStore } from "../store/useAuthStore"
import { useEffect } from "react";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceHolder";

const ChatContainer = () => {

  const {selectedUser, getMessagesByUserId, messages} = useChatStore();
  const {authUser} = useAuthStore();

  useEffect(()=>{
    getMessagesByUserId(selectedUser?._id);
  },[selectedUser,getMessagesByUserId])
  
  return (
    <>
      <ChatHeader/>
      <div className="felx-1 px-6 overflow-y-auto py-8">
        {
          messages.length>0?(
            <h1>some messages there</h1>
          ):(<NoChatHistoryPlaceholder name={selectedUser?.fullName} />)
        }
      </div>
    </>
  )
}

export default ChatContainer