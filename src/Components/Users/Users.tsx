import { Navigate, Route, Routes } from "react-router"
import UserManagement from "./UserManagement"
import UserDetail from "./UserDetail"
import { useSelector } from "react-redux"
import UserExcelUpload from "./UserExcelUpload"
import ExternalDirectoryDetail from "./ExternalDirectory/ExternalDirectoryDetail"
import ExternalDirectoryManagement from "./ExternalDirectory/ExternalDirectoryManagement"

const Users = () => {
    const userInfo = useSelector((state: ReduxStateType) => state.userInfo!);
    
      const { role } = userInfo

    return role === "USER" ? <UserDetail/> : <>
        <Routes>
            <Route path="/excelUpload" element={<UserExcelUpload />} />
            <Route path="/externalDirectory/:type" element={<ExternalDirectoryManagement />} />
            <Route path="/externalDirectory/:type/detail" element={<ExternalDirectoryDetail />} />
            <Route path="/externalDirectory/:type/detail/:id" element={<ExternalDirectoryDetail />} />
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