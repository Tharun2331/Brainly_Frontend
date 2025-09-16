import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type UIState } from '../types/index';
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || "http://localhost:5173";


const initialState: UIState = {
  modals: {
    createContent: false,
    share: false,
  },
  shareLink: null,
  selectedNote: null,
  shareLoading: false,
  shareError:null,
};

export const generateShareLink = createAsyncThunk(
  'ui/generateShareLink',
  async (token: string) => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/brain/share`,
      {share: true},
      {headers: {Authorization: token}}
    );
    const hash = response.data.data.hash || "";

    const baseUrl = FRONTEND_URL.endsWith("/") ? FRONTEND_URL.slice(0,-1) : FRONTEND_URL;
    const shareLink = `${baseUrl}/share/${hash}`;
    
    return shareLink;
  }
)

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleCreateContentModal: (state) => {
      state.modals.createContent = !state.modals.createContent;
      if (!state.modals.createContent) {
        state.selectedNote = null;
      }
    },
    toggleShareModal: (state) => {
      state.modals.share = !state.modals.share;
    },
    setShareLink: (state, action: PayloadAction<string>) => {
      state.shareLink = action.payload;
    },
    setSelectedNote: (state, action: PayloadAction<UIState['selectedNote']>) => {
      state.selectedNote = action.payload;
      if (action.payload) {
        state.modals.createContent = true;
      }
    },
    closeAllModals: (state) => {
      state.modals.createContent = false;
      state.modals.share = false;
      state.selectedNote = null;
    },
    clearShareLink: (state) => {
      state.shareLink = null;
      state.shareError = null;
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(generateShareLink.pending, (state) => {
      state.shareLoading=true;
      state.shareError=null;
    })
    .addCase(generateShareLink.fulfilled, (state,action) => {
      state.shareLoading = false;
      state.shareLink = action.payload;
    })
    .addCase(generateShareLink.rejected, (state, action)=> {
      state.shareLoading=false;
      state.shareError = action.error.message || "Failed to generate share link";
    })
  }
});

export const { 
  toggleCreateContentModal, 
  toggleShareModal, 
  setShareLink, 
  setSelectedNote, 
  closeAllModals,
  clearShareLink 
} = uiSlice.actions;
export default uiSlice.reducer;