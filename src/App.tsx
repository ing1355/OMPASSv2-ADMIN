import './App.css';
import React, { useEffect } from 'react';
import { IntlProvider } from 'react-intl';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from 'Components/Login/Login';
import OMPASSVerify from 'Components/OMPASS/OMPASSVerify';
import SecretKey from 'Components/SecretKey/SecretKey';
import Main from 'Components/Main/Main';
import AxiosController from 'AxiosController';
import Locale from './Locale/index';
import PasscodeManagement from 'Components/PasscodeManagement/PasscodeManagement';
import Agent from 'Components/Agent/Agent';
import GuidePage from 'Components/Account/GuidePage';
import AutoLogout from 'Components/Login/AutoLogout';
import PermissionSettings from 'Components/PermissionSettings/PermissionSettings';
import Header from 'Components/Header/Header';
import Billing from 'Components/Billing/Billing';
import Application from 'Components/Application/Application';
import Policies from 'Components/Policy/Policies';
import Groups from 'Components/Group/Groups';
import Users from 'Components/Users/Users';
import AuthLog from 'Components/Log/AuthLog';
import PortalLog from 'Components/Log/PortalLog';
import Settings from 'Components/Settings';

const convertLangToIntlVer = (lang: ReduxStateType['lang']) => {
  return lang === 'EN' ? 'en-us' : 'ko-kr'
}

const App: React.FC = () => {
  const { lang, userInfo } = useSelector((state: ReduxStateType) => ({
    lang: state.lang!,
    userInfo: state.userInfo
  }));

  return <IntlProvider locale={convertLangToIntlVer(lang)} messages={Locale[lang]}>
    <AxiosController />
    {/* <button onClick={() => {
      const bluetooth = (navigator as any).bluetooth
      bluetooth.requestDevice({acceptAllDevices: true}).then((device: any) => {
        return device.gatt.connect()
      }).then((server: any) => {
        console.log(server)
      })
      .catch((err: any) => {
        console.log(err)
      })
    }}>
    </button> */}
    {userInfo && <Header />}
    <div className={userInfo ? 'contents-container' : ""}>
      <Routes>
        <Route path='/ompass/*' element={<OMPASSVerify />} />
        <Route path='/GuidePage' element={<GuidePage />} />
        <Route path='/AutoLogout' element={<AutoLogout />} />
        {
          userInfo ? (
            userInfo.role! !== 'USER' ? <>
              <Route path='/Main' element={<Main />} />
              <Route path='/AgentManagement/*' element={<Agent />} />
              <Route path='/UserManagement/*' element={<Users />} />
              <Route path='/PasscodeManagement' element={<PasscodeManagement />} />
              <Route path='/SecretKey' element={<SecretKey />} />
              <Route path='/PermissionSettings' element={<PermissionSettings />} />
              <Route path='/Billing' element={<Billing />} />
              <Route path='/Applications/*' element={<Application />} />
              <Route path='/Policies/*' element={<Policies />} />
              <Route path='/Groups/*' element={<Groups />} />
              <Route path='/AuthLogs' element={<AuthLog />} />
              <Route path='/PortalLogs' element={<PortalLog />} />
              <Route path='/Settings' element={<Settings />} />
              <Route path='/*' element={<Navigate to='/Main' replace={true} />} />
            </>
              : <>
                <Route path='/Main' element={<Users />} />
                <Route path='/*' element={<Navigate to='/Main' replace={true} />} />
              </>
          ) :
            <>
              <Route path='/*' element={<Navigate to='/' replace={true} />} />
              <Route path='/' element={<Login />} />
            </>
        }
      </Routes>
    </div>
  </IntlProvider>;
}

export default App;