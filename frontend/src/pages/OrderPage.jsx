import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function OrderPage() {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]); // For employees/owners to view orders

  useEffect(() => {
    // Fetch products
    fetch("http://127.0.0.1:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.data || []))
      .catch((err) => console.error("Failed to fetch products", err));

    // If employee or owner, fetch orders
    if (user && (user.role === "employee" || user.role === "owner")) {
      fetch("http://127.0.0.1:5000/api/orders", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => res.json())
        .then((data) => setOrders(data.data || []))
        .catch((err) => console.error("Failed to fetch orders", err));
    }
  }, [user]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const placeOrder = () => {
    // Implement order placement
    alert("Order placed!");
    setCart([]);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const isCustomer = !user || user.role === "customer";
  const isEmployee = user?.role === "employee";
  const isOwner = user?.role === "owner";

  return (
    <div style={{ padding: "1rem", maxWidth: "1200px", margin: "0 auto" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h1 style={{ fontSize: "1.5rem", margin: 0 }}>Smocha Stand</h1>
        <div>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <span>Welcome, {user.username} ({user.role})</span>
              {isOwner && <Link to="/dashboard" style={{ color: "#007bff" }}>Manage</Link>}
              <button onClick={logout} style={{ padding: "0.5rem", background: "#dc3545", color: "white", border: "none", borderRadius: "0.25rem" }}>Logout</button>
            </div>
          ) : (
            <Link to="/login" style={{ padding: "0.5rem", background: "#007bff", color: "white", textDecoration: "none", borderRadius: "0.25rem" }}>Login</Link>
          )}
        </div>
      </header>

      {isCustomer && (
        <div>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>Menu</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
            {products.map((product) => (
              <div
                key={product.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "0.5rem",
                  padding: "0.75rem",
                  textAlign: "center",
                }}
              >
                <h3 style={{ fontSize: "1rem", margin: "0 0 0.5rem" }}>{product.name}</h3>
                <p style={{ fontSize: "0.8rem", margin: "0 0 0.5rem" }}>{product.description}</p>
                <p style={{ fontSize: "0.9rem", fontWeight: "bold", margin: "0 0 0.5rem" }}>
                  KSh {product.price}
                </p>
                <button
                  onClick={() => addToCart(product)}
                  style={{
                    padding: "0.5rem 1rem",
                    background: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "0.25rem",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                  }}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "2rem" }}>
            <h2 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>Your Order</h2>
            {cart.length === 0 ? (
              <p style={{ fontSize: "0.9rem" }}>No items in cart</p>
            ) : (
              <div>
                {cart.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.5rem",
                      padding: "0.5rem",
                      border: "1px solid #ddd",
                      borderRadius: "0.25rem",
                    }}
                  >
                    <div>
                      <p style={{ fontSize: "0.8rem", margin: 0 }}>{item.name}</p>
                      <p style={{ fontSize: "0.7rem", margin: 0 }}>
                        {item.quantity} x KSh {item.price}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        padding: "0.25rem 0.5rem",
                        background: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "0.25rem",
                        cursor: "pointer",
                        fontSize: "0.7rem",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #ddd" }}>
                  <p style={{ fontSize: "1rem", fontWeight: "bold", margin: 0 }}>
                    Total: KSh {total.toFixed(2)}
                  </p>
                  <button
                    onClick={placeOrder}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      background: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "0.25rem",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    Place Order
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {(isEmployee || isOwner) && (
        <div style={{ marginTop: "2rem" }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>Orders to Serve</h2>
          {orders.length === 0 ? (
            <p style={{ fontSize: "0.9rem" }}>No pending orders</p>
          ) : (
            <div>
              {orders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "0.5rem",
                    padding: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <p>Order #{order.id} - {order.customer}</p>
                  <p>Items: {order.items.join(", ")}</p>
                  <button style={{ padding: "0.5rem", background: "#28a745", color: "white", border: "none", borderRadius: "0.25rem" }}>
                    Mark as Served
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {isOwner && (
        <div style={{ marginTop: "2rem" }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>Owner Controls</h2>
          <Link to="/dashboard" style={{ padding: "0.5rem", background: "#007bff", color: "white", textDecoration: "none", borderRadius: "0.25rem" }}>
            Manage Inventory & Employees
          </Link>
        </div>
      )}
    </div>
  );
}