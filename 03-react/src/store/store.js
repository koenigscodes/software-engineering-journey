import { configureStore } from "@reduxjs/toolkit";

import uiReducer from  "./uiSlice";
import usersReducer from "./usersSlice";

export const store = configureStore({
    reducer: {
        ui: uiReducer,
        users: usersReducer
    }
});

