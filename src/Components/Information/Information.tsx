import { Route, Routes } from "react-router"
import { useState } from 'react'
import InformationList from "./InformationList"
import InformationDetail from "./InformationDetail"

const Information = () => {
  const [tableCellSize, setTableCellSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);

  return (
    <>
      <Routes>
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
        <Route path='/detail/:params/:selectedUuid' element={<InformationDetail />} />
      </Routes>
    </>
  )
}

export default Information