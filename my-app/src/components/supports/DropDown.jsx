import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { ChatState } from "@/Context/ChatProvider";
import { useNavigate } from "react-router-dom";
  
  function DropDown(){
    const navigate = useNavigate();
    const {user} = ChatState();
    const logout = ()=>{
      navigate("/chat");
          localStorage.removeItem("userInfo");

    }
   
  return (
    <>
      <div>  
    <DropdownMenu>
    <DropdownMenuTrigger><img src="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" className="w-[3rem] h-[3rem] p-1 mr-[4rem]  rounded-full"/>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel >My Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem >Profile</DropdownMenuItem>
      <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
  </div>
    </>
  )
  
  }
  export default DropDown;