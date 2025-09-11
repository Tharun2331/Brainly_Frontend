import { forwardRef } from "react";
import { Input } from "./Input";

interface NoteProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  tagRef?: React.RefObject<HTMLInputElement | null>;
  titleRef?: React.RefObject<HTMLInputElement | null>;
  defaultTitle?: string;
  defaultTags?: string;
}

export const Note = forwardRef<HTMLTextAreaElement, NoteProps>(
  ({ tagRef, titleRef, defaultTitle = "", defaultTags = "", ...props }, ref) => {
    return (
      <div>
        <Input ref={titleRef} placeholder="Title" required={true} defaultValue={defaultTitle} />
        <textarea
          {...props}
          ref={ref}
          placeholder="Start writing your note..."
          className=" w-64 h-36 overflow-auto sm:overflow-auto sm:w-[500px] sm:h-[300px] sm:p-4 border rounded-md text-lg font-sans sm:focus:outline-none resize-vertical"
        />
        <Input ref={tagRef} placeholder="Tags" required={true} defaultValue={defaultTags} />
      </div>
    );
  }
);