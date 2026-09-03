from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class Guardrails(BaseModel):
    max_discount_amount: float = 500.0
    max_intervention_cost: float = 25.0
    max_touches_per_48h: int = 2
    quiet_hours_start: int = 21  # 9 PM
    quiet_hours_end: int = 8    # 8 AM
    daily_budget_cap: float = 10000.0
    allowed_actions: List[str] = ["PAYMENT_LINK", "REMINDER", "RETRY", "ESCALATION", "DISCOUNT"]

class TransactionEvent(BaseModel):
    id: str
    order_id: str
    customer_id: str
    customer_name: str
    customer_email: str
    customer_phone: str
    amount: float
    category: str # "PAYMENT_FAILURE", "CHECKOUT_ABANDONMENT", "OVERDUE_RECEIVABLE"
    payment_method: str # "CREDIT_CARD", "DEBIT_CARD", "UPI", "BOLETO", "INVOICE"
    failure_reason: str
    attempt_count: int = 1
    timestamp: str
    age_minutes: int
    customer_ltv: float
    customer_succ_txs: int
    customer_avg_delay_hours: float
    status: str = "READY" # "READY", "WAIT", "BLOCKED", "RECOVERED", "FAILED"

class ActionEvaluation(BaseModel):
    action: str # "WAIT", "PAYMENT_LINK", "REMINDER", "DISCOUNT", "RETRY", "ESCALATION"
    display_name: str
    recovery_probability: float
    expected_gross_recovery: float
    direct_cost: float
    margin_cost: float
    expected_net_value: float
    is_optimal: bool = False
    policy_allowed: bool = True
    block_reason: Optional[str] = None

class DecisionResult(BaseModel):
    event_id: str
    order_id: str
    amount: float
    natural_recovery_prob: float
    recommended_action: str
    expected_net_value: float
    incremental_value_over_wait: float
    confidence_score: float
    rationale: str
    actions_evaluated: List[ActionEvaluation]
    timestamp: str

class AuditLogItem(BaseModel):
    id: str
    timestamp: str
    event_type: str
    entity_id: str
    customer_name: str
    action_taken: str
    reason: str
    policy_check: str
    expected_net_value: float
    actual_outcome: str
    actual_recovered_amount: float
    intervention_cost: float
    status: str

class SimulationRequest(BaseModel):
    baseline_policy: str = "ALWAYS_RETRY"
    candidate_policy: str = "EINRV_RADAR"
    max_discount: float = 500.0
    max_touches: int = 2
    nudge_cost: float = 4.0

class SimulationResult(BaseModel):
    total_cases: int
    baseline_recovery_rate: float
    radar_recovery_rate: float
    baseline_gross_recovered: float
    radar_gross_recovered: float
    baseline_costs: float
    radar_costs: float
    baseline_discounts: float
    radar_discounts: float
    baseline_net: float
    radar_net: float
    net_gain: float
    net_gain_pct: float
    time_series: List[Dict[str, Any]]
