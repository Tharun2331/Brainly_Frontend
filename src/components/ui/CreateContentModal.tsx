// src/components/ui/CreateContentModal.tsx
import { useEffect, useRef, useState } from "react";
import { CrossIcon } from "../../icons/CrossIcon";
import { Button } from "./Button";
import { Input, MultiInput } from "./Input";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { Note } from "../../components/ui/Note";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { createContent, updateContent, fetchContents } from "../../store/slices/contentSlice";

import { toast } from "react-toastify";


// @ts-ignore
enum ContentType {
  Youtube = "youtube",
  Twitter = "twitter",
  Article = "article",
  Note = "note",
}

export function CreateContentModal({
   open,
  onClose,
  selectedNote,
   
}: { 
    open: boolean;
    onClose: () => void;
    selectedNote?: { _id: string; title?: string; description?: string; tags?: string[] } | null;

}) {
  const dispatch = useAppDispatch();
  const {token} = useAppSelector(state => state.auth);
  const {filter} = useAppSelector(state => state.content);

  const modref = useOutsideClick(onClose);
  const titleRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const tagRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const noteRef = useRef<HTMLTextAreaElement | null>(null);
  const noteTagRef = useRef<HTMLInputElement | null>(null);
  const noteTitleRef = useRef<HTMLInputElement | null>(null);
  
  const [type, setType] = useState(ContentType.Youtube);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Add state for form values to ensure proper initialization
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    tags: "",
    link: ""
  });

  // Reset form when modal opens/closes or selectedNote changes
  useEffect(() => {
    if (open) {
      if (selectedNote) {
        // Editing existing note
        setType(ContentType.Note);
        const newFormValues = {
          title: selectedNote.title || "",
          description: selectedNote.description || "",
          tags: selectedNote.tags?.join(", ") || "",
          link: ""
        };
        setFormValues(newFormValues);
        
        // Use setTimeout to ensure refs are available after render
        setTimeout(() => {
          if (noteTitleRef.current) noteTitleRef.current.value = newFormValues.title;
          if (noteRef.current) noteRef.current.value = newFormValues.description;
          if (noteTagRef.current) noteTagRef.current.value = newFormValues.tags;
        }, 0);
      } else {
        // Creating new content - reset everything
        setType(ContentType.Youtube);
        const resetValues = { title: "", description: "", tags: "", link: "" };
        setFormValues(resetValues);
        
        setTimeout(() => {
          // Clear all form fields
          if (titleRef.current) titleRef.current.value = "";
          if (linkRef.current) linkRef.current.value = "";
          if (tagRef.current) tagRef.current.value = "";
          if (descriptionRef.current) descriptionRef.current.value = "";
          if (noteRef.current) noteRef.current.value = "";
          if (noteTagRef.current) noteTagRef.current.value = "";
          if (noteTitleRef.current) noteTitleRef.current.value = "";
        }, 0);
      }
      setError(null);
      setLoading(false);
    }
  }, [open, selectedNote]);

  const addContent = async () => {
    if (!token) {
      setError("No authorization token found. Please log in.");
      return;
    }

    const title = titleRef.current?.value;
    const link = linkRef.current?.value;
    const description = type === ContentType.Note ? noteRef.current?.value : descriptionRef.current?.value;
    const noteTitle = noteTitleRef.current?.value;
    const tags = (type === ContentType.Note
      ? noteTagRef.current?.value?.split(",").map((tag) => tag.trim()).filter((tag) => tag)
      : tagRef.current?.value?.split(",").map((tag) => tag.trim()).filter((tag) => tag)) || [];

    // Validate inputs
    if (!tags.length) {
      setError("At least one tag is required");
      return;
    }
    if (type !== ContentType.Note && (!title || !link)) {
      setError("Title and link are required for non-Note content");
      return;
    }
    if (!description) {
      setError("Description is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Prepare content data
      const contentData: any = {
        description,
        type,
        tags, // Pass tag names, Redux will handle converting to IDs
      };

      if (type !== ContentType.Note) {
        contentData.title = title;
        contentData.link = link;
      } else if (noteTitle) {
        contentData.title = noteTitle;
      }

      if (selectedNote) {
        // Update existing content
        await dispatch(updateContent({ 
          id: selectedNote._id, 
          contentData, 
          token 
        })).unwrap();
        
        toast.success("Content updated successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        // Create new content
        await dispatch(createContent({ 
          contentData, 
          token 
        })).unwrap();
        
        toast.success("Content created successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      }

      // Refetch contents to ensure UI is up to date
      dispatch(fetchContents({ filter, token }));
      
      // Close modal
      onClose();
    } catch (error: any) {
      console.error("Error with content operation:", error);
      setError(error.message || "An unexpected error occurred");
      toast.error(error.message || "Failed to save content", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      {open && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="w-screen h-screen bg-slate-500 opacity-60 fixed top-0 left-0"
            onClick={onClose}
          ></div>
          
          {/* Modal Content */}
          <div className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center pointer-events-none">
            <div 
              ref={modref} 
              className="bg-white rounded p-4 pointer-events-auto relative z-10"
              onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-end">
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                    }} 
                    className="cursor-pointer"
                  >
                    <CrossIcon />
                  </div>
                </div>
                {type === ContentType.Note ? (
                  <Note 
                    ref={noteRef} 
                    tagRef={noteTagRef} 
                    titleRef={noteTitleRef}
                    defaultTitle={formValues.title}
                    defaultTags={formValues.tags}
                    defaultValue={formValues.description}
                    key={`note-${selectedNote?._id || 'new'}`} // Force re-render when selectedNote changes
                  />
                ) : (
                  <div key={`content-${type}`}>
                    <Input ref={titleRef} placeholder={"Title"} required={true} />
                    <Input ref={linkRef} placeholder={"Link"} required={true} />
                    <Input ref={tagRef} placeholder={"Tags"} required={true} />
                    <MultiInput ref={descriptionRef} placeholder={"Description"} required={true} />
                  </div>
                )}
                {error && <div className="text-red-500 text-center">{error}</div>}
                <div className="flex flex-wrap justify-center gap-2 p-4 w-68">
                  <Button
                    text="Youtube"
                    variant={type === ContentType.Youtube ? "primary" : "secondary"}
                    onClick={() => setType(ContentType.Youtube)}
                    size="md"
                    loading={loading}
                  />
                  <Button
                    text="Twitter"
                    variant={type === ContentType.Twitter ? "primary" : "secondary"}
                    onClick={() => setType(ContentType.Twitter)}
                    size="md"
                    loading={loading}
                  />
                  <Button
                    text="Article"
                    variant={type === ContentType.Article ? "primary" : "secondary"}
                    onClick={() => setType(ContentType.Article)}
                    size="md"
                    loading={loading}
                  />
                  <Button
                    text="Note"
                    variant={type === ContentType.Note ? "primary" : "secondary"}
                    onClick={() => setType(ContentType.Note)}
                    size="md"
                    loading={loading}
                  />
                </div>
                <div className="flex justify-center">
                  <Button variant="primary" text="submit" size="sm" onClick={addContent}  loading={loading} />
                </div>
            </div>
          </div>
        </div>
      )}
    </div>  
  );
}