import { Route, Routes } from "react-router"
import InformationList from "./InformationList"
import InformationDetail from "./InformationDetail"

const Information = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<InformationList />}/>
        <Route path='/detail/:params/:selectedUuid' element={<InformationDetail />} />
      </Routes>
    </>
  )
}

export default Information