import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card } from "../components/ui/Card"; // Reuse the Card component
import { Button } from "../components/ui/Button";
import { fetchSharedContents } from "../store/slices/contentSlice";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";


export const Share = () => {

  const { shareId } = useParams<{ shareId: string }>(); // Get hash from URL
  const dispatch = useAppDispatch();
  // const [contents, setContents] = useState<any[]>([]);
  // const [username, setUsername] = useState<string>("");
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  const {
    sharedContents,
    sharedUsername,
    sharedLoading,
    sharedError
  } = useAppSelector(state => state.content);
  // const fetchSharedContent = async () => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const response = await axios.get(`${BACKEND_URL}/api/v1/brain/${shareId}`);
  //     const { content, username: userName } = response.data;
  //     console.log("Fetched shared content:", content); // Debug: log the content array
  //     setContents(content || []);
  //     setUsername(userName || "Unknown User");
  //   } catch (err) {
  //     setError("Failed to load shared content. Check the link or try again.");
  //     console.error("Error fetching shared content:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  useEffect(() => {
    if (shareId) {
      dispatch(fetchSharedContents(shareId));
    }
  }, [dispatch,shareId]);

  function handleRefresh() {
    if(shareId) {
      dispatch(fetchSharedContents(shareId));
    }
  }

  if (sharedLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading shared content...</div>
      </div>
    );
  }

  if(sharedError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            {sharedError}
          </div>
          <Button 
            variant="primary" 
            text="Try Again" 
            onClick={handleRefresh}
          />
        </div>
      </div>
    );
  }

 // Empty state
 if (!sharedContents.length) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="text-gray-600 mb-4">
          No content available for this share link.
        </div>
        <Button 
          variant="primary" 
          text="Refresh" 
          onClick={handleRefresh}
        />
      </div>
    </div>
  );
}


  return (
    <div className="p-4">
   <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Shared Content by {sharedUsername}
        </h1>
        <Button 
          variant="primary" 
          text="Refresh" 
          onClick={handleRefresh}
          loading={sharedLoading}
        />
      </div>

      <div className="flex gap-6 flex-wrap">
        {sharedContents.map(({ type, link, description, title, _id, tags }) => (
          <Card
            key={_id}
            type={type  as "twitter" | "youtube" | "article" | "note" }
            link={link}
            title={title}
            description={description}
            contentId={_id}
            tags={tags}
          />
        ))}
      </div>
    </div>
  );
};