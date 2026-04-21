import React, { useState } from 'react';

const API = 'http://127.0.0.1:5000/api/transactions/';

function StockForm() {
  const [form, setForm] = useState({ product_id: '', transaction_type: 'stock_in', quantity: '', note: '' });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const payload = { ...form, product_id: parseInt(form.product_id), quantity: parseInt(form.quantity) };

    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const json = await res.json();
    if (json.status === 'success') {
      setMessage(`✅ ${json.message}`);
      setForm({ product_id: '', transaction_type: 'stock_in', quantity: '', note: '' });
    } else {
      setError(`❌ ${json.message}`);
    }
  };

  return (
    <div style={styles.wrapper}>
      <h2>📦 Record Stock Transaction</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Product ID</label>
        <input style={styles.input} name="product_id" value={form.product_id} onChange={handleChange} placeholder="e.g. 1" required />

        <label style={styles.label}>Transaction Type</label>
        <select style={styles.input} name="transaction_type" value={form.transaction_type} onChange={handleChange}>
          <option value="stock_in">Stock In</option>
          <option value="stock_out">Stock Out</option>
        </select>

        <label style={styles.label}>Quantity</label>
        <input style={styles.input} name="quantity" value={form.quantity} onChange={handleChange} placeholder="e.g. 10" required />

        <label style={styles.label}>Note (optional)</label>
        <input style={styles.input} name="note" value={form.note} onChange={handleChange} placeholder="e.g. morning restock" />

        <button style={styles.button} type="submit">Submit Transaction</button>

        {message && <p style={{color: 'green', marginTop: '1rem'}}>{message}</p>}
        {error && <p style={{color: 'red', marginTop: '1rem'}}>{error}</p>}
      </form>
    </div>
  );
}

const styles = {
  wrapper: { maxWidth: '500px', margin: '0 auto' },
  form: { background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  label: { fontWeight: 'bold', color: '#2c3e50' },
  input: { padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem' },
  button: { padding: '12px', background: '#e67e22', color: 'white', border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }
};

export default StockForm;
