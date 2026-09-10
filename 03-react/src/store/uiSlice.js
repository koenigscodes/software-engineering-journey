import { createSlice } from "@reduxjs/toolkit"

const uiSlice = createSlice({
    name: "ui", 

    initialState: {
        sidebarOpen: false
    },

    reducers: {
        toggleSidebar(state) {
            state.sidebarOpen = !state.sidebarOpen
        }
    }
})