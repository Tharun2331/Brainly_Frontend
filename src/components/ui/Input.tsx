// src/components/ui/Input.tsx
import { forwardRef, useState } from "react";

interface InputProps {
  placeholder: string;
  required?: boolean;
  defaultValue?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
  label?: string;
  helperText?: string;
  showPasswordToggle?: boolean;
  autoComplete?: string;
  name?: string;
}

interface MultiInputProps {
  placeholder: string;
  required?: boolean;
  defaultValue?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  error?: string;
  touched?: boolean;
  label?: string;
  helperText?: string;
  maxLength?: number;
  rows?: number;
  name?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { 
      placeholder, 
      required, 
      defaultValue = "", 
      type = "text", 
      value, 
      onChange,
      onBlur,
      error,
      touched,
      label,
      helperText,
      showPasswordToggle = false,
      autoComplete,
      name
    }, 
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const hasError = touched && error;
    
    const inputType = showPasswordToggle && showPassword ? "text" : type;

    return (
      <div className="mb-4">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            name={name}
            placeholder={placeholder}
            type={inputType}
            required={required}
            autoComplete={autoComplete}
            className={`
              w-full px-4 py-2 border rounded-md transition-colors duration-200
              ${hasError 
                ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" 
                : "border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              }
              ${touched && !error ? "border-green-500" : ""}
              focus:outline-none
            `}
            {...(value !== undefined ? { value, onChange } : { defaultValue })}
            onBlur={onBlur}
            aria-invalid={!!hasError}
            aria-describedby={hasError ? `${name}-error` : undefined}
          />
          
          {/* Password visibility toggle */}
          {showPasswordToggle && type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" 
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                  />
                </svg>
              )}
            </button>
          )}
          
          {/* Success checkmark */}
          {touched && !error && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>
        
        {/* Helper text or error message */}
        {hasError && (
          <p id={`${name}-error`} className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {!hasError && helperText && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

export const MultiInput = forwardRef<HTMLTextAreaElement, MultiInputProps>(
  (
    { 
      placeholder, 
      required, 
      defaultValue = "", 
      value, 
      onChange,
      onBlur,
      error,
      touched,
      label,
      helperText,
      maxLength,
      rows = 4,
      name
    }, 
    ref
  ) => {
    const hasError = touched && error;
    const [charCount, setCharCount] = useState(value?.length || defaultValue.length);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    };

    return (
      <div className="mb-4">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            name={name}
            placeholder={placeholder}
            required={required}
            rows={rows}
            maxLength={maxLength}
            className={`
              w-full px-4 py-2 border rounded-md transition-colors duration-200 resize-vertical
              ${hasError 
                ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" 
                : "border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              }
              ${touched && !error ? "border-green-500" : ""}
              focus:outline-none
            `}
            {...(value !== undefined 
              ? { value, onChange: handleChange } 
              : { defaultValue, onChange: handleChange }
            )}
            onBlur={onBlur}
            aria-invalid={!!hasError}
            aria-describedby={hasError ? `${name}-error` : undefined}
          />
          
          {/* Character count */}
          {maxLength && (
            <div className="absolute bottom-2 right-2 text-xs text-gray-500">
              {charCount}/{maxLength}
            </div>
          )}
        </div>
        
        {/* Helper text or error message */}
        {hasError && (
          <p id={`${name}-error`} className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {!hasError && helperText && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

// Password strength indicator component
interface PasswordStrengthIndicatorProps {
  password: string;
  show: boolean;
}

export const PasswordStrengthIndicator = ({ password, show }: PasswordStrengthIndicatorProps) => {
  if (!show || !password) return null;

  const getStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*]/.test(password)) score++;
    
    return {
      score,
      percentage: (score / 5) * 100,
      label: 
        score === 0 ? "Very Weak" :
        score === 1 ? "Weak" :
        score === 2 ? "Fair" :
        score === 3 ? "Good" :
        score === 4 ? "Strong" : "Very Strong",
      color:
        score === 0 ? "bg-red-500" :
        score === 1 ? "bg-orange-500" :
        score === 2 ? "bg-yellow-500" :
        score === 3 ? "bg-lime-500" :
        score === 4 ? "bg-green-500" : "bg-green-600"
    };
  };

  const strength = getStrength();

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-600">Password strength</span>
        <span className="text-xs font-medium text-gray-700">{strength.label}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
          style={{ width: `${strength.percentage}%` }}
        />
      </div>
      <ul className="mt-2 text-xs text-gray-600 space-y-1">
        <li className={password.length >= 8 ? "text-green-600" : ""}>
          ✓ At least 8 characters
        </li>
        <li className={/[a-z]/.test(password) && /[A-Z]/.test(password) ? "text-green-600" : ""}>
          ✓ Upper and lowercase letters
        </li>
        <li className={/[!@#$%^&*]/.test(password) ? "text-green-600" : ""}>
          ✓ At least one special character (!@#$%^&*)
        </li>
      </ul>
    </div>
  );
};

Input.displayName = "Input";
MultiInput.displayName = "MultiInput";