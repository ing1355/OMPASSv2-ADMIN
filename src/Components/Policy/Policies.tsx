import { Route, Routes } from "react-router"
import AuthPolicyDetail from "./AuthPolicyDetail"
import PolicyManagement from "./PolicyManagement"
import './Policies.css'

const Policies = () => {
    return <>
        <Routes>
            <Route path="/auth/detail/:uuid" element={<AuthPolicyDetail />} />
            <Route path="/auth/detail/*" element={<AuthPolicyDetail />} />
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