import React from 'react';
import { useState,useEffect,useNavigate} from 'react';
import logo from '../assets/logo.png';
import close from '../assets/close.png';
import open from '../assets/open.png';
import google from '../assets/google.png';
import fb from '../assets/fb.png';
import twit from '../assets/twitter.png';
import vid from '../assets/arrow.webm';
import axios from 'axios';
// import mongoose from 'mongoose';
function Login(){
    
    const [showPass, setShowPass] = useState(false);
    const [status, setLogin] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [userdata, setuserdata] = useState([]);
    const [otp_status, setotpstatus] = useState(false);
    const [otp, setotp] = useState("");
    const [data_pass, setDataPass] = useState(null);
    const [name,setName] = useState("");
    const [loading,setLoading] = useState(false);
    const hlogin = async(e)=>{
      e.preventDefault();
      console.log({email,password})
      if(!email || !password){
        alert("Please fill all");
        return;
      }
      const login_data = {email,password};
      try{
          const res = await axios.post("http://localhost:5000/api/user/login",login_data);
          console.log(res.data);
          if(res.status==200){
            console.log("done");
          }
          console.log(res.status);
         
      }catch(err){
        console.log(err.response.data.message)
      }
    }
  
   const hsignup = async(e)=>{
    e.preventDefault();
    
    // setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }
    if(password!==confirmPassword){
      alert("Passwords do not match");
      return;
    }
    
   
    const data = { name, email,password};

      try {
        const response = await axios.post("http://localhost:5000/api/user", data);
        console.log("User created:", response.data);
      } catch (error) {
        ( error.response ? alert(error.response.data.message) : error.message);
      }
        
   
    
  }
  
    return (
        <div className='py-[3rem] bg-purple-200 h-lvh '>
          <div className="border border-black w-[25rem] h-[40rem] mx-auto bg-white ">
            <div>
              <img src={logo} className="mx-auto w-[8rem]"  />
              <div className="m-[1.5rem] text-[1.5rem] font-semibold">
                {status ? 'Create your account' : 'Login to your Account'}
              </div>
              <form
                onSubmit={status ? (e) => hsignup(e) : (e) => hlogin(e)}
                className="mx-auto"
              >
                  {status ? (
                    <div className="relative my-4 w-[80%] mx-auto">
                      <input
                        type="text"
                        id="name"
                        placeholder="Name"
                        className="bg-gray-100 p-2 w-full rounded-sm placeholder-black pr-10"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      {console.log(name)}
                     
                    </div>
                  ) : (
                    ''
                  )}
                <div className="w-[80%] mx-auto">
                  
                  <input
                    type="email"
                    id="email"
                    placeholder="Email"
                    className="bg-gray-100 p-2 w-full rounded-sm placeholder-black"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                   
                  <div className="relative mt-4">
                    <input
                      type={showPass ? 'text' : 'password'}
                      id="pass"
                      placeholder="Password"
                      className="bg-gray-100 p-2 w-full rounded-sm placeholder-black pr-10"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <img
                      src={showPass ? open : close}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent w-[1.1rem] cursor-pointer"
                      alt="Show Password"
                      onClick={() => setShowPass(!showPass)}
                    />
                  </div>
                  
                  {status ? (
                    <div className="relative mt-4">
                      <input
                        type={showPass ? 'text' : 'password'}
                        id="pass"
                        placeholder="Confirm Password"
                        className="bg-gray-100 p-2 w-full rounded-sm placeholder-black pr-10"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <img
                        src={showPass ? open : close}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent w-[1.1rem] cursor-pointer"
                        alt="Show Password"
                        onClick={() => setShowPass(!showPass)}
                      />
                    </div>
                  ) : (
                    ''
                  )}
                  
                  {!status ? (
                    <div
                      className="ml-[60%] mt-2 cursor-pointer hover:underline underline-offset-4"
    
                    >
                      Forgot password?
                    </div>
                  ) : (
                    ''
                  )}
                </div>
                {!otp_status ? (
      loading ? (
        
        <div className="flex justify-center items-center h-[2.5rem]">
          {console.log("data")}
           <video 
          src={vid} 
          autoPlay 
          loop 
          muted 
          className='w=[2rem]'
        />
        </div>
      ) : (
        <button
          className="bg-purple-500 border rounded-md p-2 w-[70%] ml-[2.7rem] text-white my-[1rem] cursor-pointer"
        >
          {status ? 'Register' : 'Login'}
        </button>
      )
    ) : (
      <div className="flex justify-between mx-auto w-[75%]">
        <div className="text-blue-500 my-2">Enter OTP:</div>
        <input
          type="text"
          onChange={(e) => setotp(e.target.value)}
          className="outline-none w-[6.5rem] border border-purple-400 my-1"
        />
        <div
          type="button"
          className="bg-purple-400 text-white px-2 h-[2rem] mt-1 pt-1 rounded-md cursor-pointer"
          onClick={() => {
            verify(data_pass);
          }}
        >
          Verify
        </div>
      </div>
    )}
    
              </form>
              {errorMessage && (
                <div className="text-red-500 text-center mt-2">{errorMessage}</div>
              )}
            </div>
            <div className="border border-gray-400 w-[70%] mx-auto"></div>
            <div className="w-[70%] mx-auto my-4">
              {status ? 'Or Sign up with' : 'Or Sign in with'}
            </div>
            <div className="flex justify-evenly w-[60%]  mx-auto">
              <img
                src={google}
                className="w-[2.4rem] rounded-full p-1 bg-gray-100 cursor-pointer"
                alt=""
              />
              <img
                src={fb}
                className="w-[2.4rem] rounded-full p-1 bg-gray-100 cursor-pointer"
                alt=""
              />
              <img
                src={twit}
                className="w-[2.4rem] rounded-full p-1 bg-gray-100 cursor-pointer"
                alt=""
              />
            </div>
            <div className="mx-auto w-[75%] my-2">
              {status ? 'Already have an account' : "Don't have an account?"}{' '}
              <span
                className="text-purple-400 cursor-pointer hover:underline underline-offset-8"
                onClick={() => {
                  setLogin(!status);
                }}
              >
                {status ? 'Sign in' : 'Sign up'}
              </span>
            </div>
          </div>
        </div>
      );
}
export default Login;