import { Route, Routes } from "react-router"
import { useState } from 'react'
import AgentManagement from "./AgentManagement"
import VersionUpload from "./VersionUpload";


const Agent = () => {
  const [tableCellSize, setTableCellSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <AgentManagement 
              pageNum={pageNum} 
              setPageNum={setPageNum} 
              tableCellSize={tableCellSize}
              setTableCellSize={setTableCellSize}            
            />
          }
        />

        <Route 
          path="/upload" 
          element={
            <VersionUpload
              pageNum={pageNum} 
              setPageNum={setPageNum} 
              tableCellSize={tableCellSize}
              setTableCellSize={setTableCellSize}                
            />
          }
        />
      </Routes>
    </>
  )
}

export default Agent