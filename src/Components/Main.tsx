import { Link } from "react-router-dom"

const Main = () => {
  return (
    <>
      <Link to="/login">로그인하기</Link>
      <Link to="/CreateAccount">회원가입</Link>
    </>
  )
}

export default Main;