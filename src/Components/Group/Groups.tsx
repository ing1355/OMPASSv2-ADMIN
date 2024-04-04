import { Navigate, Route, Routes } from "react-router"
import GroupDetail from "./GroupDetail"
import GroupManagement from "./GroupManagement"

const Groups = () => {
    return <>
        <Routes>
            <Route path="/detail/:uuid" element={<GroupDetail />} />
            <Route path="/detail/*" element={<GroupDetail />} />
            <Route
                path="/"
                element={
                    <GroupManagement />
                }
            />
            <Route
                path="/*"
                element={
                    <Navigate to='/Groups' replace={true} />
                }
            />
        </Routes>
    </>
}

export default Groups