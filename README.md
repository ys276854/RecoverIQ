# 📡 Razorpay Revenue Leak Radar

> **Autonomous Merchant Revenue Intelligence & Algorithmic Recovery Engine**  
> *Built for the Razorpay Hackathon*

---

## 🌐 Live Production Links

- **Frontend SPA (Vercel)**: [https://frontend-eight-kohl-qac6wxkpdu.vercel.app](https://frontend-eight-kohl-qac6wxkpdu.vercel.app)
- **Backend API (Render)**: [https://leakradar-backend.onrender.com](https://leakradar-backend.onrender.com)
- **GitHub Repository**: [ys276854/razorpay-revenue-leak-radar](https://github.com/ys276854/razorpay-revenue-leak-radar)

---

## 💡 The Core Problem & Innovation

Standard recovery solutions rely on **blind, rule-based retries and mass notifications** (SMS, WhatsApp, emails with discounts). These naive strategies suffer from three major flaws:
1. **Margin Decay**: Offering discounts to customers who would have naturally completed their purchase without an incentive.
2. **Cost Waste**: Spending notification fees on zero-probability or low-margin recovery cases.
3. **Customer Fatigue**: Spamming high-LTV customers with excessive retries, driving brand churn.

**Razorpay Revenue Leak Radar** replaces static rules with an **Expected Incremental Net Recovery Value ($EINRV$) Engine**:

$$ EINRV(a, c) = V_{\text{order}} \times [P_{nat}(c) + \Delta P_a(c)] - \text{DirectCost}(a) - \text{MarginCost}(a) $$

By predicting organic natural recovery probabilities $P_{nat}(c)$ and incremental treatment lifts $\Delta P_a(c)$, the engine calculates the net economic yield of every candidate intervention and enforces merchant guardrails in real time.

---

## 🔑 Synthetic Demo Credentials

To test the live dashboard, use the 1-click **"⚡ Log In as Demo Merchant"** button on the login screen, or enter:
- **Email**: `demo@acmecommerce.in`
- **Password**: `demo123`

---

## 🖥️ Quick Start (Local Setup)

### 1. Backend Setup (FastAPI & Python 3.11)
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
Backend will run at: `http://localhost:8000`

### 2. Frontend Setup (React 18 & Vite 5)
```bash
cd frontend
npm install
npm run dev
```
Frontend will run at: `http://localhost:5173`

---

## 🛡️ Hackathon Security & Synthetic Data Disclosure

- **API Keys**: All API keys used in default configurations are synthetic test keys (`rzp_test_mockkey12345`).
- **Customer & Transaction Data**: All customer profiles, emails, phone numbers, and order timelines are synthetic test data generated for demo evaluation.
- **Evaluation Provenance**: Benchmark comparison metrics (e.g. +28.5% Net Recovery Lift) represent controlled offline counterfactual evaluation results backtested on held-out test sets from the Olist E-Commerce and Hillstrom RCT datasets; they are not claimed as live Razorpay production merchant volume.
