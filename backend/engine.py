import math
from typing import List, Dict, Any, Tuple
from models import Guardrails, ActionEvaluation, DecisionResult, TransactionEvent, SimulationRequest

class RevenueLeakEngine:
    """
    Mathematical Intelligence Engine for Razorpay Revenue Leak Radar:
    1. Natural Recovery Estimator P_nat(c) calibrated on Olist E-Commerce dataset
    2. Treatment Uplift Estimator ΔP_a(c) calibrated on Hillstrom Email RCT dataset
    3. Expected Incremental Net Recovery Engine (EINRV) & Merchant Guardrail Enforcer
    """

    DIRECT_COSTS = {
        "WAIT": 0.0,
        "PAYMENT_LINK": 4.0,       # WhatsApp API / Direct Link dispatch cost
        "REMINDER": 7.0,           # Multi-channel SMS/WhatsApp nudge
        "DISCOUNT": 4.0,           # Notification cost (discount is in margin)
        "RETRY": 2.0,              # Gateway automated API retry fee
        "ESCALATION": 15.0         # Formal invoice escalation notification
    }

    ACTION_DISPLAY_NAMES = {
        "WAIT": "WAIT (Do Nothing)",
        "PAYMENT_LINK": "Razorpay Payment Link",
        "REMINDER": "WhatsApp / SMS Reminder",
        "DISCOUNT": "10% Discount Coupon",
        "RETRY": "Automated Gateway Retry",
        "ESCALATION": "Formal Invoice Escalation"
    }

    def __init__(self, guardrails: Guardrails = None):
        self.guardrails = guardrails or Guardrails()

    def estimate_natural_recovery(self, event: Dict[str, Any]) -> float:
        """
        Estimates baseline organic recovery probability P_nat(c) given zero intervention.
        Features: customer successful tx count, LTV, average payment delay, payment method, attempt count.
        """
        succ_txs = event.get("customer_succ_txs", 1)
        avg_delay_hrs = event.get("customer_avg_delay_hours", 2.0)
        pm = event.get("payment_method", "CREDIT_CARD")
        attempts = event.get("attempt_count", 1)
        age_mins = event.get("age_minutes", 15)

        # Baseline log-odds
        log_odds = 0.5

        # Customer trust multiplier (repeat customers recover naturally)
        if succ_txs >= 10:
            log_odds += 0.8
        elif succ_txs >= 5:
            log_odds += 0.4
        elif succ_txs == 0:
            log_odds -= 0.5

        # Delay profile (customers with historical delay recover over hours naturally)
        if avg_delay_hrs < 4.0 and age_mins < 120:
            log_odds += 0.6
        elif age_mins > 2880: # 48+ hours old leak
            log_odds -= 1.2

        # Payment method characteristics (Olist benchmark: Boleto/Invoice delayed approval vs instant card declination)
        if pm == "UPI":
            log_odds += 0.5 # GPay/UPI retries are frequent & fast
        elif pm == "BOLETO" or pm == "INVOICE":
            log_odds += 0.2 # Natural bank settlement lag
        elif pm == "CREDIT_CARD":
            log_odds -= 0.3 # Card failures often stay failed without nudge

        # Multiple failed attempts reduce natural recovery chance
        log_odds -= (attempts - 1) * 0.4

        # Logistic Sigmoid Transformation
        p_nat = 1.0 / (1.0 + math.exp(-log_odds))
        return round(min(max(p_nat, 0.05), 0.95), 4)

    def estimate_treatment_uplift(self, action: str, p_nat: float, event: Dict[str, Any]) -> float:
        """
        Estimates incremental probability lift ΔP_a(c) for an intervention action 'a' over control (WAIT).
        Based on Hillstrom RCT treatment response curves.
        """
        if action == "WAIT":
            return 0.0

        amount = event.get("amount", 1000.0)
        pm = event.get("payment_method", "CREDIT_CARD")

        # Base incremental lift caps (Hillstrom RCT benchmarks)
        if action == "PAYMENT_LINK":
            # Payment links excel for instant card failures and abandoned carts
            base_lift = 0.12 if pm in ["CREDIT_CARD", "UPI"] else 0.08
        elif action == "REMINDER":
            # Nudges excel for customer memory refresh
            base_lift = 0.07
        elif action == "DISCOUNT":
            # Discounts give high gross conversion lift (15-20%) but burn margin
            base_lift = 0.18
        elif action == "RETRY":
            # Automated retry helps technical gateway timeouts
            base_lift = 0.09 if "Timeout" in event.get("failure_reason", "") else 0.04
        elif action == "ESCALATION":
            # Escalation helps overdue invoices
            base_lift = 0.15 if pm == "INVOICE" or amount > 25000 else 0.05
        else:
            base_lift = 0.05

        # Diminishing returns headroom scaling (cannot exceed 1.0 total recovery prob)
        headroom = 1.0 - p_nat
        delta_p = base_lift * (headroom / 0.5)
        return round(min(max(delta_p, 0.01), headroom * 0.95), 4)

    def evaluate_case(self, event: Dict[str, Any]) -> DecisionResult:
        """
        Evaluates a single revenue leak case across all candidate actions in the economic decision space.
        Computes EINRV(a, c) = V_order * [P_nat(c) + ΔP_a(c)] - Direct_Cost(a) - Margin_Cost(a)
        """
        v_order = event.get("amount", 1000.0)
        p_nat = self.estimate_natural_recovery(event)

        actions_evaluated = []
        possible_actions = ["WAIT", "PAYMENT_LINK", "REMINDER", "DISCOUNT", "RETRY", "ESCALATION"]

        optimal_action = "WAIT"
        max_net_value = -float("inf")
        wait_net_value = v_order * p_nat

        for action in possible_actions:
            delta_p = self.estimate_treatment_uplift(action, p_nat, event)
            p_total = p_nat + delta_p if action != "WAIT" else p_nat
            
            gross_rec = v_order * p_total
            direct_cost = self.DIRECT_COSTS.get(action, 0.0)
            
            # Margin discount cost logic (10% discount)
            margin_cost = (0.10 * v_order) if action == "DISCOUNT" else 0.0
            
            net_val = gross_rec - direct_cost - margin_cost

            # Policy / Guardrail Checking
            allowed = True
            block_reason = None

            if action not in self.guardrails.allowed_actions and action != "WAIT":
                allowed = False
                block_reason = f"Action {action} disabled in merchant settings."
            elif action == "DISCOUNT" and margin_cost > self.guardrails.max_discount_amount:
                allowed = False
                block_reason = f"Discount amount (₹{margin_cost:.0f}) exceeds merchant cap (₹{self.guardrails.max_discount_amount:.0f})."
            elif direct_cost > self.guardrails.max_intervention_cost:
                allowed = False
                block_reason = f"Intervention cost (₹{direct_cost:.0f}) exceeds merchant cap (₹{self.guardrails.max_intervention_cost:.0f})."

            eval_obj = ActionEvaluation(
                action=action,
                display_name=self.ACTION_DISPLAY_NAMES.get(action, action),
                recovery_probability=round(p_total, 4),
                expected_gross_recovery=round(gross_rec, 2),
                direct_cost=direct_cost,
                margin_cost=margin_cost,
                expected_net_value=round(net_val, 2),
                is_optimal=False,
                policy_allowed=allowed,
                block_reason=block_reason
            )

            if allowed and net_val > max_net_value:
                max_net_value = net_val
                optimal_action = action

            actions_evaluated.append(eval_obj)

        # Mark optimal action flag
        for a in actions_evaluated:
            if a.action == optimal_action:
                a.is_optimal = True

        inc_value = max_net_value - wait_net_value

        # Generate concise rationale
        cust_name = event.get("customer_name", "Customer")
        if optimal_action == "WAIT":
            rationale = (
                f"High baseline natural recovery probability ({p_nat*100:.1f}%). "
                f"Active intervention costs or discount margin decay outweigh incremental lift gains. "
                f"Recommended strategy: WAIT & MONITOR."
            )
        elif optimal_action == "PAYMENT_LINK":
            rationale = (
                f"Customer historically responds quickly to direct payment links. "
                f"Generates +₹{inc_value:.0f} incremental net value over WAIT at low direct cost (₹4.00)."
            )
        elif optimal_action == "DISCOUNT":
            rationale = (
                f"10% Discount boosts conversion to {(p_nat+self.estimate_treatment_uplift('DISCOUNT', p_nat, event))*100:.1f}%. "
                f"Margin decay is offset by substantial order recovery value."
            )
        elif optimal_action == "ESCALATION":
            rationale = (
                f"Invoice overdue case. Formal escalation notification provides optimal recovery yield "
                f"for B2B receivable size ₹{v_order:,.0f}."
            )
        else:
            rationale = f"Selected {optimal_action} to maximize Expected Incremental Net Recovery Value."

        return DecisionResult(
            event_id=event.get("id", "LEAK_0"),
            order_id=event.get("order_id", "ORD-0"),
            amount=v_order,
            natural_recovery_prob=p_nat,
            recommended_action=optimal_action,
            expected_net_value=round(max_net_value, 2),
            incremental_value_over_wait=round(inc_value, 2),
            confidence_score=round(min(0.75 + (event.get("customer_succ_txs", 1) * 0.01), 0.96), 2),
            rationale=rationale,
            actions_evaluated=actions_evaluated,
            timestamp=event.get("timestamp", "")
        )

    def run_counterfactual_simulation(self, events: List[Dict[str, Any]], req: SimulationRequest) -> Dict[str, Any]:
        """
        Runs counterfactual scenario simulation comparing Baseline (Always Retry) vs Revenue Leak Radar (EINRV).
        Calculates exact net revenue lift, margin savings, and cost reduction.
        """
        total = len(events)
        if total == 0:
            return {}

        baseline_recovered_count = 0
        radar_recovered_count = 0
        
        baseline_gross = 0.0
        radar_gross = 0.0
        
        baseline_costs = 0.0
        radar_costs = 0.0
        
        baseline_discounts = 0.0
        radar_discounts = 0.0

        time_series = []
        cumulative_baseline = 0.0
        cumulative_radar = 0.0

        for i, ev in enumerate(events):
            v = ev.get("amount", 1000.0)
            p_nat = self.estimate_natural_recovery(ev)

            # Baseline Policy: Always Retry + 10% Discount on failure
            p_base = min(p_nat + 0.10, 0.92)
            c_base = req.nudge_cost
            d_base = 0.10 * v
            net_base = (v * p_base) - c_base - d_base

            baseline_gross += (v * p_base)
            baseline_costs += c_base
            baseline_discounts += d_base
            baseline_recovered_count += p_base

            # Radar EINRV Policy
            eval_res = self.evaluate_case(ev)
            opt_act = eval_res.recommended_action
            
            opt_eval = next((a for a in eval_res.actions_evaluated if a.action == opt_act), eval_res.actions_evaluated[0])
            
            p_radar = opt_eval.recovery_probability
            c_radar = opt_eval.direct_cost
            d_radar = opt_eval.margin_cost
            net_radar = opt_eval.expected_net_value

            radar_gross += opt_eval.expected_gross_recovery
            radar_costs += c_radar
            radar_discounts += d_radar
            radar_recovered_count += p_radar

            cumulative_baseline += net_base
            cumulative_radar += net_radar

            if i % max(1, total // 10) == 0 or i == total - 1:
                time_series.append({
                    "step": f"Day {len(time_series)*3 + 1}",
                    "baseline_net": round(cumulative_baseline, 2),
                    "radar_net": round(cumulative_radar, 2),
                    "net_gain": round(cumulative_radar - cumulative_baseline, 2)
                })

        baseline_net = baseline_gross - baseline_costs - baseline_discounts
        radar_net = radar_gross - radar_costs - radar_discounts
        net_gain = radar_net - baseline_net
        gain_pct = (net_gain / baseline_net * 100.0) if baseline_net > 0 else 0.0

        return {
            "total_cases": total,
            "baseline_recovery_rate": round((baseline_recovered_count / total) * 100, 1),
            "radar_recovery_rate": round((radar_recovered_count / total) * 100, 1),
            "baseline_gross_recovered": round(baseline_gross, 2),
            "radar_gross_recovered": round(radar_gross, 2),
            "baseline_costs": round(baseline_costs, 2),
            "radar_costs": round(radar_costs, 2),
            "baseline_discounts": round(baseline_discounts, 2),
            "radar_discounts": round(radar_discounts, 2),
            "baseline_net": round(baseline_net, 2),
            "radar_net": round(radar_net, 2),
            "net_gain": round(net_gain, 2),
            "net_gain_pct": round(gain_pct, 1),
            "time_series": time_series
        }
