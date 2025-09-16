// src/pages/Signin.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { signinUser, clearError } from "../store/slices/authSlice";
import { useValidation, signinSchema, parseApiError } from "../utils/validation";

export function Signin() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  
  const dispatch = useAppDispatch();
  const { loading, isAuthenticated } = useAppSelector(state => state.auth);
  const navigate = useNavigate();
  
  const {
    errors,
    touched,
    validate,
    validateField,
    markFieldTouched,
    getFieldError,
  } = useValidation(signinSchema);

  // Clear errors when component mounts
  useEffect(() => {
    dispatch(clearError());
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = e.target.value;
    const newFormData = { ...formData, [field]: newValue };
    setFormData(newFormData);
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      validateField(field, newValue, newFormData);
    }
  };

  const handleBlur = (field: keyof typeof formData) => () => {
    markFieldTouched(field);
    validateField(field, formData[field], formData);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    // Clear previous errors
    dispatch(clearError());
    
    // Validate all fields
    if (!validate(formData)) {
      // Mark all fields as touched to show errors
      Object.keys(formData).forEach(field => markFieldTouched(field));
      
      toast.error("Please fill in all required fields", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      await dispatch(signinUser(formData)).unwrap();
      
      // Show success message
      toast.success("Welcome back! Redirecting to dashboard...", {
        position: "top-right",
        autoClose: 2000,
      });
      
      // Navigation will happen automatically due to isAuthenticated useEffect
      
    } catch (error: any) {
      const parsedError = parseApiError(error);
      
      // Handle specific error codes
      if (parsedError.code === "AUTH_FAILED") {
        // Don't reveal which field is incorrect for security
        toast.error("Invalid username or password", {
          position: "top-right",
          autoClose: 4000,
        });
      } else if (parsedError.code === "NETWORK_ERROR") {
        toast.error("Network error. Please check your connection and try again.", {
          position: "top-right",
          autoClose: 5000,
        });
      } else {
        // Show general error
        toast.error(parsedError.message || "Sign in failed. Please try again.", {
          position: "top-right",
          autoClose: 4000,
        });
      }
      
      // Clear password field for security
      setFormData(prev => ({ ...prev, password: "" }));
    }
  };

  const handleForgotPassword = () => {
    toast.info("Password reset feature coming soon!", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to continue to Brainly</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <Input
            name="username"
            type="text"
            label="Username"
            placeholder="Enter your username"
            value={formData.username}
            required
            onChange={handleInputChange("username")}
            onBlur={handleBlur("username")}
            error={getFieldError("username")}
            touched={touched.has("username")}
            autoComplete="username"
          />

          <Input
            name="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={formData.password}
            required
            onChange={handleInputChange("password")}
            onBlur={handleBlur("password")}
            error={getFieldError("password")}
            touched={touched.has("password")}
            showPasswordToggle
            autoComplete="current-password"
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              Forgot password?
            </button>
          </div>

          <div className="pt-4">
            <Button
              variant="primary"
              text={loading ? "Signing In..." : "Sign In"}
              fullWidth
              loading={loading}
              onClick={handleSubmit}
            />
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
            >
              Sign Up
            </button>
          </p>
        </div>

        {/* Demo credentials notice (remove in production) */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-xs text-center text-blue-700">
            <strong>Demo Account:</strong> You can create a new account or use your existing credentials
          </p>
        </div>
      </div>
    </div>
  );
}