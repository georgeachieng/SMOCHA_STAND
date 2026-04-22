import React, { useEffect, useState } from 'react';

const API = 'http://127.0.0.1:5000/api/transactions/';

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(json => {
        setTransactions(json.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2>📋 Transaction History</h2>
      {loading ? <p>Loading...</p> : (
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Product ID</th>
              <th style={styles.th}>Quantity</th>
              <th style={styles.th}>Note</th>
              <th style={styles.th}>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t.id} style={styles.row}>
                <td style={styles.td}>{t.id}</td>
                <td style={styles.td}>
                  <span style={{...styles.badge, background: t.transaction_type === 'stock_in' ? '#27ae60' : '#e74c3c'}}>
                    {t.transaction_type}
                  </span>
                </td>
                <td style={styles.td}>{t.product_id}</td>
                <td style={styles.td}>{t.quantity}</td>
                <td style={styles.td}>{t.note}</td>
                <td style={styles.td}>{new Date(t.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  table: { width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  headerRow: { background: '#2c3e50', color: 'white' },
  th: { padding: '12px 16px', textAlign: 'left' },
  td: { padding: '12px 16px', borderBottom: '1px solid #eee' },
  row: { transition: 'background 0.2s' },
  badge: { padding: '4px 10px', borderRadius: '12px', color: 'white', fontSize: '0.85rem' }
};

export default Dashboard;
