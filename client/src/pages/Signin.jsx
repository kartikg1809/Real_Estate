import React,{useState} from 'react'
import { Link,useNavigate } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import { signInStart,signInSuccess,signInFailure } from '../app/user/userSlice'
import OAuth from '../components/OAuth'

const Signin = () => {
  const navigate=useNavigate();
  const [formData,setFormData]=useState([]);
  const {loading,error}=useSelector((state)=>state.user);//to change user state as we can have multiple states
  const dispatch=useDispatch();
  const handleChange=(e)=>{
    setFormData({
      ...formData,
      [e.target.id]:e.target.value,
    });
  };
  const handleSubmit=async (e)=>{
    e.preventDefault(); 
    try {
      dispatch(signInStart());
   const res=await fetch('/api/auth/signin',{
    method:'POST',
    headers:{
      'Content-Type': 'application/json',
    },
    body:JSON.stringify(formData),
   });
   const data=await res.json();
   if(data.success===false){
    dispatch(signInFailure(data.message));
    return;
   }
   dispatch(signInSuccess(data));
   navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form className='flex flex-col gap-4'>
        <input type="text" placeholder='email' className='border p-3 rounded-lg focus:outline-none' id='email' onChange={handleChange}/>
        <input type="text" placeholder='passsword' className='border p-3 rounded-lg focus:outline-none' id='password' onChange={handleChange}/>
        <button disabled={loading} onClick={handleSubmit}className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 diabled:opacity-80'>{loading?"loading...":"SIGN IN"}</button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Do not an account?</p>
        <Link to={"/sign-up"}>
          <span className='text-blue-700'>Sign Up</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}

export default Signin