import { useRef, useState } from 'react'
import { LogOutIcon, VolumeOffIcon, Volume2Icon, Loader } from "lucide-react";
import {useAuthStore} from '../store/useAuthStore'
import {useChatStore} from '../store/useChatStore'

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

const ProfileHeader = () => {
  const {logout, authUser, updateProfile,isUpdatingProfile} = useAuthStore()
  const {isSoundEnabled,toggleSound} = useChatStore()
  const [selectedImage, setSelectedImage] = useState(null)

  const fileInputRef = useRef(null)

  const handleImageUpload = (e)=>{
    const file = e.target.files[0];
    if(!file) return;

    const reader = new FileReader();;
    reader.readAsDataURL(file);

    reader.onloadend = async ()=>{
      const base64String = reader.result;
      setSelectedImage(base64String);
      await updateProfile({profilePic: base64String});
    }
  }

  return (
    <div className='p-6 border-b border-slate-700/50'>
      
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className="avatar avatar-online">
            <button
              className='size-14 rounded-full overflow-hidden relative group '
              onClick={()=>fileInputRef.current.click()}
            >
              <img
                className='size-full object-cover '
                src={selectedImage || authUser?.profilePic || "/avatar.png"}
                alt='Profile'
              />
              <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity'>
                <span className='text-white text-sm'>Change</span>
              </div>
              {isUpdatingProfile && (
                <div className='absolute inset-0 bg-black/60 flex items-center justify-center'>
                  <Loader className='size-4'/>
                </div>
              )}
            </button>

            <input
              type='file'
              accept='image/*'
              ref={fileInputRef}
              className='hidden'
              onChange={handleImageUpload}
            />
          </div>

          <div>
            <h3 className='text-slate-200 font-medium text-base max-[180px] truncate'>
              {authUser?.fullName || 'User'}
            </h3>

            <p className='text-slate-400 text-xs'>Online</p>
          </div>
        </div>

        <div className='flex gap-4 items-center'>
          <button
            className='text-slate-400 hover:text-slate-200 transition-colors'
            onClick={logout}
          >
            <LogOutIcon className="size-5"/>
          </button>

          <button
            className='text-slate-400 hover:text-slate-200 transition-colors'
            onClick={()=>{
              mouseClickSound.currentTime = 0;
              mouseClickSound.play().catch((error)=>console.log("Audio play failed: ",error))
              toggleSound()
            }}
          >
            {isSoundEnabled?(
              <Volume2Icon className='size-5' />
            ):(
              <VolumeOffIcon className='size-5' />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader