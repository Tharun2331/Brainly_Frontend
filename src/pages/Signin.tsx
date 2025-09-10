import { Button } from "../components/ui/Button";
import {Input} from "../components/ui/Input";
import { useState,useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { signinUser,clearError  } from "../store/slices/authSlice";
export function Signin()
{
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const dispatch = useAppDispatch();
const { loading, isAuthenticated } = useAppSelector(state => state.auth);
const navigate = useNavigate();
  
// Clear any existing errors when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async () => {
    // Clear any previous errors
    dispatch(clearError());

    if (!username || !password) {
      toast.error("Please fill in both username and password.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      // Dispatch Redux action
      const resultAction = await dispatch(signinUser({ username, password }));
      
      if (signinUser.fulfilled.match(resultAction)) {
        toast.success("Signed in successfully!", {
          position: "top-right",
          autoClose: 2000,
        });
        // Navigation will happen automatically due to useEffect above
      }
    } catch (error) {
      // Error handling is done by Redux, but we can show a toast
      toast.error("Signin failed. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };


return <div className="h-screen w-screen bg-[var(--color-gray-200)] flex justify-center items-center">

  <div className="bg-white rounded-xl border-1 border-gray-300  min-w-48 p-10">
    <Input type="text" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)}  required={true} />
    <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required={true} />
    <div className="flex justify-center items-center pt-4">
      <Button  variant="primary" text="Signin" fullWidth= {true} loading={loading} onClick={handleSubmit} />
    </div>
    <div>
      <p className="text-center text-sm text-gray-500 mt-4">
        Don't have an account? <span className="text-blue-500 cursor-pointer" onClick={() => navigate("/signup")}>Sign Up</span>
      </p>
    </div>
  </div>



</div>



}