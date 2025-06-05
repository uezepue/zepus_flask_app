# --- SMART TRIAGE CHATBOT v3 ---
from flask import Flask, request, jsonify, render_template
import os
import json

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
    # Store data or log it
    return jsonify({'status': 'success'})

@app.route('/doctor-register', methods=['POST'])
def doctor_register():
    data = request.get_json()
    # Store data or log it
    return jsonify({'status': 'success'})




# Global disease cache
merged_disease_data = None

# --- Merge disease JSON files once ---
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

# --- Symptom Dictionary (Layman to Medical) ---
with open("symptom_dictionary.json", "r") as f:
    symptom_dictionary = json.load(f)

# Expand dictionary with more expressions
symptom_dictionary.update({
    "lightheaded": "dizziness",
    "can't walk straight": "imbalance",
    "passing out": "syncope",
    "lost my mind": "confusion",
    "shaking body": "seizure",
    "body hot": "fever",
    "can't feel my legs": "numbness",
    "hard to breathe": "shortness of breath",
    "cold chills": "chills",
    "body pain": "body aches",
    "sweating a lot": "diaphoresis",
    "body is stiff": "rigidity",
    "heart racing": "palpitations",
    "eyes turning yellow": "jaundice",
    "pee too often": "frequent urination",
    "pee small small": "oliguria",
    "blood coming from private part": "vaginal bleeding",
    "baby not moving": "reduced fetal movement",
    "baby not sucking": "feeding difficulty",
    "baby not eating": "poor feeding",
    "child not gaining weight": "failure to thrive",
    "baby breathing fast": "tachypnea",
    "eyes rolling backwards": "seizure",
    "baby body jerking": "seizure",
    "high fever not going down": "persistent fever",
    "child breathing with chest sinking": "respiratory distress",
    "nose flaring while breathing": "nasal flaring",
    "child making grunting noise": "expiratory grunting",
    "vomiting everything": "projectile vomiting",
    "baby always crying": "excessive crying",
    "child very weak": "lethargy",
    "not sucking breast": "feeding difficulty",
    "neck stiff in child": "nuchal rigidity",
    "baby not waking up easily": "decreased responsiveness",
    "child stooling many times": "frequent diarrhea",
    "child with swollen body": "oedema",
    "baby not urinating": "anuria",
    "swollen fontanelle": "bulging fontanelle",
    "soft head sunken": "sunken fontanelle",
    "baby not crying at birth": "birth asphyxia",
    "child not talking": "speech delay",
    "baby skin turning yellow": "neonatal jaundice",
    "baby vomiting green stuff": "bilious vomiting",
    "baby head too big": "hydrocephalus",
    "baby always sleeping": "hypotonia",
    "baby has rash all over body": "generalized rash",
    "child has white patches in mouth": "oral thrush",
    "baby has noisy breathing": "stridor",
    "child always scratching bum": "perianal itching",
    "forgets things easily": "memory loss",
    "keeps repeating questions": "short-term memory loss",
    "talks to people not there": "hallucinations",
    "can't sleep at night": "insomnia",
    "sleeps too much during day": "hypersomnia",
    "loses balance while walking": "unsteady gait",
    "shakes when reaching for things": "intention tremor",
    "stiff all over in the morning": "morning stiffness",
    "sees double": "diplopia",
    "pees on self": "urinary incontinence",
    "passes stool without knowing": "fecal incontinence",
    "heart beats too slow": "bradycardia",
    "heart beats too fast": "tachycardia",
    "gets tired easily": "fatigue",
    "loses weight without trying": "unintentional weight loss",
    "always feeling sad": "depression",
    "talks out of sense": "delirium",
    "doesn’t recognize family anymore": "advanced dementia",
    "keeps falling": "recurrent falls",
    "holds urine for too long then can't go": "urinary retention"
})

# --- Extract symptom phrases from free text ---
import difflib

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

# --- Greeting and smart intake logic ---
@app.route("/triage", methods=["POST"])
def triage():
    data = request.get_json()
    session = data.get("session", {})
    # For voice/text input preprocessing
    message = data.get("message", "").strip().lower()

    # Get disease database
    diseases = load_and_cache_merged_disease_data()

    # Pull biodata if not loaded yet
    if not session.get("initialized"):
        session.update({
            "name": "John",
            "age": 35,
            "sex": "Male",
            "location": "Lagos",
            "country": "Nigeria",
            "occupation": "Teacher",
            "step": "intro",
            "symptoms": [],
            "associated": [],
            "mapped_symptoms": [],
            "likely_conditions": [],
            "diagnosis_summary": "",
            "urgency": "unknown",
            "initialized": True
        })

    step = session.get("step")
    response = ""

    if step == "intro":
        response = f"Hello {session['name']}, I’m Dr Zepus, your virtual assistant. Tell me how you're feeling today."
        session["step"] = "main_complaint"

    elif step == "main_complaint":
        session["symptoms"].append(message)
        extracted = extract_symptoms_from_text(message, symptom_dictionary)
        session["mapped_symptoms"].extend(extracted)
        response = f"Thanks for sharing. Are there any other symptoms you're experiencing? Please list them, or say 'no'."
        session["step"] = "associated_symptoms"

    elif step == "associated_symptoms":
        if message != "no":
            assoc = [m.strip() for m in message.split(",")]
            session["associated"].extend(assoc)
            for m in assoc:
                extracted = extract_symptoms_from_text(m, symptom_dictionary)
                session["mapped_symptoms"].extend(extracted)
        response = "Got it. Let me analyze your symptoms."
        session["step"] = "analysis"

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
        session["step"] = "urgency"

        if likely_conditions:
            hints = ". ".join([f"Possibly related to {d['specialty'].lower()} issues" for d in likely_conditions])
            session["diagnosis_summary"] = hints
            response = f"Your symptoms suggest something that may need attention. {hints}. I’ll now check if it's urgent."
        else:
            response = f"I couldn’t match your symptoms to a specific condition yet, but let’s assess urgency."

    elif step == "urgency":
        emergencies = ["loss of consciousness", "shortness of breath", "chest pain", "heavy bleeding"]
        if any(e in session["mapped_symptoms"] for e in emergencies):
            session["urgency"] = "emergency"
            response = "Your symptoms may be serious. Please proceed to the nearest emergency center."
        else:
            session["urgency"] = "non-emergency"
            response = f"This doesn’t appear to be an emergency. Based on my analysis: {session['diagnosis_summary']}. How would you prefer to consult — online, in person, home visit, or government hospital?"
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
