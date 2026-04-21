import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import StockForm from './pages/StockForm';

function App() {
  return (
    <Router>
      <div style={styles.container}>
        <nav style={styles.nav}>
          <h2 style={styles.logo}>🌭 Smocha Stand</h2>
          <div style={styles.navLinks}>
            <Link to="/" style={styles.link}>Dashboard</Link>
            <Link to="/stock" style={styles.link}>Record Stock</Link>
          </div>
        </nav>
        <div style={styles.content}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/stock" element={<StockForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

const styles = {
  container: { fontFamily: 'Arial, sans-serif', minHeight: '100vh', background: '#f5f5f5' },
  nav: { background: '#2c3e50', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { color: '#e67e22', margin: 0 },
  navLinks: { display: 'flex', gap: '1.5rem' },
  link: { color: 'white', textDecoration: 'none', fontWeight: 'bold' },
  content: { padding: '2rem' }
};

export default App;