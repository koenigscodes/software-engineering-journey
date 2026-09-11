import { useDispatch, useSelector} from "react-redux";

import { toggleSidebar } from "../store/uiSlice";

function Header() {
    const dispatch = useDispatch();

    const isSidebarOpen = useSelector(
        state => state.ui.sidebarOpen
    )    

    return (
        <header>
            {
                isSidebarOpen 
                    ? <div>Sidebar open</div>
                    : <div>Sidebar closed</div>
            }
            <button onClick={() => dispatch(toggleSidebar())}>
                Toggle Sidebar
            </button>
        </header>
    )
}

// useSelector → read state
// useDispatch → get dispatch
// toggleSidebar → action creator
// State lives in the state tree. Actions/action creators don't.
// and
// Event handlers receive functions; don't accidentally execute the function while rendering.