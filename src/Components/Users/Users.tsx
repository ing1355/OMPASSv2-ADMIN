import { Navigate, Route, Routes } from "react-router"
import UserManagement from "./UserManagement"
import UserDetail from "./UserDetail"
import { useSelector } from "react-redux"

const Users = () => {
    const { userInfo } = useSelector((state: ReduxStateType) => ({
        userInfo: state.userInfo!,
      }))
    
      const { role } = userInfo

    return role === "USER" ? <UserDetail/> : <>
        <Routes>
            <Route path="/detail/*" element={<UserDetail />} />
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