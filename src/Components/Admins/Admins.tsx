import { Route, Routes } from "react-router"
import { useState } from 'react';
import AdminsManagement from "./AdminsManagement";
import InformationDetail from "Components/Information/InformationDetail";

const Admins = () => {
  const [tableCellSize, setTableCellSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);

  return (
    <>
      <Routes>
        <Route 
          path="/" 
          element={
            <AdminsManagement
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

export default Admins