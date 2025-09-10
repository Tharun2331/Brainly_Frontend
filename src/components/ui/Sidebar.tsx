import { ArticleIcon } from "../../icons/Article"
import { BrainIcon } from "../../icons/Brainly"
import { NoteIcon } from "../../icons/NotesIcon"
import { TwitterIcon } from "../../icons/TwitterIcon"
import { YoutubeIcon } from "../../icons/YoutubeIcon"
import { Button } from "./Button"
import { SidebarItem } from "./SidebarItem"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../hooks/redux"
import { logout } from "../../store/slices/authSlice"
import { setFilter } from "../../store/slices/contentSlice"

// interface SidebarProps {
//   content: string;
//   handleSetContent: (type: string) => void;
// }

export function Sidebar() {


  const navigate= useNavigate();
  const dispatch = useAppDispatch();

  const currentFilter = useAppSelector(state => state.content.filter);
  
  const handleLogout = () => {
    dispatch(logout());
    navigate("/signin");
  }

  const handleSetContent = (filterType: "all" | "twitter" | "youtube" | "article" | "note") => {
    dispatch(setFilter(filterType));
  }


  return (
    <div className=" hidden sm:flex h-screen bg-white border-r border-r-gray-300 w-72 fixed left-0 top-0 pl-6 flex flex-col justify-between">
      <div>
        <div className="flex text-2xl items-center gap-4 pt-4 cursor-pointer hover:scale-110 transition-transform duration-200">
          <div className="ml-2 ">
            <BrainIcon />
          </div>
          Brainly
        </div>
        <div className="pt-8 pl-4">
          <SidebarItem 
          text={"Tweets"}
          icon={<TwitterIcon />} 
          onClick={()=> handleSetContent("twitter")}
          isActive = {currentFilter === "twitter"}/>
          <SidebarItem
          text={"Youtube"} 
          icon={<YoutubeIcon />}  
          onClick={()=> handleSetContent("youtube")}
          isActive = {currentFilter === "youtube"} />
         
         <SidebarItem 
         text={"Articles"}
         icon={<ArticleIcon />}
         onClick={() => handleSetContent("article")}
         isActive={currentFilter ==="article"}
         />

        <SidebarItem 
         text={"Notes"}
         icon={<NoteIcon />}
         onClick={() => handleSetContent("note")}
         isActive={currentFilter ==="note"}
         />
         
         <SidebarItem
          text={"All"} 
          icon={<BrainIcon />}  
          onClick={()=> handleSetContent("all")}
          isActive = {currentFilter === "all"}
          />

        </div>
      </div>
      <div className="flex items-end justify-center mb-8 mr-4">
        <Button variant="primary" text={"Logout"} onClick={handleLogout} fullWidth={true}  />
      </div>
    </div>
  );
}