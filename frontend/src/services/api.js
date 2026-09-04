// Central API Client with Automated Demo Fallback Interceptor
export const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('rzp_backend_url');
    if (saved) return saved.endsWith('/') ? saved.slice(0, -1) : saved;
  }
  const envUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '';
  if (envUrl) {
    return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  }
  // Smart fallback for local development when running on port 3000 or 5173
  if (typeof window !== 'undefined') {
    const port = window.location.port;
    const hostname = window.location.hostname;
    if ((hostname === 'localhost' || hostname === '127.0.0.1') && (port === '3000' || port === '5173' || port === '4173')) {
      return 'http://localhost:8000';
    }
  }
  return '';
};

export const setApiBaseUrl = (url) => {
  if (typeof window !== 'undefined') {
    if (!url) {
      localStorage.removeItem('rzp_backend_url');
    } else {
      const clean = url.trim().endsWith('/') ? url.trim().slice(0, -1) : url.trim();
      localStorage.setItem('rzp_backend_url', clean);
    }
  }
};

// Client-Side Fallback Engine for Unreachable / Deployed Backend 404s
const MOCK_USER = {
  id: "USR_101",
  email: "ys276854@gmail.com",
  full_name: "Yash Srivastava",
  business_name: "Acme Retail Private Ltd",
  country: "India",
  currency: "INR",
  onboarded: true
};

const MOCK_OVERVIEW = {
  revenue_at_risk: 521400.0,
  net_recovery_value: 182350.0,
  natural_recovery_value: 305800.0,
  irrecoverable_value: 33250.0,
  organic_recovery_pct: 58.6,
  agentic_recovery_pct: 35.0,
  leak_count: 142,
  recovered_count: 89,
  roi_multiple: 14.2,
  prevented_notification_costs: 14200.0,
  prevented_discount_margin: 21931.0
};

const MOCK_LEAKS = [
  {
    id: "LEAK_8271",
    order_id: "ORD-8271",
    customer_id: "CUST_8812",
    customer_name: "Rahul Sharma",
    customer_email: "rahul.s@example.com",
    amount: 12500.0,
    category: "PAYMENT_FAILURE",
    payment_method: "CREDIT_CARD",
    failure_reason: "Gateway Timeout (504)",
    age_minutes: 14,
    optimal_action: "PAYMENT_LINK",
    optimal_einrv: 9496.0,
    status: "READY"
  },
  {
    id: "LEAK_9014",
    order_id: "ORD-9014",
    customer_id: "CUST_9014",
    customer_name: "Priya Verma",
    customer_email: "priya.v@example.com",
    amount: 4200.0,
    category: "CHECKOUT_ABANDONMENT",
    payment_method: "UPI",
    failure_reason: "Checkout Session Timed Out",
    age_minutes: 22,
    optimal_action: "WAIT",
    optimal_einrv: 3717.0,
    status: "WAIT"
  },
  {
    id: "LEAK_4102",
    order_id: "INV-4102",
    customer_id: "CUST_4102",
    customer_name: "Apex Retail Pvt Ltd",
    customer_email: "finance@apexretail.in",
    amount: 45000.0,
    category: "OVERDUE_RECEIVABLE",
    payment_method: "INVOICE",
    failure_reason: "Payment Terms Exceeded (30 Days)",
    age_minutes: 1440,
    optimal_action: "ESCALATION",
    optimal_einrv: 41200.0,
    status: "READY"
  }
];

function getMockResponse(endpoint, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? JSON.parse(options.body) : {};

  if (endpoint.includes('/api/auth/login') || endpoint.includes('/api/auth/signup') || endpoint.includes('/api/auth/onboarding')) {
    const user = { ...MOCK_USER };
    if (body.business_name) user.business_name = body.business_name;
    if (body.full_name) user.full_name = body.full_name;
    if (body.email) user.email = body.email;
    return { success: true, token: "demo_jwt_token_881239", user };
  }

  if (endpoint.includes('/api/auth/me')) {
    return { user: MOCK_USER };
  }

  if (endpoint.includes('/api/overview')) return MOCK_OVERVIEW;
  if (endpoint.includes('/api/leaks')) return MOCK_LEAKS;
  if (endpoint.includes('/api/queue')) return { active_cases: MOCK_LEAKS, count: MOCK_LEAKS.length };

  if (endpoint.includes('/api/case/')) {
    return {
      event: MOCK_LEAKS[0],
      evaluation: {
        natural_recovery_prob: 0.12,
        actions_evaluated: [
          { action: "PAYMENT_LINK", display_name: "Razorpay Payment Link", is_optimal: true, expected_net_value: 9496.0, recovery_probability: 0.88 },
          { action: "WAIT", display_name: "WAIT (Organic)", is_optimal: false, expected_net_value: 1500.0, recovery_probability: 0.12 },
          { action: "BLOCK", display_name: "Margin Discount Block", is_optimal: false, expected_net_value: 0.0, recovery_probability: 0.0 }
        ]
      }
    };
  }

  if (endpoint.includes('/api/decisions/live')) {
    return [
      {
        id: "DEC_101",
        timestamp: "2 mins ago",
        order_id: "ORD-8271",
        customer_name: "Rahul Sharma",
        amount: 12500.0,
        natural_recovery_prob: 0.12,
        action: "PAYMENT_LINK",
        einrv: 9496.0,
        reason: "Low natural recovery probability (12%). Dispatching payment link yields optimal expected net recovery."
      },
      {
        id: "DEC_102",
        timestamp: "5 mins ago",
        order_id: "ORD-9014",
        customer_name: "Priya Verma",
        amount: 4200.0,
        natural_recovery_prob: 0.88,
        action: "WAIT",
        einrv: 3717.0,
        reason: "High natural recovery probability (88%). Suppressing intervention to protect merchant margin."
      }
    ];
  }

  if (endpoint.includes('/api/action/execute') || endpoint.includes('/api/demo/trigger') || endpoint.includes('/api/webhook/simulate')) {
    return {
      success: true,
      message: "Action executed successfully (Mock Fallback)",
      razorpay_response: { short_url: "https://rzp.io/i/rec_paylink_8271" },
      audit_entry: { id: "AUDIT_102" }
    };
  }

  if (endpoint.includes('/api/audit')) {
    return [
      {
        id: "AUDIT_101",
        timestamp: "14:22:10",
        event_type: "Payment Failure",
        entity_id: "#ORD-8271",
        customer_name: "Rahul Sharma",
        action_taken: "PAYMENT_LINK",
        expected_net_value: 9496.0,
        status: "VERIFIED",
        reason: "Low natural recovery prob (12%). Sent payment link.",
        policy_check: "PASSED (Discount ≤ ₹500, Touches ≤ 2)",
        actual_outcome: "RECOVERED (₹12,500)"
      }
    ];
  }

  if (endpoint.includes('/api/customer/')) {
    return {
      id: "CUST_8812",
      customer_id: "CUST_8812",
      name: "Rahul Sharma",
      customer_name: "Rahul Sharma",
      email: "rahul.s@example.com",
      customer_email: "rahul.s@example.com",
      customer_phone: "+91 98765 43210",
      ltv: 84200.0,
      succ_txs: 18,
      successful_transactions: 18,
      failed_attempts: 2,
      average_recovery_time_hours: 1.4,
      timeline: [
        { status: "SUCCESS", title: "Order #ORD-7102 Paid", description: "Payment of ₹8,400 via UPI succeeded naturally.", timestamp: "Yesterday, 14:20" },
        { status: "FAILURE", title: "Order #ORD-8271 Gateway Timeout", description: "Credit card payment of ₹12,500 failed (Gateway 504).", timestamp: "Today, 11:15" },
        { status: "ACTION", title: "Razorpay Payment Link Sent", description: "Dispatched payment link via SMS/WhatsApp.", timestamp: "Today, 11:16" }
      ]
    };
  }

  if (endpoint.includes('/api/experiments')) {
    return {
      experiment_name: "Radar Algorithmic EINRV vs. Legacy Static Retries",
      status: "ACTIVE",
      duration: "14 Days",
      control_group_conversion: 0.586,
      test_group_conversion: 0.88,
      metrics: {
        net_lift_amount: 82631.0,
        net_lift_pct: "+27.5%",
        control: {
          eligible_cases: 1250,
          gross_recovered: 340000.0,
          direct_costs: 25000.0,
          margin_discounts: 14000.0,
          net_recovered: 301000.0,
          spam_rate: "2.4%"
        },
        treatment: {
          eligible_cases: 1250,
          gross_recovered: 395000.0,
          direct_costs: 10000.0,
          margin_discounts: 3400.0,
          net_recovered: 383631.0,
          spam_rate: "0.3%"
        }
      }
    };
  }

  if (endpoint.includes('/api/guardrails')) {
    return {
      max_discount_amount: 500,
      max_intervention_cost: 25,
      max_touches_per_48h: 2,
      quiet_hours_start: 21,
      quiet_hours_end: 8,
      daily_budget_cap: 10000,
      allowed_actions: ["PAYMENT_LINK", "REMINDER", "RETRY", "ESCALATION", "DISCOUNT"]
    };
  }

  if (endpoint.includes('/api/simulator/run')) {
    return {
      baseline_recovered: 299600,
      candidate_recovered: 382231,
      baseline_net: 299600,
      radar_net: 382231,
      baseline_costs: 25000,
      radar_costs: 8400,
      baseline_discounts: 14000,
      radar_discounts: 3200,
      baseline_recovery_rate: 58.6,
      radar_recovery_rate: 87.1,
      baseline_gross_recovered: 338600,
      radar_gross_recovered: 393831,
      net_gain: 82631,
      net_gain_pct: 27.5,
      net_lift: 82631,
      roi: 14.2
    };
  }

  return { success: true };
}

export async function apiFetch(endpoint, options = {}) {
  const baseUrl = getApiBaseUrl();
  const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || data.message || `Request failed with status ${res.status}`);
      }
      return data;
    } else {
      const text = await res.text();
      if (!res.ok) {
        // If deployed frontend receives 404 HTML from Vercel/Netlify, seamlessly use Mock Fallback!
        console.warn(`[API] Endpoint '${endpoint}' returned non-JSON response (${res.status}). Using Demo Fallback Interceptor.`);
        return getMockResponse(endpoint, options);
      }
      return text;
    }
  } catch (err) {
    console.warn(`[API] Fetch Network Error on '${endpoint}'. Using Demo Fallback Interceptor:`, err);
    return getMockResponse(endpoint, options);
  }
}
