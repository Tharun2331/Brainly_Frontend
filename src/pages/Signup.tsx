import { Button } from "../components/ui/Button";
import {Input} from "../components/ui/Input";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { signupUser } from "../store/slices/authSlice";
import { useState } from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";
export function Signup()
{
// const [loading, setLoading] = useState(false);
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const navigate = useNavigate();
const dispatch = useAppDispatch();
const {loading} = useAppSelector(state => state.auth);
const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!username || !password) {
      alert("Please fill in both email and password.");
      return;
    }

    try {
      // await axios.post(`${BACKEND_URL}/api/v1/signup/`, {
      //   username: userName, // Match the backend's expected field name
      //   password,          // Directly include password
      // });
      await dispatch(signupUser({username,password})).unwrap();
      navigate("/signin")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(`Signup failed: ${error.response?.data?.message || error.message}`);
      } else {
        alert("An unexpected error occurred.");
      }

    }
  };
  return <div className="h-screen w-screen bg-[var(--color-gray-200)] flex justify-center items-center">

  <div className="bg-white rounded-xl border-1 border-gray-300  min-w-48 p-10">
        <Input
            type="text"
            placeholder="username"
            value={username}
            required={true}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
          />

        <Input
            type="password"
            placeholder="••••••••"
            value={password}
            required={true}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          />
      


    <div className="flex justify-center items-center pt-4">
      <Button  variant="primary" text="Signup" fullWidth= {true} loading={loading} onClick={handleSubmit} />
    </div>
     <div>
      <p className="text-center text-sm text-gray-500 mt-4">
        Already have an account? <span className="text-blue-500 cursor-pointer" onClick={() => navigate("/signin")}>Sign In</span>
      </p>
     </div>
  </div>



</div>

}