import { Navigate, Route, Routes } from "react-router"
import GroupDetail from "./GroupDetail"
import GroupManagement from "./GroupManagement"
import GroupAssignmentExample from "./GroupAssignmentExample"
import { isDev } from "../../Constants/ConstantValues"

const Groups = () => {
    return <>
        <Routes>
            {/* {
                !isDev ?
                    <>
                        <Route path="/detail/:uuid" element={<GroupAssignmentExample />} />
                        <Route path="/detail/*" element={<GroupAssignmentExample />} />
                    </> : <>
                        <Route path="/detail/:uuid" element={<GroupDetail />} />
                        <Route path="/detail/*" element={<GroupDetail />} />
                    </>
            } */}
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