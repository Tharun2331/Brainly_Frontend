// src/components/ui/Input.tsx
import { forwardRef } from "react";

interface InputProps {
  placeholder: string;
  required: boolean;
  defaultValue?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface MultiInputProps {
  placeholder: string;
  required: boolean;
  defaultValue?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ placeholder, required, defaultValue = "", type = "text", value, onChange }, ref) => {
    return (
      <div>
        <input
          placeholder={placeholder}
          type={type}
          className="px-4 py-2 border-1 border-gray-300 m-2"
          ref={ref}
          required={required}
          {...(value !== undefined ? { value, onChange } : { defaultValue })}
        />
      </div>
    );
  }
);

export const MultiInput = forwardRef<HTMLTextAreaElement, MultiInputProps>(
  ({ placeholder, required, defaultValue = "", value, onChange }, ref) => {
    return (
      <div>
        <textarea
          placeholder={placeholder}
          ref={ref}
          required={required}
          className="px-4 py-2 border-1 border-gray-300 m-2"
          {...(value !== undefined ? { value, onChange } : { defaultValue })}
        />
      </div>
    );
  }
);