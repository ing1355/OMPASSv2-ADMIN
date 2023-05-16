import './App.css';
import React from 'react';
import { IntlProvider } from 'react-intl';
import LocaleTexts from 'Locale/LocaleTexts';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ReduxStateType } from 'Types/ReduxStateTypes';
import Login from 'Components/Login/Login';
import CreateAccount from 'Components/Account/CreateAccount';
import InformationList from 'Components/Information/InformationList';
import InformationDetail from 'Components/Information/InformationDetail';
import AgentManagement from 'Components/Agent/AgentManagement';
import AdminsManagement from 'Components/Admins/AdminsManagement';
import Manual from 'Components/Manual/Manual';

const App: React.FC = () => {
  const { lang } = useSelector((state: ReduxStateType) => ({
    lang: state.lang!,
  }));

  return (
    <IntlProvider locale={lang} messages={LocaleTexts[lang]}>
      {/* <div className="App"> */}
        <Routes>
          <Route path='/' element={<Login />}/>
          <Route path='/CreateAccount' element={<CreateAccount />}/>
          <Route path='/InformationList' element={<InformationList />}/>
          <Route path='/InformationDetail' element={<InformationDetail />}/>
          <Route path='/AgentManagement' element={<AgentManagement />}/>
          <Route path='/AdminsManagement' element={<AdminsManagement />}/>
          <Route path='/Manual' element={<Manual />}/>
        </Routes>
      {/* </div> */}
    </IntlProvider>
  );
}

export default App;