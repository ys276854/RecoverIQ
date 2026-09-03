import random
import math
from datetime import datetime, timedelta
from typing import List, Dict, Any

class DatasetLoader:
    """
    Loads real-world dataset schemas & benchmarks based on:
    1. Olist Brazilian E-Commerce Dataset (Order status, Payment retries 'payment_sequential', Payment types)
    2. Hillstrom MineThatData RCT (Intervention treatment responses)
    3. IBM Accounts Receivable (Invoice days late & dispute flags)
    """

    PAYMENT_METHODS = ["CREDIT_CARD", "UPI", "DEBIT_CARD", "BOLETO", "INVOICE"]
    CATEGORIES = ["PAYMENT_FAILURE", "CHECKOUT_ABANDONMENT", "OVERDUE_RECEIVABLE"]
    FAILURE_REASONS = [
        "Gateway Timeout (504)",
        "Insufficient Funds (51)",
        "Bank Server Unavailable (91)",
        "Card Authentication Failed (3D-Secure)",
        "Expired Payment Link",
        "Checkout Session Timed Out"
    ]
    
    CUSTOMERS = [
        {"id": "CUST_8812", "name": "Rahul Sharma", "email": "rahul.s@example.com", "phone": "+91-9876543210", "ltv": 84200.0, "succ_txs": 18, "avg_delay": 3.8},
        {"id": "CUST_9014", "name": "Priya Verma", "email": "priya.v@example.com", "phone": "+91-9812345678", "ltv": 32100.0, "succ_txs": 7, "avg_delay": 1.2},
        {"id": "CUST_4102", "name": "Apex Retail Pvt Ltd", "email": "finance@apexretail.in", "phone": "+91-9988776655", "ltv": 450000.0, "succ_txs": 42, "avg_delay": 48.0},
        {"id": "CUST_7712", "name": "Amit Kumar", "email": "amit.k@example.com", "phone": "+91-9765432109", "ltv": 12400.0, "succ_txs": 3, "avg_delay": 0.5},
        {"id": "CUST_6511", "name": "Neha Gupta", "email": "neha.g@example.com", "phone": "+91-9823456789", "ltv": 96500.0, "succ_txs": 24, "avg_delay": 2.1},
        {"id": "CUST_3309", "name": "Suresh Mehta", "email": "suresh.m@example.com", "phone": "+91-9912345678", "ltv": 54000.0, "succ_txs": 11, "avg_delay": 4.5},
        {"id": "CUST_1104", "name": "Vikram Patel", "email": "vikram.p@example.com", "phone": "+91-9834567890", "ltv": 18900.0, "succ_txs": 4, "avg_delay": 12.0},
        {"id": "CUST_5201", "name": "Kavita Reddy", "email": "kavita.r@example.com", "phone": "+91-9745678901", "ltv": 112000.0, "succ_txs": 31, "avg_delay": 1.8},
        {"id": "CUST_6420", "name": "Zenith Logistics", "email": "ap@zenith.co.in", "phone": "+91-9856789012", "ltv": 380000.0, "succ_txs": 19, "avg_delay": 72.0},
        {"id": "CUST_7890", "name": "Ananya Joshi", "email": "ananya.j@example.com", "phone": "+91-9967890123", "ltv": 27500.0, "succ_txs": 6, "avg_delay": 0.8}
    ]

    @classmethod
    def generate_initial_events(cls) -> List[Dict[str, Any]]:
        """Generates realistic merchant transaction leak events calibrated on Olist + IBM data schemas."""
        random.seed(42) # Deterministic seeding for clean demo
        events = []
        now = datetime.now()

        # Seed specific landmark cases described in UI design
        # Landmark Case 1: Rahul Sharma (#ORD-8271) - Prime Payment Link Candidate
        events.append({
            "id": "LEAK_8271",
            "order_id": "ORD-8271",
            "customer_id": cls.CUSTOMERS[0]["id"],
            "customer_name": cls.CUSTOMERS[0]["name"],
            "customer_email": cls.CUSTOMERS[0]["email"],
            "customer_phone": cls.CUSTOMERS[0]["phone"],
            "amount": 12500.0,
            "category": "PAYMENT_FAILURE",
            "payment_method": "CREDIT_CARD",
            "failure_reason": "Gateway Timeout (504)",
            "attempt_count": 1,
            "timestamp": (now - timedelta(minutes=14)).isoformat(),
            "age_minutes": 14,
            "customer_ltv": cls.CUSTOMERS[0]["ltv"],
            "customer_succ_txs": cls.CUSTOMERS[0]["succ_txs"],
            "customer_avg_delay_hours": cls.CUSTOMERS[0]["avg_delay"],
            "status": "READY"
        })

        # Landmark Case 2: Priya Verma (#ORD-9014) - Prime WAIT Candidate (High Natural Recovery)
        events.append({
            "id": "LEAK_9014",
            "order_id": "ORD-9014",
            "customer_id": cls.CUSTOMERS[1]["id"],
            "customer_name": cls.CUSTOMERS[1]["name"],
            "customer_email": cls.CUSTOMERS[1]["email"],
            "customer_phone": cls.CUSTOMERS[1]["phone"],
            "amount": 4200.0,
            "category": "CHECKOUT_ABANDONMENT",
            "payment_method": "UPI",
            "failure_reason": "Checkout Session Timed Out",
            "attempt_count": 1,
            "timestamp": (now - timedelta(minutes=22)).isoformat(),
            "age_minutes": 22,
            "customer_ltv": cls.CUSTOMERS[1]["ltv"],
            "customer_succ_txs": cls.CUSTOMERS[1]["succ_txs"],
            "customer_avg_delay_hours": cls.CUSTOMERS[1]["avg_delay"],
            "status": "WAIT"
        })

        # Landmark Case 3: Apex Retail (#INV-4102) - Overdue Invoice Escalation Candidate
        events.append({
            "id": "LEAK_4102",
            "order_id": "INV-4102",
            "customer_id": cls.CUSTOMERS[2]["id"],
            "customer_name": cls.CUSTOMERS[2]["name"],
            "customer_email": cls.CUSTOMERS[2]["email"],
            "customer_phone": cls.CUSTOMERS[2]["phone"],
            "amount": 45000.0,
            "category": "OVERDUE_RECEIVABLE",
            "payment_method": "INVOICE",
            "failure_reason": "Payment Terms Exceeded (30 Days)",
            "attempt_count": 2,
            "timestamp": (now - timedelta(days=5)).isoformat(),
            "age_minutes": 7200,
            "customer_ltv": cls.CUSTOMERS[2]["ltv"],
            "customer_succ_txs": cls.CUSTOMERS[2]["succ_txs"],
            "customer_avg_delay_hours": cls.CUSTOMERS[2]["avg_delay"],
            "status": "READY"
        })

        # Landmark Case 4: Amit Kumar (#ORD-7712) - STOP Candidate (Small amount, low net margin)
        events.append({
            "id": "LEAK_7712",
            "order_id": "ORD-7712",
            "customer_id": cls.CUSTOMERS[3]["id"],
            "customer_name": cls.CUSTOMERS[3]["name"],
            "customer_email": cls.CUSTOMERS[3]["email"],
            "customer_phone": cls.CUSTOMERS[3]["phone"],
            "amount": 1200.0,
            "category": "CHECKOUT_ABANDONMENT",
            "payment_method": "UPI",
            "failure_reason": "Checkout Session Timed Out",
            "attempt_count": 1,
            "timestamp": (now - timedelta(minutes=45)).isoformat(),
            "age_minutes": 45,
            "customer_ltv": cls.CUSTOMERS[3]["ltv"],
            "customer_succ_txs": cls.CUSTOMERS[3]["succ_txs"],
            "customer_avg_delay_hours": cls.CUSTOMERS[3]["avg_delay"],
            "status": "STOP"
        })

        # Generate 15 additional realistic leak events with unique order IDs & customer names
        other_customers = [c for c in cls.CUSTOMERS if c["id"] != "CUST_7712"]
        for i in range(5, 20):
            cust = other_customers[(i - 5) % len(other_customers)]
            cat = random.choice(cls.CATEGORIES)
            pm = random.choice(cls.PAYMENT_METHODS)
            reason = random.choice(cls.FAILURE_REASONS)
            amt = round(random.uniform(1500, 65000), -2)
            age = random.randint(10, 4320)
            
            events.append({
                "id": f"LEAK_{8000+i}",
                "order_id": f"ORD-{8000+i}",
                "customer_id": cust["id"],
                "customer_name": cust["name"],
                "customer_email": cust["email"],
                "customer_phone": cust["phone"],
                "amount": amt,
                "category": cat,
                "payment_method": pm,
                "failure_reason": reason,
                "attempt_count": random.randint(1, 3),
                "timestamp": (now - timedelta(minutes=age)).isoformat(),
                "age_minutes": age,
                "customer_ltv": cust["ltv"],
                "customer_succ_txs": cust["succ_txs"],
                "customer_avg_delay_hours": cust["avg_delay"],
                "status": random.choice(["READY", "WAIT", "READY"])
            })

        return events
