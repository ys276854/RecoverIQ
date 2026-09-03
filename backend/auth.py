import hashlib
import os
import secrets
from typing import Dict, Any, Optional
from pydantic import BaseModel, EmailStr

class LoginRequest(BaseModel):
    email: str
    password: str
    remember_me: bool = False

class SignupRequest(BaseModel):
    business_name: str
    full_name: str
    email: str
    username: str
    password: str
    confirm_password: str
    country: str = "India"
    currency: str = "INR"
    agree_terms: bool = True

class OnboardingRequest(BaseModel):
    business_name: str
    industry: str
    country: str
    currency: str
    max_discount_amount: float = 500.0
    max_intervention_cost: float = 25.0
    max_touches_per_48h: int = 2
    data_connection: str = "DEMO_DATASET"

class AuthManager:
    """
    Secure session & user management layer for Razorpay Revenue Leak Radar.
    Uses salted SHA-256 password hashing and token-based authentication.
    """

    def __init__(self):
        self.users_db: Dict[str, Dict[str, Any]] = {}
        self.sessions_db: Dict[str, Dict[str, Any]] = {}

        # Seed pre-configured Demo Merchant
        self.register_user(
            email="demo@acmecommerce.in",
            username="demo_acme",
            password="demo123",
            business_name="Acme Commerce India",
            full_name="Demo Merchant Admin",
            country="India",
            currency="INR",
            onboarded=True
        )

    def _hash_password(self, password: str, salt: str) -> str:
        return hashlib.sha256((password + salt).encode('utf-8')).hexdigest()

    def register_user(
        self,
        email: str,
        username: str,
        password: str,
        business_name: str,
        full_name: str,
        country: str = "India",
        currency: str = "INR",
        onboarded: bool = False
    ) -> Dict[str, Any]:
        email_clean = email.strip().lower()
        if email_clean in self.users_db:
            raise ValueError("An account with this email address already exists.")

        salt = secrets.token_hex(16)
        pwd_hash = self._hash_password(password, salt)

        user_record = {
            "id": f"usr_{secrets.token_hex(8)}",
            "email": email_clean,
            "username": username.strip(),
            "full_name": full_name.strip(),
            "business_name": business_name.strip(),
            "country": country,
            "currency": currency,
            "salt": salt,
            "password_hash": pwd_hash,
            "onboarded": onboarded,
            "industry": "E-Commerce",
            "created_at": secrets.token_hex(4)
        }
        self.users_db[email_clean] = user_record
        return user_record

    def authenticate_user(self, email: str, password: str) -> Optional[Dict[str, Any]]:
        email_clean = email.strip().lower()
        user = self.users_db.get(email_clean)
        if not user:
            return None

        expected_hash = self._hash_password(password, user["salt"])
        if secrets.compare_digest(expected_hash, user["password_hash"]):
            return user
        return None

    def create_session(self, user: Dict[str, Any]) -> str:
        token = f"rzp_sess_{secrets.token_urlsafe(32)}"
        self.sessions_db[token] = {
            "user_id": user["id"],
            "email": user["email"],
            "business_name": user["business_name"],
            "full_name": user["full_name"],
            "onboarded": user["onboarded"]
        }
        return token

    def get_session(self, token: str) -> Optional[Dict[str, Any]]:
        if not token:
            return None
        clean_token = token.replace("Bearer ", "").strip()
        sess = self.sessions_db.get(clean_token)
        if sess:
            user = self.users_db.get(sess["email"])
            return user
        return None

    def delete_session(self, token: str):
        clean_token = token.replace("Bearer ", "").strip()
        if clean_token in self.sessions_db:
            del self.sessions_db[clean_token]

AUTH = AuthManager()
