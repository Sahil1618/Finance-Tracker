from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from datetime import datetime, timedelta, timezone
import sqlite3
import json
import os

app = Flask(__name__)
CORS(app)

# 📦 DB Setup
def init_db():
    db_path = os.path.abspath('reports.db')
    print(f"📂 Creating/Using DB at: {db_path}")
    conn = sqlite3.connect('reports.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS monthly_reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId TEXT,
            month TEXT,
            totalSpent REAL,
            topCategory TEXT,
            overbudgetCategories TEXT,
            createdAt TEXT
        )
    ''')
    conn.commit()
    conn.close()
    print("✅ reports.db initialized and ready")

init_db()

# 🧠 Analyzer Route
@app.route('/analyze', methods=['POST'])
def analyze_expenses():
    try:
        data = request.get_json()
        if not data or 'transactions' not in data:
            return jsonify({"error": "Missing transaction data"}), 400

        transactions = data['transactions']
        user_id = data.get('userId', 'unknown')

        print(f"📥 Received {len(transactions)} transactions for user {user_id}")

        # Convert to DataFrame
        df = pd.DataFrame(transactions)
        df['date'] = pd.to_datetime(df['date'], errors='coerce')
        df['amount'] = pd.to_numeric(df['amount'], errors='coerce')
        df = df[df['transactionType'] == 'expense'].dropna(subset=['date', 'amount'])

        today = datetime.now(timezone.utc)
        last_30_days = today - timedelta(days=30)
        current_month = today.strftime('%Y-%m')

        recent_expenses = df[df['date'] >= last_30_days]

        suggestions = []
        category_group = recent_expenses.groupby('category')['amount'].sum().sort_values(ascending=False)

        # 💡 Suggestions
        overbudget = []
        for category, amount in category_group.items():
            if amount > 10000:
                suggestions.append(f"You're spending a lot on {category}. Try reducing it by 15%.")
                overbudget.append(category)

        prev_30_days = df[(df['date'] < last_30_days) & (df['date'] >= last_30_days - timedelta(days=30))]
        prev_group = prev_30_days.groupby('category')['amount'].sum()

        for category in category_group.index:
            recent_amt = category_group.get(category, 0)
            prev_amt = prev_group.get(category, 0)
            if prev_amt > 0 and recent_amt > prev_amt * 1.5:
                suggestions.append(f"Your {category} expenses increased a lot this month.")
                if category not in overbudget:
                    overbudget.append(category)

        if not suggestions:
            suggestions.append("You're doing well! No major spikes in spending detected.")

        # 💾 Save to SQLite
        total_spent = recent_expenses['amount'].sum()
        top_category = category_group.idxmax() if not category_group.empty else "N/A"
        overbudget_json = json.dumps(overbudget)

        conn = sqlite3.connect('reports.db')
        c = conn.cursor()
        c.execute('''
            INSERT INTO monthly_reports (userId, month, totalSpent, topCategory, overbudgetCategories, createdAt)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (user_id, current_month, total_spent, top_category, overbudget_json, today.isoformat()))
        conn.commit()
        conn.close()

        print(f"✅ Monthly report saved for {user_id} ({current_month})")

        return jsonify({"success": True, "suggestions": suggestions})

    except Exception as e:
        print("❌ Error:", str(e))
        return jsonify({"success": False, "error": str(e)}), 500


# 📊 View last 3 reports
@app.route('/last-3-reports/<user_id>', methods=['GET'])
def last_3_reports(user_id):
    try:
        conn = sqlite3.connect('reports.db')
        c = conn.cursor()
        c.execute('''
            SELECT month, totalSpent, topCategory, overbudgetCategories, createdAt
            FROM monthly_reports
            WHERE userId = ?
            ORDER BY createdAt DESC
            LIMIT 3
        ''', (user_id,))
        rows = c.fetchall()
        conn.close()

        reports = [{
            "month": row[0],
            "totalSpent": row[1],
            "topCategory": row[2],
            "overbudgetCategories": json.loads(row[3]),
            "createdAt": row[4]
        } for row in rows]

        return jsonify({"success": True, "reports": reports})

    except Exception as e:
        print("❌ Error fetching reports:", str(e))
        return jsonify({"success": False, "error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=5001)
