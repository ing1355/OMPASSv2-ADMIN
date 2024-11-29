import { Navigate, Route, Routes } from "react-router"
import ApplicationManagement from "./ApplicationManagement"
import ApplicationDetail from "./ApplicationDetail"
import './Application.css'
import RadiusSync from "./RadiusSync"

const Application = () => {
    return <>
        <Routes>
            <Route path="/detail" element={<ApplicationDetail />} />
            <Route path="/detail/:uuid" element={<ApplicationDetail />} />
            <Route path="/detail/:uuid/radius" element={<RadiusSync />} />
            <Route
                path="/"
                element={
                    <ApplicationManagement />
                }
            />
            <Route
                path="/*"
                element={
                    <Navigate to='/Applications' replace={true} />
                }
            />
        </Routes>
    </>
}

export default Application