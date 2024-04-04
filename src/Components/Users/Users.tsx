import { Navigate, Route, Routes } from "react-router"
import UserManagement from "./UserManagement"
import UserDetail from "./UserDetail"

const Users = () => {
    return <>
        <Routes>
            <Route path="/detail/:uuid" element={<UserDetail />} />
            <Route
                path="/"
                element={<UserManagement />}
            />
            <Route
                path="/*"
                element={
                    <Navigate to='/Users' replace={true} />
                }
            />
        </Routes>
    </>
}

export default Users