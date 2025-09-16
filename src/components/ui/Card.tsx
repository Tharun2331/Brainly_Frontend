// src/components/ui/Card.tsx
import { DeleteIcon } from "../../icons/DeleteIcon";
import { ShareIcon } from "../../icons/ShareIcon";
import { useEffect, useRef, useState } from "react";
import { YoutubeIcon } from "../../icons/YoutubeIcon";
import { TwitterIcon } from "../../icons/TwitterIcon";
import { ArticleIcon } from "../../icons/Article";
import { LinesIcon } from "../../icons/Lines";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { NoteIcon } from "../../icons/NotesIcon";

interface Tag {
  _id: string;
  tag: string;
}

interface Cardprops {
  title?: string;
  link?: string;
  type: "twitter" | "youtube" | "article" | "note";
  tags?: Tag[] | null; // Allow null
  contentId: string;
  onDelete?: (contentId: string) => void;
  description?: string;
  onClick?: () => void;
}

export const Card = ({ title, link, type, contentId, onDelete, tags, description, onClick }: Cardprops) => {
  const tweetRef = useRef<HTMLQuoteElement>(null);
  const [, setTweetLoaded] = useState(false);
  const [embedError, setEmbedError] = useState(false);
  const tweetRenderedRef = useRef(false);
  
  // Debug: Log when Card component renders
  console.log(`Card rendered: ${type} - ${contentId} - ${title}`);

  // Truncate description to ~100 characters (~3 lines)
  const safeDescription = description || "";
  const truncatedDescription =
    safeDescription.length > 100 ? safeDescription.substring(0, 100) + "..." : safeDescription;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering onClick when deleting
    if (contentId) {
      onDelete && onDelete(contentId);
    } else {
      console.error("No contentId provided for deletion");
      toast.error("No content ID provided for deletion", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleNoteClick = () => {
    if (type === "note" && onClick) {
      onClick();
    }
  };

  useEffect(() => {
    // Only run for Twitter content
    if (type !== "twitter" || !link) return;
    
    // Reset states
    setTweetLoaded(false);
    setEmbedError(false);
    tweetRenderedRef.current = false;
    
    const loadTweet = async () => {
      if (!tweetRef.current || tweetRenderedRef.current) return;
      
      try {
        // @ts-ignore
        if (!window.twttr) {
          // Check if script is already being loaded
          if (document.querySelector('script[src="https://platform.twitter.com/widgets.js"]')) {
            // Script is already being loaded, wait for it
            const checkScript = setInterval(() => {
              // @ts-ignore
              if (window.twttr) {
                clearInterval(checkScript);
                setTweetLoaded(true);
                renderTweet();
              }
            }, 100);
            return;
          }
          
          const script = document.createElement("script");
          script.src = "https://platform.twitter.com/widgets.js";
          script.async = true;
          script.onload = () => {
            setTweetLoaded(true);
            renderTweet();
          };
          script.onerror = () => setEmbedError(true);
          document.body.appendChild(script);
        } else {
          // Script already loaded, render tweet directly
          setTweetLoaded(true);
          renderTweet();
        }
      } catch (error) {
        console.error("Error loading tweet:", error);
        setEmbedError(true);
      }
    };

    const renderTweet = () => {
      setTimeout(() => {
        // @ts-ignore
        if (window.twttr && tweetRef.current && !tweetRenderedRef.current) {
          tweetRenderedRef.current = true;
          // @ts-ignore
          window.twttr.widgets
            .createTweet(link?.split("/status/")[1], tweetRef.current, { align: "center" })
            .then(() => console.log("Tweet rendered"))
            .catch((error: any) => {
              console.error("Tweet creation failed:", error);
              setEmbedError(true);
            });
        }
      }, 100);
    };

    loadTweet();
    
    // Cleanup function
    return () => {
      if (tweetRef.current) {
        // Clear the tweet content
        tweetRef.current.innerHTML = '';
      }
      tweetRenderedRef.current = false;
    };
  }, [link, type]);

  // Ensure tags is an array and handle different data formats
  const safeTags = Array.isArray(tags) ? tags : [];

  return (
    <div>
      <div 
        className={`p-4 bg-white rounded-md shadow-md border-gray-200 border max-w-72 text-sm font-normal min-h-48 min-w-72 overflow-hidden ${
          type === "note" ? "cursor-pointer hover:shadow-lg transition-shadow duration-200" : ""
        }`}
        onClick={type === "note" ? handleNoteClick : undefined}
      >
        <div className="flex justify-between">
          <div className="flex items-center min-w-0 flex-1">
            <div className="text-gray-500 pr-2 flex-shrink-0">
              {type === "youtube" && <YoutubeIcon />}
              {type === "twitter" && <TwitterIcon />}
              {type === "article" && <ArticleIcon />}
              {type === "note" && <NoteIcon />}
            </div>
            <span className="truncate">
              {type === "note" && !title ? "Untitled Note" : title}
            </span>
          </div>
          <div className="flex items-center">
            {link && (
              <div className="pr-2 text-gray-400">
                <a 
                  href={link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()} // Prevent triggering note edit
                >
                  <ShareIcon size="md" />
                </a>
              </div>
            )}
            <div 
              className="pr-2 text-gray-400 cursor-pointer hover:text-red-500 transition-colors duration-200" 
              onClick={handleDelete}
            >
              <DeleteIcon size="md" />
            </div>
          </div>
        </div>
        <div className="pt-4 overflow-hidden">
          {type === "youtube" && link && (
            <iframe
              className="w-full h-48 rounded"
              src={link.replace("watch", "embed").replace("?v=", "/").replace("&", "/")}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          )}
          {type === "twitter" && (
            <div className="overflow-hidden">
              <blockquote ref={tweetRef} className="twitter-tweet max-w-full">
                {embedError && (
                  <div className="text-gray-500 italic w-full break-words">
                    Tweet not available for embedding. View on{" "}
                    <a href={link} target="_blank" rel="noopener noreferrer" className="underline">
                      Twitter/X
                    </a>
                    .
                  </div>
                )}
              </blockquote>
            </div>
          )}
          {type === "article" && link && (
            <div className="text-gray-500 italic overflow-hidden">
              <Link to={link} target="_blank" rel="noopener noreferrer">
                <LinesIcon />
              </Link>
            </div>
          )}
          
          {type === "note" && (
            <div className="text-gray-700 hover:text-gray-900 transition-colors duration-200 overflow-hidden">
              <p className="break-words">{truncatedDescription}</p>
              {type === "note" && (
                <div className="mt-2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Click to edit
                </div>
              )}
            </div>
          )}
        </div>

        
        {safeTags && safeTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8">
            {safeTags.map((tagObj, index) => {
              // Handle both object format {_id, tag} and string format
              const tagText = typeof tagObj === 'string' ? tagObj : (tagObj?.tag || tagObj);
              const tagId = typeof tagObj === 'object' && tagObj._id ? tagObj._id : `tag-${index}`;
              
              return tagText && typeof tagText === 'string' ? (
                <span
                  key={tagId}
                  className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs"
                >
                  #{tagText}
                </span>
              ) : null;
            })}
          </div>
        )}
      </div>
    </div>
  );
};