import { Route, Routes } from "react-router"
import { useState } from 'react'
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
          path="/upload"
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