import * as ReactDOM from 'react-dom/client';
import './index.css';
import './GlobalStyles';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './Redux/store';
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';
import { DateTimeFormat } from 'Constants/ConstantValues';

dayjs.extend(utc)

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
reportWebVitals();