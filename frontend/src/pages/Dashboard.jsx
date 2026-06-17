import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { removeToken } from "../utils/auth";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ total_income: 0, total_expense: 0, balance: 0 });
  const [error, setError] = useState("");

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryType, setNewCategoryType] = useState("expense");
  const [txAmount, setTxAmount] = useState("");
  const [txDate, setTxDate] = useState("");
  const [txDesc, setTxDesc] = useState("");
  const [txCategoryId, setTxCategoryId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, categoriesRes, transactionsRes, summaryRes] = await Promise.all([
          api.get("/auth/me"),
          api.get("/categories"),
          api.get("/transaction", { params: { page: 1, page_size: 10 } }),
          api.get("/transaction/summary"),
        ]);

        setUser(userRes.data);
        setCategories(categoriesRes.data || []);
        setTransactions(transactionsRes.data || []);
        setSummary(summaryRes.data || summary);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        setError("Unable to load dashboard. Please sign in again.");
      }
    };

    fetchData();
  }, []);

  const refreshData = async () => {
    try {
      const [categoriesRes, transactionsRes, summaryRes] = await Promise.all([
        api.get("/categories"),
        api.get("/transaction", { params: { page: 1, page_size: 10 } }),
        api.get("/transaction/summary"),
      ]);

      setCategories(categoriesRes.data || []);
      setTransactions(transactionsRes.data || []);
      setSummary(summaryRes.data || summary);
    } catch (err) {
      console.error("Failed to refresh dashboard data:", err);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setError("");

    if (!newCategoryName.trim()) {
      setError("Category name cannot be empty.");
      return;
    }

    try {
      await api.post("/categories", {
        name: newCategoryName,
        type: newCategoryType,
      });
      setNewCategoryName("");
      setNewCategoryType("expense");
      await refreshData();
    } catch (err) {
      console.error("Failed to create category:", err);
      setError(err.response?.data?.detail || "Could not create category.");
    }
  };

  const handleCreateTransaction = async (e) => {
    e.preventDefault();
    setError("");

    if (!txAmount || !txDate) {
      setError("Amount and date are required.");
      return;
    }

    try {
      const payload = {
        amount: parseFloat(txAmount),
        date: txDate,
        description: txDesc || null,
        category_id: txCategoryId ? Number(txCategoryId) : null,
      };

      await api.post("/transaction", payload);
      setTxAmount("");
      setTxDate("");
      setTxDesc("");
      setTxCategoryId("");
      await refreshData();
    } catch (err) {
      console.error("Failed to create transaction:", err);
      setError(err.response?.data?.detail || "Could not create transaction.");
    }
  };

  const handleLogout = () => {
    removeToken();
    api.setAuthToken(null);
    navigate("/");
  };

  return (
    <div className="dashboard-shell">
      <div className="dashboard-top">
        <div>
          <h1>Welcome, {user?.username ?? "Financial manager"}</h1>
          <p>Track your income, expenses and categories in one place.</p>
        </div>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div className="dashboard-summary">
        <div className="summary-card">
          <strong>Total income</strong>
          <p>${Number(summary.total_income).toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <strong>Total expense</strong>
          <p>${Number(summary.total_expense).toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <strong>Balance</strong>
          <p>${Number(summary.balance).toFixed(2)}</p>
        </div>
      </div>

      <main className="dashboard-content">
        <section className="dashboard-panel">
          <h2 className="panel-title">Create category</h2>
          {error && <div className="message-box">{error}</div>}
          <form className="panel-form" onSubmit={handleCreateCategory}>
            <label>
              <span>Category name</span>
              <input
                className="panel-input"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g. Groceries"
              />
            </label>
            <label>
              <span>Type</span>
              <select
                className="panel-select"
                value={newCategoryType}
                onChange={(e) => setNewCategoryType(e.target.value)}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </label>
            <div className="panel-actions">
              <button type="submit">Save category</button>
            </div>
          </form>

          <h2 className="panel-title">Your categories</h2>
          {categories.length === 0 ? (
            <p>No categories yet.</p>
          ) : (
            <ul className="card-list">
              {categories.map((category) => (
                <li key={category.id}>
                  <span>{category.name}</span>
                  <span>{category.type}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="dashboard-panel">
          <h2 className="panel-title">Add transaction</h2>
          <form className="panel-form" onSubmit={handleCreateTransaction}>
            <label>
              <span>Amount</span>
              <input
                className="panel-input"
                type="number"
                step="0.01"
                value={txAmount}
                onChange={(e) => setTxAmount(e.target.value)}
                placeholder="0.00"
              />
            </label>
            <label>
              <span>Date</span>
              <input
                className="panel-input"
                type="date"
                value={txDate}
                onChange={(e) => setTxDate(e.target.value)}
              />
            </label>
            <label>
              <span>Description</span>
              <input
                className="panel-input"
                type="text"
                value={txDesc}
                onChange={(e) => setTxDesc(e.target.value)}
                placeholder="Optional description"
              />
            </label>
            <label>
              <span>Category</span>
              <select
                className="panel-select"
                value={txCategoryId}
                onChange={(e) => setTxCategoryId(e.target.value)}
              >
                <option value="">(none)</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.type})
                  </option>
                ))}
              </select>
            </label>
            <div className="panel-actions">
              <button type="submit">Add transaction</button>
            </div>
          </form>

          <h2 className="panel-title">Recent transactions</h2>
          {transactions.length === 0 ? (
            <p>No transactions yet.</p>
          ) : (
            <table className="recent-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{new Date(transaction.date).toLocaleDateString()}</td>
                    <td>{transaction.description || "-"}</td>
                    <td>{categories.find((c) => c.id === transaction.category_id)?.name ?? "-"}</td>
                    <td>${Number(transaction.amount).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
