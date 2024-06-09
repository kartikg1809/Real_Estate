import React from 'react'
import { useSelector } from 'react-redux'

const Profile = () => {
  const {currentUser}=useSelector(state=>state.user)
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-2'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <img className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2" src={currentUser.avatar} alt="profile" />
        <input type="text" id="username" placeholder='username' className='border p-3 rounded-lg'/>
        <input type="email" id="email" placeholder='email' className='border p-3 rounded-lg'/>
        <input type="text" id="password" placeholder='password' className='border p-3 rounded-lg'/>
        <button className='bf-slate-700 text-white rounded-lg uppercase hover:placeholder-opacity-95 disabled:opacity-80'></button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}

export default Profile