import { Navigate, Route, Routes } from "react-router"
import AuthPolicyDetail from "./AuthPolicyDetail"
import PolicyManagement from "./PolicyManagement"
import './Policies.css'

const Policies = () => {
    return <>
        <Routes>
            <Route path="/detail/:uuid" element={<AuthPolicyDetail />} />
            <Route path="/detail" element={<AuthPolicyDetail />} />
            <Route
                path="/"
                element={
                    <PolicyManagement />
                }
            />
            <Route
                path="/*"
                element={
                    <Navigate to='/' replace={true} />
                }
            />
        </Routes>
    </>
}

export default Policies