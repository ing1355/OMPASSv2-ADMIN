import './App.css';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ReduxStateType } from 'Types/ReduxStateTypes';
import Login from 'Components/Login/Login';
import CreateAccount from 'Components/Account/CreateAccount';
import InformationDetail from 'Components/Information/InformationDetail';
import OMPASSVerify from 'Components/OMPASS/OMPASSVerify';
import SecretKey from 'Components/SecretKey/SecretKey';
import Main from 'Components/Main/Main';
import AxiosController from 'AxiosController';
import Locale from './Locale/index';
import PasscodeManagement from 'Components/PasscodeManagement/PasscodeManagement';
import Information from 'Components/Information/Information';
import Admins from 'Components/Admins/Admins';
import Agent from 'Components/Agent/Agent';
import GuidePage from 'Components/Account/GuidePage';
import AutoLogout from 'Components/Login/AutoLogout';
import PermissionSettings from 'Components/PermissionSettings/PermissionSettings';

const App: React.FC = () => {
  const { lang, userInfo } = useSelector((state: ReduxStateType) => ({
    lang: state.lang!,
    userInfo: state.userInfo
  }));
  return (
    <IntlProvider locale={lang} messages={Locale[lang]}>
      {/* <div className="App"> */}
      <AxiosController />
      <Routes>
        <Route path='/ompass/*' element={<OMPASSVerify />} />
        {
          userInfo ? (
            userInfo.role!.includes('ADMIN') ? <>
            <Route path='/Main' element={<Main />} />
            <Route path='/Information/*' element={<Information />} />
            {/* <Route path='/InformationList*' element={<InformationList />} /> */}
            {/* <Route path='/InformationDetail/:params/:selectedUuid' element={<InformationDetail />} /> */}
            {/* <Route path='/Information/detail/:params/:selectedUuid' element={<InformationDetail />} /> */}
            <Route path='/AgentManagement/*' element={<Agent />} />
            <Route path='/AdminsManagement/*' element={<Admins />} />
            <Route path='/PasscodeManagement' element={<PasscodeManagement />} />
            <Route path='/SecretKey' element={<SecretKey />} />
            <Route path='/*' element={<Navigate to='/Main' replace={true}/>}/>
            </> 
            : 
            // <Route path='/*' element={<Navigate to='/Information/*' replace={true}/>}/>
            <Route path='/*' element={<InformationDetail />}/>
          ) : 
          <>
            <Route path='/*' element={<Navigate to='/' replace={true}/>}/>
            <Route path='/CreateAccount' element={<CreateAccount />} />
            <Route path='/' element={<Login />} />
            <Route path='/GuidePage' element={<GuidePage />} />
            <Route path='/AutoLogout' element={<AutoLogout />} />
            <Route path='/PermissionSettings' element={<PermissionSettings />} />
          </>
        }
      </Routes>
      {/* </div> */}
    </IntlProvider>
  );
}

export default App;