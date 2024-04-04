import { Route, Routes } from "react-router"
import { useState } from 'react';
import UserManagement from "./UserManagement";
import CreateAdmins from "./CreateAdmins";
import ApplicationDetail from "Components/Application/ApplicationDetail";

const Users = () => {
  const [tableCellSize, setTableCellSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <UserManagement
              pageNum={pageNum}
              setPageNum={setPageNum}
              tableCellSize={tableCellSize}
              setTableCellSize={setTableCellSize}
            />
          }
        />
        <Route path="/detail/*" element={<ApplicationDetail />} />
        <Route
          path="/CreateAdmins"
          element={
            <CreateAdmins
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

export default Users