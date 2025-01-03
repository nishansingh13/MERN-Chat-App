import React, { useEffect } from 'react';
import { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import google from '../assets/google.png';
import fb from '../assets/fb.png';
import twit from '../assets/twitter.png';
import axios from 'axios';
import { Edit2, EyeIcon } from 'lucide-react';
import { EyeClosed } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';
import login_side from "../assets/login_sidebar.png";
import { MessageSquareTextIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Label } from './ui/label';
import { Button } from './ui/button';
import { ChatState } from '@/Context/ChatProvider';
function Login(){
  const isIpad = useMediaQuery({query:"(max-width:1500px)"})
   const  isMobile = useMediaQuery({ query: "(max-width: 1000px)" })
   const ismiddle = useMediaQuery({query:"(max-width:1527px)"})
   const {user} =ChatState();
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
    const [cotp,setcotp] = useState(null);
    const [loading,setLoading] = useState(false);
    const [verifyloading,setverifyloading] = useState(false);
    const [imageloading,setimageloading] = useState(false);
    const navigate = useNavigate();
    const [pic,setimage] = useState("");
    const submitImage = async (file) => {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "ml_default");
      data.append("cloud_name", "dqsx8yzbs");
  
      setimageloading(true);
      try {
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dqsx8yzbs/image/upload",
          data
        );
        console.log("Upload successful:", response.data);
        setimage(response.data.secure_url); // Update image URL on successful upload
      } catch (err) {
        console.error("Error uploading the image:", err);
      }
      setimageloading(false);
    };
  
    // Handle image input change (triggered by clicking the image)
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        submitImage(file); // Call the function to upload the image
      }
    };
    const verify = async(query)=>{  
      
      if (query.length !== 6) {
        toast({
          variant: "destructive",
          title: "Please enter complete OTP.",
        });
        return;
      }
      try{
        setverifyloading(true);
        if(cotp!==null){
            if(cotp==query){
              toast({
                title :"Otp verified successfully!"
              },1000)
              hsignup();
            }
            else{

            }
        }
      }
      catch(err){

      }
      finally{
        setverifyloading(false);
      }
    }
    const sendotp = async (e) => {
        e.preventDefault();
     
    
      try {
        setLoading(true);
        const res = await axios.post("https://mern-chat-app-5-lyff.onrender.com/send-otp", { email });
        setotpstatus(true);
        if (res.status === 200) {
          toast({
            title: "OTP sent. Please check your email!",
          });
          setcotp(res.data.message);
        }
      } catch (err) {
        console.error(err.response?.data?.error || err.message);
        toast({
          variant: "destructive",
          title: err.response?.data?.error || "Please enter a valid email!",
        });
      } finally {
        setLoading(false);
      }
    };
    
    const hlogin = async (e) => {
      e.preventDefault();
      console.log("not anymore");
    
      if (!email || !password) {
        alert("Please fill all fields");
        return;
      }
      
      try {
        setLoading(true);
        
        // main-url = https://mern-chat-app-5-lyff.onrender.com/api
        
        const login_data ={email,password};
        const res = await axios.post("https://mern-chat-app-5-lyff.onrender.com/api/user/login", login_data);
    
        if (res.status === 200) {
          console.log("Login successful");
          const userData = res.data;
          localStorage.setItem("userInfo", JSON.stringify(userData));
          console.log("User data saved to localStorage");
          navigate("/chats");
          window.location.reload();
          
          
            toast({
           
              variant: "",
              title: "Login Successfull",
              className: "fixed top-5 left-1/2 transform -translate-x-1/2 z-50 max-w-md bg-green-500 text-white",
              
            
          },1000);
         
         
          
          
          
        }
      } catch (err) {
        console.error(err.response?.data?.message || "An error occurred");
        toast({
           
          variant: "destructive",
          title: "Uh oh! Wrong email or password",
          description: "Please enter something to search.",
          
        })

      }
      finally{
        setLoading(false);
      }
    };
    
   
   const hsignup = async()=>{
  
    
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }
    if(password!==confirmPassword){
      alert("Passwords do not match");
      return;
    }
  
    const data = { name, email,password ,pic}
    console.log(pic);
  

      try {
        const response = await axios.post("https://mern-chat-app-5-lyff.onrender.com/api/user", data);
        if(response.status==201){
          
          toast({
           
            variant: "",
            title: "Registration Successfull",
            className: "fixed top-5 left-1/2 transform -translate-x-1/2 z-50 max-w-md bg-green-500 text-white",
            
          
        },1000);
        
       
          localStorage.setItem('userInfo', JSON.stringify(response.data));
          navigate('/chats');
          window.location.reload();
        }
       
      } catch (error) {

        ( error.response ?  toast({
           
          variant: "destructive",
          title: error.response.data.message,
          className: "fixed top-5 left-1/2 transform -translate-x-1/2 z-50 max-w-md  text-white",
          
        
      },1000) :error.message);
        
      }
      finally{
        setLoading(false);
      }
        
   
    
  }
  
  
    return (
        <div className=' py-[2rem] bg-green-600 h-lvh flex justify-evenly '>
          <div className={`bg-green-600 w-[30%] mx-2 ${isMobile?"hidden":"w-[30%]"}`}>
            <div className='flex gap-2 m-[1rem]'>
            <button type='button' className='text-white '><MessageSquareTextIcon size={25}/></button>
            <div className='text-white font-semibold text-[1.6rem]'>
              Chatify
            </div>
            </div>
            <div className='text-gray-300 relative left-[3rem] bottom-3'>Responsive Tailwind React App </div>
            
            <img src={login_side} className={`absolute ${ismiddle?"left-3":""} ${isIpad?"left-1":"left-[8rem]"}  w-[40rem] left-[8rem] top-[18rem]`} />
          </div>
          <div className={`border rounded-2xl ${!isMobile?"w-[70%]":"w-[100%]"} h-[100%] mx-[1rem] bg-white flex items-center justify-center `}>
            <div className={` ${isMobile?"w-[90%]":"w-[50%]"} `}>
            <div className=''>
              <div className={` relative ${status?"bottom-[1rem]":"bottom-[4rem]"} ${isMobile?"text-[1.2rem]":"text-[1.4rem]"} flex flex-col items-center justify-center `}>
              <div className=''>Welcome Back</div>
              <div className='text-[80%] text-gray-500'>Sign in to your account</div>
              </div>
              <div className="m-[1.5rem] text-[1.5rem] justify-between flex font-semibold">
                {status ? 'Create your account' : 'Login to your Account'}
                <div className={`${!imageloading ? "flex" : "flex-col"} items-center justify-center p-4`}>
  {status &&    <div className="py-2 rounded-md">
        {/* Custom label for the file input */}
        <label htmlFor="file-input" className="relative cursor-pointer bottom-5">
          <img
            src={pic || 'https://res.cloudinary.com/dqsx8yzbs/image/upload/v1735916416/default_j0t1tk.png'}
            className='w-[3rem] h-[3rem] rounded-full relative mx-[2rem]'
            alt="avatar"
          />
          <Edit2 className='w-[1.3rem] relative left-[4rem] bottom-5 text-gray-500' />
        </label>
        <input
          id="file-input"
          type="file"
          className="hidden"
          onChange={handleImageChange} // Trigger file selection when image is clicked
        />
        {imageloading &&
         
          <Loader2 className='text-green-600 animate-spin hover:bg-green-700 mx-2' />
        }
      </div>}
    </div>
              </div>
              <form
                onSubmit={status ? (e) => sendotp(e) : (e) => hlogin(e)}
                className="mx-auto"
              >
                  {status ? (
                    <div className="relative my-4 w-[80%] mx-auto">
                      <input
                        type="text"
                        id="name"
                        placeholder="Name"
                        className="bg-gray-100 p-2 w-full rounded-sm placeholder-black pr-10 outline-none"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                     
                     
                    </div>
                  ) : (
                    ''
                  )}
                <div className="w-[80%] mx-auto">
                  
                  <input
                    type="email"
                    id="email"
                    placeholder="Email"
                    className="bg-gray-100 p-2 w-full rounded-sm placeholder-black outline-none"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                   
                  <div className="relative mt-4">
                    <input
                      type={showPass ? 'text' : 'password'}
                      id="pass"
                      placeholder="Password"
                      className="bg-gray-100 p-2 w-full rounded-sm placeholder-black pr-10 outline-none"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />

                   
                    <button type='button' className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent w-[1.1rem] cursor-pointer " onClick={() => setShowPass(!showPass)}
                    > {showPass ? <EyeIcon className='p-[0.1rem]'/>: <EyeClosed className='p-[0.1rem]' />}</button>
                  </div>
                  
                  {status ? (
                    <div className="relative mt-4">
                      <input
                        type={showPass ? 'text' : 'password'}
                        id="pass"
                        placeholder="Confirm Password"
                        className="bg-gray-100 p-2 w-full rounded-sm placeholder-black pr-10 outline-none"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                       <button type='button' className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent w-[1.1rem] cursor-pointer " onClick={() => setShowPass(!showPass)}
                    > {showPass ? <EyeIcon className='p-[0.1rem]'/>: <EyeClosed className='p-[0.1rem]' />}</button>
                    </div>
                  ) : (
                    ''
                  )} 

                  
                  {!status ? (
                    <div
                      className={`ml-[60%] mt-2 cursor-pointer hover:underline underline-offset-4 ${isMobile?"text-[77%]":""}`}
    
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
         
         <Loader2 className='animate-spin text-green-500'/>
        </div>
      ) : (

        <div className='   mx-auto'>
        <button
          className="bg-green-600 border rounded-md p-2 w-[80%] mx-auto text-white my-[1rem] cursor-pointer flex items-center justify-center"
        >
          {status ? 'Register' : 'Login'}
        </button>
        </div>
      )
    ) : (
      <div className={` ${!isMobile ? "flex":""} w-[80%] mx-auto justify-between my-2 `}>
        <InputOTP
  maxLength={6} onChange={(e)=>setDataPass(e)}  
 
>
  <InputOTPGroup className="mx-4" >
    <InputOTPSlot index={0}  className="border border-green-600" />
    <InputOTPSlot index={1} className="border border-green-600"  />
    <InputOTPSlot index={2} className="border border-green-600"/>
    <InputOTPSeparator />
    <InputOTPSlot index={3} className="border border-green-600"/>
    <InputOTPSlot index={4}className="border border-green-600" />
    <InputOTPSlot index={5} className="border border-green-600" />
   
  </InputOTPGroup>
</InputOTP>


      {!verifyloading?(
        <div
          type="button"
          className="bg-green-600 text-white w-[4rem] px-3 h-[2rem] mt-1 pt-1 mx-3 rounded-md cursor-pointer font-semibold"
          onClick={() => {
            verify(data_pass);
          }}
        >
          Verify
        </div>
           ):(<Loader2 className='animate-spin text-green-600 relative right-7 top-1'/>)}
      </div>
     
    )}
    
              </form>
              {errorMessage && (
                <div className="text-red-500 text-center mt-2">{errorMessage}</div>
              )}
            </div>
            <div className="border border-gray-400 w-[70%] mx-auto"></div>
            <div className={`flex justify-between mx-auto w-[80%] ${isMobile?"text-[0.8rem]":"text-[1rem]"}  `}>
            <div className="my-2">
              {status ? 'Or Sign up with' : 'Or Sign in with'}
            </div>
            <div className=" my-2">
              {status ? 'Already have an account? ' : "Don't have an account ?  "}
              <span
                className="text-green-500 cursor-pointer hover:underline underline-offset-8"
                onClick={() => {
                  setLogin(!status);
                }}
              >
                {status ? 'Sign in' : 'Sign up'}
              </span>
            </div>
            </div>
            <div className="flex justify-evenly w-[60%]  mx-auto my-5 ">
              <img
                src={google}
                className="w-[2.4rem] rounded-full p-1 bg-gray-200 cursor-pointer"
                alt=""
              />
              <img
                src={fb}
                className="w-[2.4rem] rounded-full p-1 bg-gray-200 cursor-pointer"
                alt=""
              />
              <img
                src={twit}
                className="w-[2.4rem] rounded-full p-1 bg-gray-200 cursor-pointer"
                alt=""
              />
            </div>
           
           
          </div>
          </div>
        </div>
      );
}
export default Login;