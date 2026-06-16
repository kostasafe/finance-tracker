import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Dashboard() {
	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	const [categories, setCategories] = useState([]);
	const [transactions, setTransactions] = useState([]);

	// category form
	const [newCategoryName, setNewCategoryName] = useState("");
	const [newCategoryType, setNewCategoryType] = useState("expense");

	// transaction form
	const [txAmount, setTxAmount] = useState("");
	const [txDate, setTxDate] = useState("");
	const [txDesc, setTxDesc] = useState("");
	const [txCategoryId, setTxCategoryId] = useState("");

	useEffect(() => {
		// restore token if present so api has Authorization header on refresh
		const token = localStorage.getItem("access_token");
		if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

		const fetchUser = async () => {
			try {
				const res = await api.get("/auth/me");
				setUser(res.data);
			} catch (err) {
				console.error("Failed to fetch user:", err);
			}
		};

		const fetchCategories = async () => {
			try {
				const res = await api.get("/categories");
				setCategories(res.data || []);
			} catch (err) {
				console.error("Failed to fetch categories:", err);
			}
		};

		const fetchTransactions = async () => {
			try {
				const res = await api.get("/transaction", { params: { page: 1, page_size: 10 } });
				setTransactions(res.data || []);
			} catch (err) {
				console.error("Failed to fetch transactions:", err);
			}
		};

		fetchUser();
		fetchCategories();
		fetchTransactions();
	}, []);

	const refreshData = () => {
		// helper to re-fetch lists after creates/deletes
		api.get("/categories").then((r) => setCategories(r.data || [])).catch(() => {});
		api.get("/transaction", { params: { page: 1, page_size: 10 } }).then((r) => setTransactions(r.data || [])).catch(() => {});
	};

	const handleCreateCategory = async (e) => {
		e?.preventDefault();
		try {
			await api.post("/categories", { name: newCategoryName, type: newCategoryType });
			setNewCategoryName("");
			setNewCategoryType("expense");
			refreshData();
		} catch (err) {
			console.error("Failed to create category:", err);
		}
	};

	const handleCreateTransaction = async (e) => {
		e?.preventDefault();
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
			refreshData();
		} catch (err) {
			console.error("Failed to create transaction:", err);
		}
	};

	const handleLogout = () => {
		localStorage.removeItem("access_token");
		delete api.defaults.headers.common["Authorization"];
		navigate("/");
	};

	return (
		<div style={{ display: "flex", minHeight: "100vh" }}>
			<aside style={{ width: 220, padding: 24, background: "#0f172a", color: "#fff" }}>
				<div style={{ marginBottom: 24 }}>
					<h2 style={{ margin: 0, fontSize: 18 }}>Finance Tracker</h2>
				</div>

				<div style={{ marginBottom: 32 }}>
					<div style={{ fontSize: 12, opacity: 0.8 }}>Signed in as</div>
					<div style={{ fontWeight: 600, marginTop: 6 }}>{user?.username ?? "-"}</div>
				</div>

				<div>
					<button
						onClick={handleLogout}
						style={{
							background: "#ef4444",
							color: "#fff",
							border: "none",
							padding: "8px 12px",
							borderRadius: 6,
							cursor: "pointer",
						}}
					>
						Logout
					</button>
				</div>
			</aside>

			<main style={{ flex: 1, padding: 32 }}>
				<h1>Dashboard</h1>
				<div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24, marginTop: 16 }}>
					<section style={{ background: "#fff", padding: 16, borderRadius: 8 }}>
						<h3 style={{ marginTop: 0 }}>Create Category</h3>
						<form onSubmit={handleCreateCategory}>
							<label style={{ display: "block", marginBottom: 8 }}>
								<span style={{ display: "block", fontSize: 12 }}>Name</span>
								<input value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} required style={{ width: "100%", padding: 8, background: "#fff", border: "1px solid #d1d5db", borderRadius: 4, boxSizing: "border-box", color: "#111" }} />
							</label>
							<label style={{ display: "block", marginBottom: 12 }}>
								<span style={{ display: "block", fontSize: 12 }}>Type</span>
								<select value={newCategoryType} onChange={(e) => setNewCategoryType(e.target.value)} style={{ width: "100%", padding: 8, background: "#fff", border: "1px solid #d1d5db", borderRadius: 4, boxSizing: "border-box", color: "#111" }}>
									<option value="expense">Expense</option>
									<option value="income">Income</option>
								</select>
							</label>
							<button type="submit" style={{ display: "block", margin: "16px auto 0", padding: "8px 12px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 6 }}>Create</button>
						</form>
						<hr style={{ margin: "16px 0" }} />
						<h3 style={{ marginTop: 0 }}>Your Categories</h3>
						{categories.length === 0 ? <p style={{ color: "#666" }}>No categories yet.</p> : (
							<ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
								{categories.map((c) => (
									<li key={c.id} style={{ padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}>
										<div style={{ display: "flex", justifyContent: "space-between" }}>
											<div>{c.name}</div>
											<div style={{ fontSize: 12, color: "#666" }}>{c.type}</div>
										</div>
									</li>
								))}
							</ul>
						)}
					</section>

					<section style={{ background: "#fff", padding: 16, borderRadius: 8 }}>
						<h3 style={{ marginTop: 0 }}>Add Transaction</h3>
						<form onSubmit={handleCreateTransaction}>
							<label style={{ display: "block", marginBottom: 8 }}>
								<span style={{ display: "block", fontSize: 12 }}>Amount</span>
								<input value={txAmount} onChange={(e) => setTxAmount(e.target.value)} required placeholder="0.00" style={{ width: "100%", padding: 8, background: "#fff", border: "1px solid #d1d5db", borderRadius: 4, boxSizing: "border-box", color: "#111" }} />
							</label>
							<label style={{ display: "block", marginBottom: 8 }}>
								<span style={{ display: "block", fontSize: 12 }}>Date</span>
								<input type="date" value={txDate} onChange={(e) => setTxDate(e.target.value)} required style={{ width: "100%", padding: 8, background: "#fff", border: "1px solid #d1d5db", borderRadius: 4, boxSizing: "border-box", color: "#111" }} />
							</label>
							<label style={{ display: "block", marginBottom: 8 }}>
								<span style={{ display: "block", fontSize: 12 }}>Description</span>
								<input value={txDesc} onChange={(e) => setTxDesc(e.target.value)} style={{ width: "100%", padding: 8, background: "#fff", border: "1px solid #d1d5db", borderRadius: 4, boxSizing: "border-box", color: "#111" }} />
							</label>
							<label style={{ display: "block", marginBottom: 12 }}>
								<span style={{ display: "block", fontSize: 12 }}>Category</span>
								<select value={txCategoryId} onChange={(e) => setTxCategoryId(e.target.value)} style={{ width: "100%", padding: 8, background: "#fff", border: "1px solid #d1d5db", borderRadius: 4, boxSizing: "border-box", color: "#111" }}>
									<option value="">(none)</option>
									{categories.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.type})</option>)}
								</select>
							</label>
						<button type="submit" style={{ display: "block", margin: "16px auto 0", padding: "8px 12px", background: "#059669", color: "#fff", border: "none", borderRadius: 6 }}>Add Transaction</button>				</form>
						<hr style={{ margin: "16px 0" }} />
						<h3 style={{ marginTop: 0 }}>Recent Transactions</h3>
						{transactions.length === 0 ? (
							<p style={{ color: "#666" }}>No transactions yet.</p>
						) : (
							<table style={{ width: "100%", borderCollapse: "collapse" }}>
								<thead>
									<tr style={{ textAlign: "left", borderBottom: "1px solid #eee" }}>
										<th style={{ padding: "8px 4px" }}>Date</th>
										<th style={{ padding: "8px 4px" }}>Description</th>
										<th style={{ padding: "8px 4px" }}>Category</th>
										<th style={{ padding: "8px 4px" }}>Amount</th>
									</tr>
								</thead>
								<tbody>
									{transactions.map((t) => (
										<tr key={t.id} style={{ borderBottom: "1px solid #f4f4f4" }}>
											<td style={{ padding: "8px 4px", width: 110 }}>{new Date(t.date).toLocaleDateString()}</td>
											<td style={{ padding: "8px 4px" }}>{t.description || "-"}</td>
							<td style={{ padding: "8px 4px" }}>{categories.find((c) => c.id === t.category_id)?.name ?? "-"}</td>
											<td style={{ padding: "8px 4px", textAlign: "right" }}>{Number(t.amount).toFixed(2)}</td>
										</tr>
									))}
								</tbody>
							</table>
						)}
					</section>
				</div>
			</main>
		</div>
	);
}

export default Dashboard;

