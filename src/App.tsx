import './App.css';
import React, { useEffect } from 'react';
import { IntlProvider } from 'react-intl';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import OMPASSVerify from 'Components/OMPASS/OMPASSVerify';
import Main from 'Components/Main/Main';
import AxiosController from 'AxiosController';
import Locale from './Locale/index';
import PasscodeManagement from 'Components/PasscodeManagement/PasscodeManagement';
import Agent from 'Components/Agent/Agent';
import AutoLogout from 'Components/Login/AutoLogout';
import Header from 'Components/Header/Header';
import Billing from 'Components/Billing/Billing';
import Application from 'Components/Application/Application';
import Policies from 'Components/Policy/Policies';
import Groups from 'Components/Group/Groups';
import Users from 'Components/Users/Users';
import AuthLog from 'Components/Log/AuthLog';
import PortalLog from 'Components/Log/PortalLog';
import Settings from 'Components/Settings';
import { GetGlobalConfigFunc, GetSubDomainInfoFunc } from 'Functions/ApiFunctions';
import { convertLangToIntlVer, MainRouteByDeviceType, subDomain } from 'Constants/ConstantValues';
import { subdomainInfoChange } from 'Redux/actions/subdomainInfoChange';
import SignUp from 'Components/SignUp/SignUp';
import { globalDatasChange } from 'Redux/actions/globalDatasChange';
import Dashboard from 'Components/Dashboard/Dashboard';
import LoginPage from 'Components/Login';
import SecurityQuestionPage from 'Components/Login/SecurityQuestionPage';
import EmailChangeVerification from 'Components/Users/EmailChangeVerification';
import Document from 'Components/Document';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation()
  const userInfo = useSelector((state: ReduxStateType) => state.userInfo!);
  const globalDatas = useSelector((state: ReduxStateType) => state.globalDatas)!;
  const lang = useSelector((state: ReduxStateType) => state.lang!);

  const getDomainInfo = () => {
    GetSubDomainInfoFunc(subDomain, (data) => {
      dispatch(subdomainInfoChange(data))
    })
  }

  useEffect(() => {
    // console.log('route change : ', location.pathname + location.search)
  }, [location])

  useEffect(() => {
    getDomainInfo()
    const documentHeight = () => {
      const doc = document.documentElement
      doc.style.setProperty('--doc-height', `${window.innerHeight}px`)
    }
    window.addEventListener('resize', documentHeight)
    documentHeight()
    return () => {
      window.removeEventListener('resize', documentHeight)
    }
  }, [])

  useEffect(() => {
    if (userInfo) {
      window.addEventListener('storage', () => {
        window.location.reload()
      })
      console.log('userInfo Change : ', userInfo)
      dispatch(globalDatasChange({ ...globalDatas, loading: true }))
      GetGlobalConfigFunc((data) => {
        dispatch(globalDatasChange({ ...globalDatas, ...data, loading: false }))
      })
    }
  }, [userInfo])

  return <IntlProvider locale={convertLangToIntlVer(lang)} messages={Locale[lang]}>
    <AxiosController />
    <Routes>
      <Route path="/docs/*" element={<Document />} />
      <Route path='/*' element={<div className={userInfo ? 'contents-container' : ""}>
        {userInfo && <Header />}
        <Routes>
          <Route path='/ompass/*' element={<OMPASSVerify />} />
          <Route path='/emailChangeConfirm' element={<EmailChangeVerification />} />
          <Route path='/AutoLogout' element={<AutoLogout />} />
          <Route path='/SecurityQuestion' element={<SecurityQuestionPage />} />
          {
            userInfo ? (
              userInfo.role! !== 'USER' ? <>
                <Route path='/Main' element={<Main />} />
                <Route path='/Dashboard' element={<Dashboard />} />
                <Route path='/AgentManagement/*' element={<Agent />} />
                <Route path='/UserManagement/*' element={<Users />} />
                <Route path='/PasscodeManagement' element={<PasscodeManagement />} />
                <Route path='/Billing' element={<Billing />} />
                <Route path='/Applications/*' element={<Application />} />
                <Route path='/Policies/*' element={<Policies />} />
                <Route path='/Groups/*' element={<Groups />} />
                <Route path='/AuthLogs' element={<AuthLog />} />
                <Route path='/PortalLogs' element={<PortalLog />} />
                <Route path='/Settings' element={<Settings />} />
                <Route path='/*' element={<Navigate to={MainRouteByDeviceType} replace={true} />} />
              </>
                : <>
                  <Route path='/Main' element={<Users />} />
                  <Route path='/*' element={<Navigate to='/Main' replace={true} />} />
                </>
            ) : <>
              <Route path='/*' element={<LoginPage />} />
              <Route path='/signup' element={<SignUp />} />
            </>
          }
        </Routes>
      </div>} />
    </Routes>

  </IntlProvider>;
}

export default App;