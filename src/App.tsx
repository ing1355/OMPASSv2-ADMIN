import React from 'react';
import './App.css';
import { IntlProvider } from 'react-intl';
import LocaleTexts from 'Locale/LocaleTexts';
import { Routes, Route } from 'react-router-dom';
import Login from 'Components/Login/Login';
import CreateAccount from 'Components/Account/CreateAccount';
import InformationList from 'Components/Information/InformationList';
import InformationDetail from 'Components/Information/InformationDetail';
import { useSelector } from 'react-redux';
import { ReduxStateType } from 'Types/ReduxStateTypes';
import AgentManagement from 'Components/Agent/AgentManagement';

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
        </Routes>
      {/* </div> */}
    </IntlProvider>
  );
}

export default App;