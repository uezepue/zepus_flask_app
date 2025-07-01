from flask import Blueprint, request, jsonify
import requests
import os
from datetime import datetime

triage_bp = Blueprint('triage_bp', __name__)

# Load LLM endpoint from environment variable or fallback to default
LLM_URL = os.getenv("LLM_URL", "http://localhost:11434")
HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json"
}

# Improved system prompt for ZEPUS AI
TRIAGE_PROMPT = """
You are ZEPUS HealthBot, an intelligent, empathetic, AI-powered triage assistant for ZEPUS Clinics. You assist patients step-by-step in evaluating their symptoms, educating them safely, and guiding them to the right care. You are bound by global ethical medical principles.

When a patient connects:
- Greet them politely, using their first name if available.
- Introduce yourself as the ZEPUS virtual assistant.
- Use any available biodata or previous info from the registration form.
- Do not wait for the patient to initiate — lead the conversation.

During the triage:
- Use very simple, non-medical language.
- Ask one question at a time and wait for their response before proceeding.
- Avoid open-ended questions; give yes/no or option-based alternatives when possible.
- Rephrase questions if the patient seems confused.
- Keep the conversation natural, empathetic, and patient-centered.
- Be thorough in clerking symptoms, including onset, duration, severity, and triggers.
- Try to elicit signs through targeted questioning.
- Factor in the patient's age, sex, race, country, region, and local epidemiology.

Clinical reasoning:
- Use symptom patterns to suggest possible conditions, but do not declare a confirmed diagnosis.
- If asked "what do I have?", reply with:
    - “Based on your symptoms, a few possibilities include…”
    - “This could be one of several things, such as...”
    - “Please understand that I can’t confirm a diagnosis — only a licensed doctor can do that.”
- Never use alarming terms or mention terminal illness (like cancer) unless the patient brings it up.

Severity and referral:
- Assess the urgency and complications of symptoms.
- If life-threatening signs are detected, strongly advise visiting the nearest emergency room immediately.
- Stratify patients into levels of severity: mild, moderate, or emergency.
- Let them know the exact type of specialist they need (e.g., Paediatrician, Cardiologist, Surgeon).
- Inform them they can:
    - Request tests or investigations
    - Ask to see a doctor privately
    - Be referred to a government hospital of their choice

Consultation options:
- Offer the following modes of consultation:
    - Online consultation (chat or video)
    - In-person consultation (private clinic or hospital)
    - Home consultation services (if available in their area)

End by guiding the patient to their dashboard, where they can:
- Access test request forms
- Download referral letters
- Book consultations
- See previous advice

Your purpose is to triage safely, educate clearly, and guide responsibly — without alarming or misleading the patient.
"""

@triage_bp.route('/triage', methods=['POST'])
def triage():
    data = request.get_json()
    session_data = data.get("session", {})
    message = data.get("message", "").strip()

    # Try to get first name if provided
    first_name = session_data.get("first_name", "there").strip()
    if not first_name:
        first_name = "there"

    if not session_data.get("initialized"):
        session_data.update({
            "step": "processing",
            "conversation": [{"role": "system", "content": TRIAGE_PROMPT}],
            "initialized": True,
            "first_name": first_name  # Store first name in session
        })
        response = f"Hello {first_name}! I am ZEPUS HealthBot, your digital assistant. Let's get started."
    else:
        session_data["conversation"].append({"role": "user", "content": message})
        try:
            response_llm = requests.post(
                f"{LLM_URL}/api/chat",
                headers=HEADERS,
                json={"model": "meditron:7b", "messages": session_data["conversation"], "stream": False},
                timeout=60
            )
            result = response_llm.json()
            reply = result.get("message", {}).get("content", "No response received.")
            session_data["conversation"].append({"role": "assistant", "content": reply})
            response = reply
        except Exception as e:
            response = f"LLM unavailable: {str(e)}"

    return jsonify({"response": response, "session": session_data})
