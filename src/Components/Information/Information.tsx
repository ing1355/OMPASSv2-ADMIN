import { Route, Routes } from "react-router"
import { useState } from 'react'
import InformationList from "./InformationList"

const Information = () => {
  const [tableCellSize, setTableCellSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);

  return (
    <>
      <Routes>
        <Route path="/detail/:uuid" element={<>
          authTestPolicies
        </>} />
        <Route
          path="/"
          element={
            <InformationList
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

export default Information