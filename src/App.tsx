import React from 'react';
import './App.css';
import { IntlProvider } from 'react-intl';
import LocaleTexts from 'Locale/LocaleText';
import { Routes, Route } from 'react-router-dom';
import Login from 'Components/Login/Login';
import CreateAccount from 'Components/Account/CreateAccount';
import InformationList from 'Components/Information/InformationList';
import InformationDetail from 'Components/Information/InformationDetail';

const App: React.FC = () => {
  const lang = 'ko';

  return (
    <IntlProvider locale={lang} messages={LocaleTexts[lang]}>
      {/* <div className="App"> */}
        <Routes>
          <Route path='/' element={<Login />}/>
          <Route path='/CreateAccount' element={<CreateAccount />}/>
          <Route path='/InformationList' element={<InformationList />}/>
          <Route path='/InformationDetail' element={<InformationDetail />}/>
        </Routes>
      {/* </div> */}
    </IntlProvider>
  );
}

export default App;