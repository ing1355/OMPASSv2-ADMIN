import { Route, Routes } from "react-router"
import AgentManagement from "./AgentManagement"
import VersionUpload from "./VersionUpload";
import NotePatch from "./NotePatch";


const Agent = () => {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <AgentManagement />
          }
        />

        <Route
          path="/upload/:type"
          element={
            <VersionUpload />
          }
        />

        <Route
          path="/note"
          element={
            <NotePatch />
          }
        />
      </Routes>
    </>
  )
}

export default Agent