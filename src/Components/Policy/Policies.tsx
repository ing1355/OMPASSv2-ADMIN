import { Route, Routes } from "react-router"
import AuthPolicyDetail from "./AuthPolicyDetail"
import PolicyManagement from "./PolicyManagement"
import UserPolicyDetail from "./UserPolicyDetail"
import './Policies.css'

const Policies = () => {
    return <>
        <Routes>
            <Route path="/auth/detail/:uuid" element={<AuthPolicyDetail />} />
            <Route path="/auth/detail/*" element={<AuthPolicyDetail />} />
            <Route path="/user/detail/:uuid" element={<UserPolicyDetail />} />
            <Route path="/user/detail/*" element={<UserPolicyDetail />} />
            <Route
                path="/"
                element={
                    <PolicyManagement />
                }
            />
        </Routes>
    </>
}

export default Policies