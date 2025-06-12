# --- SMART TRIAGE CHATBOT v3 ---
from flask import Flask, request, jsonify, render_template
import os
import json
import requests
import difflib

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('zepusclinics.html')

@app.route('/chat')
def chatbot():
    return render_template('chat.html')  # Make sure 'chat.html' exists in /templates

@app.route('/patient-register', methods=['POST'])
def patient_register():
    data = request.get_json()
    return jsonify({'status': 'success'})

@app.route('/doctor-register', methods=['POST'])
def doctor_register():
    data = request.get_json()
    return jsonify({'status': 'success'})

LLM_URL = "https://llm.zepusclinics.com"

@app.route("/llm-chat", methods=["POST"])
def llm_chat():
    data = request.get_json()
    user_input = data.get("message", "")
    try:
        response = requests.post(
    f"{LLM_URL}/api/chat",
    json={
        "model": "mistral",
        "messages": [
            {"role": "system", "content": "You are a helpful medical triage assistant."},
            {"role": "user", "content": user_input}
        ]
    },
    timeout=20
)

llm_reply = response.json().get("message", {}).get("content", "Sorry, no response received.")

    except Exception as e:
        llm_reply = f"LLM unavailable: {str(e)}"
    return jsonify({"response": llm_reply})

# Cache disease data
merged_disease_data = None

def load_and_cache_merged_disease_data(data_folder="data"):
    global merged_disease_data
    if merged_disease_data is None:
        merged = []
        for filename in os.listdir(data_folder):
            if filename.endswith(".json"):
                file_path = os.path.join(data_folder, filename)
                try:
                    with open(file_path, "r") as f:
                        data = json.load(f)
                        if isinstance(data, list):
                            merged.extend(data)
                except Exception as e:
                    print(f"Error loading {filename}: {e}")
        merged_disease_data = merged
    return merged_disease_data

# Symptom dictionary
with open("symptom_dictionary.json", "r") as f:
    symptom_dictionary = json.load(f)

symptom_dictionary.update({
    "lightheaded": "dizziness",
    "can't walk straight": "imbalance",
    "passing out": "syncope",
    # (continued)... add all your extended expressions here
})

def extract_symptoms_from_text(text, dictionary):
    found = []
    lowered = text.lower()
    for phrase in dictionary:
        if phrase in lowered:
            found.append(dictionary[phrase])
    if not found:
        for phrase in dictionary:
            if difflib.get_close_matches(phrase, [lowered], cutoff=0.8):
                found.append(dictionary[phrase])
    return found or [text]

@app.route("/triage", methods=["POST"])
def triage():
    data = request.get_json()
    session = data.get("session", {})
    message = data.get("message", "").strip().lower()
    diseases = load_and_cache_merged_disease_data()

    if not session.get("initialized"):
        session.update({
            "name": "John", "age": 35, "sex": "Male", "location": "Lagos", "country": "Nigeria",
            "occupation": "Teacher", "step": "initial", "symptoms": [], "associated": [],
            "mapped_symptoms": [], "likely_conditions": [], "diagnosis_summary": "",
            "urgency": "unknown", "initialized": True
        })

    step = session.get("step")
    response = ""

    if step == "initial":
        response = "Welcome. Please tell me your main symptoms."
        session["step"] = "symptoms"

    elif step == "symptoms":
        extracted = extract_symptoms_from_text(message, symptom_dictionary)
        session["mapped_symptoms"] = extracted
        session["step"] = "analysis"
        response = "Thanks. I’ll analyze what you've told me."

    elif step == "analysis":
        keywords = session["mapped_symptoms"]
        likely_conditions = []
        for disease in diseases:
            if "symptoms" in disease:
                timeline = disease["symptoms"].get("timeline", [])
                disease_symptoms = [s["symptom"].lower() for s in timeline]
                match_score = len(set(keywords) & set(disease_symptoms))
                complications = disease["symptoms"].get("complications", [])
                emergencies = disease["symptoms"].get("emergency_markers", [])
                if match_score >= 2:
                    likely_conditions.append({
                        "disease": disease["disease"],
                        "match_score": match_score,
                        "specialty": disease.get("specialty", "General"),
                        "complications": complications,
                        "emergency": any(e in keywords for e in emergencies),
                        "description": disease.get("description", "")
                    })
        likely_conditions.sort(key=lambda x: -x["match_score"])
        session["likely_conditions"] = likely_conditions[:3]

        if likely_conditions:
            hints = ". ".join([f"Possibly related to {d['specialty'].lower()} issues" for d in likely_conditions])
            session["diagnosis_summary"] = hints
            response = f"Your symptoms suggest something that may need attention. {hints}. I’ll now check if it's urgent."
            try:
                llm_reasoning = requests.post(
                    f"{LLM_URL}/api/generate",
                    json={"model": "mistral", "prompt": f"The patient has these symptoms: {keywords}. What should I consider as differentials?"},
                    timeout=20
                )
                reasoning = llm_reasoning.json().get("response", "")
                response += " Here’s what I’m also considering: " + reasoning
            except:
                pass
            session["step"] = "urgency"
        else:
            response = "I couldn’t match your symptoms to a specific condition yet, but let’s assess urgency."
            session["step"] = "urgency"

    elif step == "urgency":
        emergencies = ["loss of consciousness", "shortness of breath", "chest pain", "heavy bleeding"]
        if any(e in session["mapped_symptoms"] for e in emergencies):
            session["urgency"] = "emergency"
            response = "Your symptoms may be serious. Please proceed to the nearest emergency center."
            session["step"] = "done"
        else:
            session["urgency"] = "non-emergency"
            response = (
                f"This doesn’t appear to be an emergency. "
                f"Based on my analysis: {session['diagnosis_summary']}. "
                "How would you prefer to consult — online, in-person, home visit, or government hospital referral?"
            )
            session["step"] = "consult_mode"

    elif step == "consult_mode":
        session["consultation_mode"] = message
        if "government" in message:
            session["step"] = "govt_name"
            response = "Please provide the name of the government hospital you prefer."
        else:
            response = f"Thank you. You’ll be connected with a suitable specialist via {message}."
            session["step"] = "done"

    elif step == "govt_name":
        session["govt_hospital"] = message
        response = f"Thank you. We will refer you to {message} for further care."
        session["step"] = "done"

    else:
        response = "This session is complete. Type 'restart' to begin again."

    return jsonify({"response": response, "session": session})

# --- FINAL BLOCK TO ENABLE EXTERNAL ACCESS THROUGH CLOUDFLARE ---
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
