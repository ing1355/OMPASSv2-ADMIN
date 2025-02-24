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
import { Routes, Route } from 'react-router';
import Document from 'Components/Document';
import ErrorBoundary from 'ErrorBoundary';

dayjs.extend(utc)

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <ErrorBoundary>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/docs/user/*" element={<Document />} />
          <Route path="/*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </ErrorBoundary>
);
reportWebVitals();