import './App.css';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ReduxStateType } from 'Types/ReduxStateTypes';
import Login from 'Components/Login/Login';
import CreateAccount from 'Components/Account/CreateAccount';
import InformationList from 'Components/Information/InformationList';
import InformationDetail from 'Components/Information/InformationDetail';
import AgentManagement from 'Components/Agent/AgentManagement';
import AdminsManagement from 'Components/Admins/AdminsManagement';
import Manual from 'Components/Manual/Manual';
import OMPASSVerify from 'Components/OMPASS/OMPASSVerify';
import SecretKey from 'Components/SecretKey/SecretKey';
import Main from 'Components/Information/Main';
import AxiosController from 'AxiosController';
import Locale from './Locale/index';
import PasscodeManagement from 'Components/PasscodeManagement/PasscodeManagement';

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
        <Route path='/InformationDetail/:params/:selectedUuid' element={<InformationDetail />} />
        <Route path='/CreateAccount' element={<CreateAccount />} />
        <Route path='/Manual' element={<Manual />} />
        {
          userInfo ? (
            userInfo.role!.includes('ADMIN') ? <>
            <Route path='/Main' element={<Main />} />
            <Route path='/InformationList' element={<InformationList />} />
            <Route path='/AgentManagement' element={<AgentManagement />} />
            <Route path='/AdminsManagement' element={<AdminsManagement />} />
            <Route path='/PasscodeManagement' element={<PasscodeManagement />} />
            <Route path='/SecretKey' element={<SecretKey />} />
            <Route path='/*' element={<Navigate to='/Main' replace={true}/>}/>
            </> : <Route path='/*' element={<Navigate to='/InformationDetail/User' replace={true}/>}/>
          ) : 
          <>
            <Route path='/*' element={<Navigate to='/' replace={true}/>}/>
            <Route path='/' element={<Login />} />
          </>
        }
      </Routes>
      {/* </div> */}
    </IntlProvider>
  );
}

export default App;