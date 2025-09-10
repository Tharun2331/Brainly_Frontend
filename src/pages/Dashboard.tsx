// src/components/Dashboard.tsx
import "../App.css";
import { Button } from "../components/ui/Button";
import { PlusIcon } from "../icons/PlusIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { Card } from "../components/ui/Card";
import { CreateContentModal } from "../components/ui/CreateContentModal";
import { useState, useEffect } from "react";
import { Sidebar } from "../components/ui/Sidebar";
import { generateShareLink, clearShareLink } from "../store/slices/uiSlice";
import { toast } from "react-toastify";
import { useAppDispatch,useAppSelector } from "../hooks/redux";
import { deleteContent, fetchContents } from "../store/slices/contentSlice";
// import { ChatIcon } from "../icons/ChatIcon";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || "http://localhost:5173";

export function Dashboard() {
  const dispatch = useAppDispatch();
  const {token} = useAppSelector(state => state.auth);
  const {shareLink,shareLoading, shareError} = useAppSelector(state => state.ui);
  const {contents, loading, filter} = useAppSelector(state => state.content);
  const [modalOpen, setModalOpen] = useState(false);

  const [selectedNote, setSelectedNote] = useState<{
    _id: string;
    description?: string;
    title?: string;
    tags?: string[];
  } | null> (null); 


  useEffect(()=> {
    if(token) {
      dispatch(fetchContents({filter,token}));
    }
  },[dispatch,filter,token])

  const handleDelete = async (contentId: string) => {
    try {
      if (!token) {
        toast.error("Please log in to delete content", { position: "top-right", autoClose: 3000 });
        return;
      }
      await dispatch(deleteContent({id:contentId,token})).unwrap();
      
      toast.success("Content deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      if (typeof error === "object" && error !== null && "response" in error) {
        // @ts-ignore
        console.error("Delete failed:", error.response?.data || error.message);
        // @ts-ignore
        toast.error(
          // @ts-ignore
          error.response?.data?.message || "Failed to delete content",
          { position: "top-right", autoClose: 3000 }
        );
      } else {
        console.error("Delete failed:", error);
        toast.error("Failed to delete content", { position: "top-right", autoClose: 3000 });
      }
    }
  };

  const handleShare = async () => {
    if(!token) {
      toast.error("Please log in to share your brain", {
        position: "top-right",
        autoClose: 3000
      });
      return;
    }
    
    try {
      const resultAction = await dispatch(generateShareLink(token));
      if(generateShareLink.fulfilled.match(resultAction)) {
        const newShareLink = resultAction.payload;
        toast.success(
          <div>
            <p>Share Link Generated!</p>
            <input
              type="text"
              value={newShareLink}
              readOnly
              className="w-full p-2 mt-2 border rounded"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(newShareLink);
                toast.info("Link copied to clipboard!", { autoClose: 2000 });
              }}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Copy Link
            </button>
          </div>,
          {
            position: "top-right",
            autoClose: 10000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      }

    } catch (error) {
      
      toast.error("Failed to Generate Share Link, Please try again or contact support.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
        }
      );
    }
  };

  const handleEditNote = (note: {_id: string; title?: string; description?: string; tags?: string[] }) => {
    setSelectedNote(note);
    setModalOpen(true);
    
  }

  return (
    <div>
      <Sidebar />
      <div className="p-4 ml-4 md:ml-72 min-h-screen bg-[var(--color-gray-200)]">
        <CreateContentModal open={modalOpen}
          onClose={() => { 
          setModalOpen(false) 
          setSelectedNote(null)
          }}
          selectedNote = {selectedNote}
       />
        <div className="flex justify-center  md:flex md:justify-end gap-4">
          <Button
            startIcon={<ShareIcon size="md" />}
            variant="secondary"
            text={shareLoading ? "Generating..." : "Share Brain"}
            size="md"
            onClick={handleShare}
            loading={shareLoading}
          />
          <Button
            onClick={() => setModalOpen(true)}
            startIcon={<PlusIcon size="md" />}
            variant="primary"
            text="Add Content"
            size="md"
          />
        </div>
        {shareError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
            <p>Share Error: {shareError}</p>
            <button 
              onClick={() => dispatch(clearShareLink())}
              className="text-sm underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="flex gap-6 flex-wrap p-4">
          {contents.map(({ type, link, title, description, _id, tags }) => (
            <Card
              key={`${type}-${link}`}
              type={type as "twitter" | "youtube" | "article" | "note"}
              link={link}
              title={title}
              description={description}
              contentId={_id}
              tags={tags}
              onDelete={handleDelete}
              onClick={() => type === "note" && handleEditNote({_id, title, description, tags: tags?.map(tag => tag.tag) || [] })}
            />
          ))}
        </div>

      </div>


    </div>
  );
}