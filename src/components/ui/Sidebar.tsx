import { ArticleIcon } from "../../icons/Article"
import { BrainIcon } from "../../icons/Brainly"
import { NoteIcon } from "../../icons/NotesIcon"
import { YoutubeIcon } from "../../icons/YoutubeIcon"
import { Button } from "./Button"
import { SidebarItem } from "./SidebarItem"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../hooks/redux"
import { logout } from "../../store/slices/authSlice"
import { setFilter } from "../../store/slices/contentSlice"
import {
  Brain,
  Twitter,
  Youtube,
  FileText,
  StickyNote,
  Grid3X3,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
} from "lucide-react"

export function Sidebar() {
  const navigate = useNavigate();
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
    <>
      {/* Desktop Sidebar */}
      <div className="hidden sm:flex h-screen bg-card border-r border-border w-72 fixed left-0 top-0 pl-6 flex-col justify-between">
        <div>
          <div className="flex text-2xl items-center gap-4 pt-4">
            <div className="ml-2">
              <Brain />
            </div>
            Brainly
          </div>
          <div className="pt-8 pl-4 ">
            <SidebarItem 
              text={"Tweets"}
              icon={<Twitter  />} 
              onClick={() => handleSetContent("twitter")}
              isActive={currentFilter === "twitter"}
            />
            <SidebarItem
              text={"Youtube"} 
              icon={<Youtube />}  
              onClick={() => handleSetContent("youtube")}
              isActive={currentFilter === "youtube"} 
            />
            <SidebarItem 
              text={"Articles"}
              icon={<FileText />}
              onClick={() => handleSetContent("article")}
              isActive={currentFilter === "article"}
            />
            <SidebarItem 
              text={"Notes"}
              icon={<StickyNote />}
              onClick={() => handleSetContent("note")}
              isActive={currentFilter === "note"}
            />
            <SidebarItem
              text={"All"} 
              icon={<Grid3X3 />}  
              onClick={() => handleSetContent("all")}
              isActive={currentFilter === "all"}
            />
          </div>
        </div>
        <div className="flex items-end justify-center mb-8 mr-4">
          <Button text={"Logout"} onClick={handleLogout} fullWidth={true} className="hover:bg-chart-4 flex justify-start" startIcon={<LogOut />}/>
        </div>
      </div>

      {/* Mobile Logout Button - Fixed at bottom */}
      <div className="sm:hidden fixed bottom-4 left-4 right-4 z-50 cursor-pointer">
        <Button variant="primary" text={"Logout"} onClick={handleLogout} fullWidth={true} />
      </div>
    </>
  );
}