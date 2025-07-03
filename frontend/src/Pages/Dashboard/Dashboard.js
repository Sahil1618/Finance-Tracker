// import React, { useEffect, useState } from "react";
// import axios from "axios";

// import { getTransactions } from "../../utils/ApiRequest";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// const COLORS = ["#FF8042", "#00C49F", "#0088FE", "#FFBB28", "#FF4444"];

// const Dashboard = () => {
//   const [transactions, setTransactions] = useState([]);
//   const [categoryData, setCategoryData] = useState([]);
//   const [lineChartData, setLineChartData] = useState([]);
//   const [totalSpent, setTotalSpent] = useState(0);
//   const [topCategory, setTopCategory] = useState("");
//   const [suggestions, setSuggestions] = useState([]); // 🆕

//   useEffect(() => {
//     fetchData();
//   }, []);
//   const fetchSuggestions = async (txns) => {
//     try {
//       const cleanedTxns = txns
//         .filter((t) => t.transactionType === "expense")
//         .map((t) => ({
//           date: t.date,
//           amount: Number(t.amount),
//           category: t.category,
//           transactionType: t.transactionType,
//         }));

//       console.log("🧠 Sending to Flask:", cleanedTxns); // ✅ Debug

//       const { data } = await axios.post("http://localhost:5001/analyze", {
//         transactions: cleanedTxns,
//       });

//       console.log("🧠 Flask Suggestions:", data.suggestions); // ✅ Debug
//       setSuggestions(data.suggestions || []);
//     } catch (err) {
//       console.error("❌ Failed to fetch suggestions", err.message);
//     }
//   };

//   const fetchData = async () => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     if (!user || !user._id) return;

//     try {
//       const { data } = await axios.post(
//         getTransactions,
//         {
//           userId: user._id,
//           type: "all",
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//           },
//         }
//       );

//       const currentMonth = new Date().getMonth();
//       const thisMonthTxns = data.transactions.filter(
//         (t) => new Date(t.date).getMonth() === currentMonth
//       );

//       setTransactions(thisMonthTxns);
//       fetchSuggestions(thisMonthTxns); // 🆕

//       // Total Spent
//       const total = thisMonthTxns.reduce(
//         (sum, txn) =>
//           txn.transactionType === "expense" ? sum + txn.amount : sum,
//         0
//       );
//       setTotalSpent(total);

//       // Category Wise
//       const categoryMap = {};
//       const dateMap = {};

//       thisMonthTxns.forEach((txn) => {
//         if (txn.transactionType === "expense") {
//           categoryMap[txn.category] =
//             (categoryMap[txn.category] || 0) + txn.amount;
//         }

//         const date = txn.date.split("T")[0];
//         dateMap[date] = (dateMap[date] || 0) + txn.amount;
//       });

//       const pieData = Object.entries(categoryMap).map(([name, value]) => ({
//         name,
//         value,
//       }));
//       setCategoryData(pieData);

//       if (pieData.length > 0) {
//         const top = pieData.reduce(
//           (max, item) => (item.value > max.value ? item : max),
//           pieData[0]
//         );
//         setTopCategory(top.name);
//       }

//       const lineData = Object.entries(dateMap).map(([date, amount]) => ({
//         date,
//         amount,
//       }));
//       setLineChartData(lineData);
//     } catch (err) {
//       console.log("Dashboard fetch error:", err.message);
//     }
//   };

//   return (
//     <div
//       style={{
//         padding: "2rem",
//         color: "#fff",
//         background: "#111",
//         minHeight: "100vh",
//       }}
//     >
//       <h2>📊 Reports Dashboard</h2>

//       <div style={{ marginTop: "2rem" }}>
//         <h4>Total Spent This Month: ₹{totalSpent}</h4>
//         <h4>Most Spent Category: {topCategory || "N/A"}</h4>
//         <h4>💡 Smart Suggestions:</h4>
//         <ul>
//           {suggestions.length > 0 ? (
//             suggestions.map((s, i) => <li key={i}>👉 {s}</li>)
//           ) : (
//             <li>No suggestions yet</li>
//           )}
//         </ul>
//       </div>

//       {/* Pie & Line Charts (same as before) */}
//       <div
//         style={{
//           display: "flex",
//           flexWrap: "wrap",
//           marginTop: "2rem",
//           gap: "2rem",
//         }}
//       >
//         <div
//           style={{
//             flex: 1,
//             minWidth: "300px",
//             background: "#222",
//             padding: "1rem",
//             borderRadius: "10px",
//           }}
//         >
//           <h5>Category-wise Spending</h5>
//           {categoryData.length > 0 ? (
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={categoryData}
//                   dataKey="value"
//                   nameKey="name"
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={100}
//                   fill="#8884d8"
//                   label
//                 >
//                   {categoryData.map((entry, index) => (
//                     <Cell
//                       key={`cell-${index}`}
//                       fill={COLORS[index % COLORS.length]}
//                     />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           ) : (
//             <p>No spending data</p>
//           )}
//         </div>

//         <div
//           style={{
//             flex: 2,
//             minWidth: "300px",
//             background: "#222",
//             padding: "1rem",
//             borderRadius: "10px",
//           }}
//         >
//           <h5>Spending Over Time</h5>
//           {lineChartData.length > 0 ? (
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={lineChartData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="date" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Line type="monotone" dataKey="amount" stroke="#82ca9d" />
//               </LineChart>
//             </ResponsiveContainer>
//           ) : (
//             <p>No line chart data</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { getTransactions } from "../../utils/ApiRequest";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom"; // 🆕 for navigation

const COLORS = ["#FF8042", "#00C49F", "#0088FE", "#FFBB28", "#FF4444"];

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [topCategory, setTopCategory] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const navigate = useNavigate(); // 🆕

  useEffect(() => {
    fetchData();
  }, []);

  const fetchSuggestions = async (txns) => {
    try {
      const cleanedTxns = txns
        .filter((t) => t.transactionType === "expense")
        .map((t) => ({
          date: t.date,
          amount: Number(t.amount),
          category: t.category,
          transactionType: t.transactionType,
        }));

      console.log("🧠 Sending to Flask:", cleanedTxns);

      const { data } = await axios.post("http://localhost:5001/analyze", {
        transactions: cleanedTxns,
      });

      console.log("🧠 Flask Suggestions:", data.suggestions);
      setSuggestions(data.suggestions || []);
    } catch (err) {
      console.error("❌ Failed to fetch suggestions", err.message);
    }
  };

  const fetchData = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user._id) return;

    try {
      const { data } = await axios.post(
        getTransactions,
        {
          userId: user._id,
          type: "all",
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const currentMonth = new Date().getMonth();
      const thisMonthTxns = data.transactions.filter(
        (t) => new Date(t.date).getMonth() === currentMonth
      );

      setTransactions(thisMonthTxns);
      fetchSuggestions(thisMonthTxns);

      // Total Spent
      const total = thisMonthTxns.reduce(
        (sum, txn) =>
          txn.transactionType === "expense" ? sum + txn.amount : sum,
        0
      );
      setTotalSpent(total);

      // Category Wise
      const categoryMap = {};
      const dateMap = {};

      thisMonthTxns.forEach((txn) => {
        if (txn.transactionType === "expense") {
          categoryMap[txn.category] =
            (categoryMap[txn.category] || 0) + txn.amount;
        }

        const date = txn.date.split("T")[0];
        dateMap[date] = (dateMap[date] || 0) + txn.amount;
      });

      const pieData = Object.entries(categoryMap).map(([name, value]) => ({
        name,
        value,
      }));
      setCategoryData(pieData);

      if (pieData.length > 0) {
        const top = pieData.reduce(
          (max, item) => (item.value > max.value ? item : max),
          pieData[0]
        );
        setTopCategory(top.name);
      }

      const lineData = Object.entries(dateMap).map(([date, amount]) => ({
        date,
        amount,
      }));
      setLineChartData(lineData);
    } catch (err) {
      console.log("Dashboard fetch error:", err.message);
    }
  };

  return (
    <div
      style={{
        padding: "2rem",
        color: "#fff",
        background: "#111",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>📊 Reports Dashboard</h2>
        <button
          onClick={() => navigate("/home")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#0d6efd",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          ← Back to Home
        </button>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h4>Total Spent This Month: ₹{totalSpent}</h4>
        <h4>Most Spent Category: {topCategory || "N/A"}</h4>
        <h4>💡 Smart Suggestions:</h4>
        <ul>
          {suggestions.length > 0 ? (
            suggestions.map((s, i) => <li key={i}>👉 {s}</li>)
          ) : (
            <li>No suggestions yet</li>
          )}
        </ul>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          marginTop: "2rem",
          gap: "2rem",
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: "300px",
            background: "#222",
            padding: "1rem",
            borderRadius: "10px",
          }}
        >
          <h5>Category-wise Spending</h5>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>No spending data</p>
          )}
        </div>

        <div
          style={{
            flex: 2,
            minWidth: "300px",
            background: "#222",
            padding: "1rem",
            borderRadius: "10px",
          }}
        >
          <h5>Spending Over Time</h5>
          {lineChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p>No line chart data</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
