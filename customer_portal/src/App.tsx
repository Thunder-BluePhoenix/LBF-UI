// src/App.jsx
import { StrictMode } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { FrappeProvider } from 'frappe-react-sdk';  // If you're using Frappe
import { DataProvider } from './Context/DataProvider';
import AppRoutes from './route/AppRoutes';
 
function App() {
  return (
    <StrictMode>
    <FrappeProvider>
      <Router>
        <DataProvider>
          <AppRoutes />
        </DataProvider>
      </Router>
    </FrappeProvider>
  </StrictMode>
  );
}

export default App;