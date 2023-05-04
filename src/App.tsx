import React from 'react';
import './App.css';
import { IntlProvider } from 'react-intl';
import LocaleTexts from 'Locale/LocaleText';
import { Routes, Route } from 'react-router-dom';
import Login from 'Components/Login/Login';
import Main from 'Components/Main';
import CreateAccount from 'Components/Account/CreateAccount';

const App: React.FC = () => {
  const lang = 'ko';

  return (
    <IntlProvider locale={lang} messages={LocaleTexts[lang]}>
      {/* <div className="App"> */}
        <Routes>
          {/* <Route path='/' element={<Main />}/> */}
          <Route path='/' element={<Login />}/>
          <Route path='/CreateAccount' element={<CreateAccount />}/>
        </Routes>
      {/* </div> */}
    </IntlProvider>
  );
}

export default App;