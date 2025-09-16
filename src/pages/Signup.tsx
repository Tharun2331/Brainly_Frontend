// src/pages/Signup.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../components/ui/Button";
import { Input, PasswordStrengthIndicator } from "../components/ui/Input";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { signupUser, clearError } from "../store/slices/authSlice";
import { useValidation, signupSchema, parseApiError } from "../utils/validation";

export function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector(state => state.auth);
  
  const {
    touched,
    validate,
    validateField,
    clearErrors,
    markFieldTouched,
    getFieldError,
  } = useValidation(signupSchema);

  // Clear errors when component mounts
  useEffect(() => {
    dispatch(clearError());
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = e.target.value;
    const newFormData = { ...formData, [field]: newValue };
    setFormData(newFormData);
    
    // Validate field in real-time after first blur
    if (touched.has(field)) {
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
      
      // Show toast for validation errors
      toast.error("Please correct the errors in the form", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      await dispatch(signupUser(formData)).unwrap();
      
      // Show success message
      toast.success("Account created successfully! Redirecting to sign in...", {
        position: "top-right",
        autoClose: 2000,
      });
      
      // Clear form
      clearErrors();
      setFormData({ username: "", password: "" });
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
      
    } catch (error: any) {
      const parsedError = parseApiError(error);
      
      // Show field-specific errors
      if (parsedError.fieldErrors) {
        Object.entries(parsedError.fieldErrors).forEach(([field]) => {
          markFieldTouched(field);
        });
      }
      
      // Show general error toast
      toast.error(parsedError.message || "Signup failed. Please try again.", {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
          <p className="text-gray-600">Join Brainly to start organizing your content</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <Input
            name="username"
            type="text"
            label="Username"
            placeholder="Choose a username"
            value={formData.username}
            required
            onChange={handleInputChange("username")}
            onBlur={handleBlur("username")}
            error={getFieldError("username")}
            touched={touched.has("username")}
            helperText="3-20 characters, letters, numbers, and underscores only"
            autoComplete="username"
          />

          <div>
            <Input
              name="password"
              type="password"
              label="Password"
              placeholder="Create a strong password"
              value={formData.password}
              required
              onChange={handleInputChange("password")}
              onBlur={handleBlur("password")}
              error={getFieldError("password")}
              touched={touched.has("password")}
              showPasswordToggle
              autoComplete="new-password"
            />
            <PasswordStrengthIndicator 
              password={formData.password} 
              show={formData.password.length > 0}
            />
          </div>

          <div className="pt-4">
            <Button
              variant="primary"
              text={loading ? "Creating Account..." : "Sign Up"}
              fullWidth
              loading={loading}
              onClick={handleSubmit}
            />
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signin")}
              className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
            >
              Sign In
            </button>
          </p>
        </div>

        {/* Terms and Privacy Notice */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-center text-gray-500">
            By signing up, you agree to our{" "}
            <a href="#" className="text-purple-600 hover:underline">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="text-purple-600 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}