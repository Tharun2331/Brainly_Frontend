import { forwardRef } from "react";
import { Input } from "./Input";

export const Note = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { tagRef?: React.RefObject<HTMLInputElement | null>;
  titleRef?: React.RefObject<HTMLInputElement | null>;
   }
>(({ tagRef, titleRef, ...props }, ref) => {
  return (
    <>
      <Input ref={titleRef} placeholder="Title" required={true} />
      <textarea
        {...props}
        ref={ref}
        placeholder="Start writing your note..."
        className="w-[500px] h-[300px] p-4 border rounded-md text-lg font-sans focus:outline-none resize-vertical"
      />
      <Input ref={tagRef} placeholder="Tags" required={true} />
   
    </>
  );
});