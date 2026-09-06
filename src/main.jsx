import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { PortfolioProvider } from './context/PortfolioContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <PortfolioProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </PortfolioProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);

