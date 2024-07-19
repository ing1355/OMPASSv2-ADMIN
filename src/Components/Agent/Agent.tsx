import { Route, Routes } from "react-router"
import { useState } from 'react'
import AgentManagement from "./AgentManagement"
import VersionUpload from "./VersionUpload";


const Agent = () => {
  

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <AgentManagement/>
          }
        />

        <Route 
          path="/upload" 
          element={
            <VersionUpload/>
          }
        />
      </Routes>
    </>
  )
}

export default Agent