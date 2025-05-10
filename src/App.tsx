import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import SkuMapper from './pages/SkuMapper';
import DataImport from './pages/DataImport';
import DataExplorer from './pages/DataExplorer';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#333',
          },
        }}
      />
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sku-mapper" element={<SkuMapper />} />
          <Route path="/data-import" element={<DataImport />} />
          <Route path="/data-explorer" element={<DataExplorer />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;