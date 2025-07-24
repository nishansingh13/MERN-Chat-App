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
function Login(){
  const isMobile = useMediaQuery({ query: "(max-width: 1000px)" })
  
  const [showPass, setShowPass] = useState(false);
  const [status, setLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage] = useState("");
  const [otp_status, setotpstatus] = useState(false);
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
              toast({
                variant: "destructive",
                title: "Invalid OTP. Please try again.",
              });
            }
        }
      }
      catch(err){
        console.error("OTP verification error:", err);
      }
      finally{
        setverifyloading(false);
      }
    }
    const sendotp = async (e) => {
        e.preventDefault();
     
    
      try {
        setLoading(true);
        const res = await axios.post("https://mern-chat-app-fk6w.onrender.com/send-otp", { email });
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
        
        // main-url =https://mern-chat-app-fk6w.onrender.com
        
        const login_data ={email,password};
        const res = await axios.post("https://mern-chat-app-fk6w.onrender.com/api/user/login", login_data);
    
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
        const response = await axios.post("https://mern-chat-app-fk6w.onrender.com/api/user", data);
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
        <div className='min-h-screen bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 flex'>
          {/* Left Side - Hidden on mobile */}
          <div className={`${isMobile ? "hidden" : "flex"} flex-col justify-center items-center w-1/2 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 relative overflow-hidden`}>
            {/* Background decorations */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-32 -translate-y-32"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-32 translate-y-32"></div>
              <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white rounded-full opacity-20"></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10 text-center text-white px-8">
              <div className='flex items-center justify-center gap-3 mb-6'>
                <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                  <MessageSquareTextIcon size={32} className="text-white" />
                </div>
                <h1 className='text-4xl font-bold tracking-wide'>Chatify</h1>
              </div>
              <p className='text-emerald-100 text-lg mb-8 max-w-md leading-relaxed'>
                Connect with friends and family through our modern, secure chat platform
              </p>
              <div className="relative">
                <img 
                  src={login_side} 
                  className="w-full max-w-lg mx-auto opacity-90 drop-shadow-2xl" 
                  alt="Chat illustration"
                />
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className={`${isMobile ? 'w-full' : 'w-1/2'} flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-white`}>
            <div className="w-full max-w-md">
              {/* Mobile Header */}
              {isMobile && (
                <div className="text-center mb-8">
                  <div className='flex items-center justify-center gap-3 mb-4'>
                    <div className="p-2 bg-emerald-100 rounded-full">
                      <MessageSquareTextIcon size={28} className="text-emerald-600" />
                    </div>
                    <h1 className='text-3xl font-bold text-gray-800'>Chatify</h1>
                  </div>
                  <p className='text-gray-600 text-sm'>Your modern chat experience</p>
                </div>
              )}

              {/* Form Card */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-6 sm:p-8 transition-all duration-300 hover:shadow-3xl">
                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                    {status ? 'Create Account' : 'Welcome Back'}
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {status ? 'Join thousands of users worldwide' : 'Sign in to continue your conversations'}
                  </p>
                </div>
                {/* Profile Picture Upload (Register only) */}
                {status && (
                  <div className="flex flex-col items-center mb-6">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 p-1 shadow-lg">
                        <img
                          src={pic || 'https://ui-avatars.com/api/?name=User&background=10b981&color=fff&size=150'}
                          className='w-full h-full rounded-full object-cover bg-white'
                          alt="Profile"
                        />
                      </div>
                      <label htmlFor="file-input" className="absolute -bottom-1 -right-1 bg-emerald-600 rounded-full p-2.5 cursor-pointer hover:bg-emerald-700 transition-all duration-200 shadow-lg group-hover:scale-110">
                        {imageloading ? (
                          <Loader2 className='w-4 h-4 text-white animate-spin' />
                        ) : (
                          <Edit2 className='w-4 h-4 text-white' />
                        )}
                      </label>
                      <input
                        id="file-input"
                        type="file"
                        className="hidden"
                        onChange={handleImageChange}
                        accept="image/*"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-3 font-medium">Upload your profile picture</p>
                  </div>
                )}
              <form
                onSubmit={status ? (e) => sendotp(e) : (e) => hlogin(e)}
                className="space-y-5"
              >
                {/* Name Field (Register only) */}
                {status && (
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50/50 placeholder-gray-400 text-gray-700 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all duration-200"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50/50 placeholder-gray-400 text-gray-700 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all duration-200"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl bg-gray-50/50 placeholder-gray-400 text-gray-700 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all duration-200"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button 
                      type='button' 
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors duration-200" 
                      onClick={() => setShowPass(!showPass)}
                    >
                      {showPass ? <EyeIcon size={20} /> : <EyeClosed size={20} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field (Register only) */}
                {status && (
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPass ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl bg-gray-50/50 placeholder-gray-400 text-gray-700 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all duration-200"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <button 
                        type='button' 
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors duration-200" 
                        onClick={() => setShowPass(!showPass)}
                      >
                        {showPass ? <EyeIcon size={20} /> : <EyeClosed size={20} />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Forgot Password Link (Login only) */}
                {!status && (
                  <div className="text-right">
                    <a href="#" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium hover:underline transition-colors duration-200">
                      Forgot password?
                    </a>
                  </div>
                )}
                {/* Submit Button or OTP Section */}
                {!otp_status ? (
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold py-3.5 px-6 rounded-xl hover:from-emerald-700 hover:to-green-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-3">
                        <Loader2 className='w-5 h-5 animate-spin' />
                        <span>Please wait...</span>
                      </div>
                    ) : (
                      status ? 'Create Account' : 'Sign In'
                    )}
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <label className="block text-sm font-semibold text-gray-700 mb-4">
                        Enter the 6-digit code sent to your email
                      </label>
                      <div className="flex justify-center">
                        <InputOTP maxLength={6} onChange={(e) => setDataPass(e)}>
                          <InputOTPGroup className="gap-2">
                            <InputOTPSlot index={0} className="w-12 h-12 border-2 border-gray-300 rounded-lg text-lg font-semibold text-center focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200" />
                            <InputOTPSlot index={1} className="w-12 h-12 border-2 border-gray-300 rounded-lg text-lg font-semibold text-center focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200" />
                            <InputOTPSlot index={2} className="w-12 h-12 border-2 border-gray-300 rounded-lg text-lg font-semibold text-center focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200" />
                            <InputOTPSeparator className="text-gray-400" />
                            <InputOTPSlot index={3} className="w-12 h-12 border-2 border-gray-300 rounded-lg text-lg font-semibold text-center focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200" />
                            <InputOTPSlot index={4} className="w-12 h-12 border-2 border-gray-300 rounded-lg text-lg font-semibold text-center focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200" />
                            <InputOTPSlot index={5} className="w-12 h-12 border-2 border-gray-300 rounded-lg text-lg font-semibold text-center focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200" />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold py-3.5 px-6 rounded-xl hover:from-emerald-700 hover:to-green-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      onClick={() => verify(data_pass)}
                      disabled={verifyloading}
                    >
                      {verifyloading ? (
                        <div className="flex items-center justify-center gap-3">
                          <Loader2 className='w-5 h-5 animate-spin' />
                          <span>Verifying...</span>
                        </div>
                      ) : (
                        'Verify Code'
                      )}
                    </button>
                  </div>
                )}
              </form>

              {/* Error Message */}
              {errorMessage && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
                  {errorMessage}
                </div>
              )}

              {/* Divider */}
              <div className="my-8 flex items-center">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-4 text-sm text-gray-500 font-medium">
                  {status ? 'Or sign up with' : 'Or continue with'}
                </span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* Social Login */}
              <div className="flex justify-center gap-4 mb-8">
                <button className="p-4 bg-white border-2 border-gray-200 hover:border-gray-300 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-md">
                  <img src={google} className="w-6 h-6" alt="Google" />
                </button>
                <button className="p-4 bg-white border-2 border-gray-200 hover:border-gray-300 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-md">
                  <img src={fb} className="w-6 h-6" alt="Facebook" />
                </button>
                <button className="p-4 bg-white border-2 border-gray-200 hover:border-gray-300 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-md">
                  <img src={twit} className="w-6 h-6" alt="Twitter" />
                </button>
              </div>

              {/* Toggle Login/Register */}
              <div className="text-center">
                <p className="text-gray-600 text-sm sm:text-base">
                  {status ? 'Already have an account? ' : "Don't have an account? "}
                  <button
                    type="button"
                    className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline transition-colors duration-200"
                    onClick={() => {
                      setLogin(!status);
                      setotpstatus(false);
                    }}
                  >
                    {status ? 'Sign in' : 'Sign up'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
        </div>
      );
}
export default Login;