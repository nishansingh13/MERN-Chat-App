import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import UserData from './components/Userdata';
import { useNavigate } from 'react-router-dom';
import vid from './assets/arrow.webm'
function App() {
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
  const navigate = useNavigate();
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await fetch("http://localhost:5000/register");
        if (!res.ok) throw "Error fetching user data";
        const data = await res.json();
        setuserdata(data);
      } catch (err) { 
        console.log("Error fetching data", err);
      }
    };
    fetchdata();
  }, [])
  const handleotp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const userData = { email,password,name };

    const exist = userdata.some(i => i.email === userData.email);
    if (exist) {
      alert("Email already registered");
      return;
    }
    setLoading(true);
    console.log("Email being sent for OTP:", email);
    try {
      const res = await fetch("http://localhost:5000/send-otp", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) console.log("Error sending OTP");
      const data = await res.json();
      setotpstatus(true);
      console.log("Response Data:", data);
      setDataPass(data);  
    } catch (err) {
      console.log("Error in handleotp:", err);
    }
    finally {
      setLoading(false); 
    }
  };

  const verify = async () => {
    
    
    console.log(otp + "h");
    console.log(data_pass);

  
    if (otp == data_pass) {
      
      alert("OTP verified successfully!");
      handleSubmit(); 
    } else {
     
      alert("Wrong OTP, please try again.");
    }
  };


  const hlogin = async (e) => {
    e.preventDefault();
    const login_data = { email, password };
    const exist = userdata.some(i => i.email === login_data.email && i.password === login_data.password);
    if (exist) {
      alert("Login successful");
      let pri = 'admin@123';
      let pas = 'admin';
      let admin_data = {pri,pas}
      console.log(admin_data);
      console.log(login_data);
      if (login_data.email == admin_data.pri && login_data.password == admin_data.pas) {
        navigate("/register");
    }
      
    } else {
      alert("Email or password is wrong");
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault(); 

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const userData = { email, password , name};

    const exist = userdata.some(i => i.email === userData.email);
    if (exist) {
      alert("Email already registered");
    }

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      });
      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        setEmail("");
        setConfirmPassword("");
        setName("");
        setPassword("");
        setotpstatus(false);
      } else {
        setErrorMessage(result.error || "Something went wrong!");
      }
    } catch (error) {
      setErrorMessage("Error occurred while registering");
    }
  };

  return (
  
      <Routes>
        <Route
          path="/"
          element={
            <Login
              showPass={showPass}
              setShowPass={setShowPass}
              status={status}
              setLogin={setLogin}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
              handleSubmit={handleSubmit}
              handleotp={handleotp}
              hlogin={hlogin}
              otp_status={otp_status}
              setotp={setotp}
              data_pass={data_pass}
              setotpstatus={setotpstatus}
              verify={verify}
              setName={setName}
              name={name}
              loading={loading}
              setLoading={setLoading}
            />
          }
        />
        <Route
          path="/register"
          //ok
          element={<UserData userdata={userdata} />}
        />
      </Routes>
    
  );
}

export default App;