# ZepusClinics Triage Bot Logic (Phase 1)
# Step-by-step conversational flow using Python (can be Flask-integrated later)

# Define core logic and functions

def collect_patient_info():
    return {
        "step": 0,
        "name": None,
        "age": None,
        "sex": None,
        "location": None,
        "country": None,
        "race": None,
        "main_complaint": None,
        "symptom_duration": None,
        "associated_symptoms": [],
        "urgency": None,
        "likely_specialty": None,
        "consultation_mode": None,
        "occupation": None,
        "language": "en"
    }

def determine_urgency(symptoms, location=None):
    red_flags = ["severe pain", "bleeding", "loss of consciousness", "shortness of breath"]
    for flag in red_flags:
        if flag in symptoms:
            return "emergency"
    return "non-urgent"

def classify_specialty(complaint, location=None, country=None, race=None, occupation=None):
    surgical = ["abdominal pain", "lump", "swelling", "hernia", "bleeding", "trauma"]
    medical = ["fever", "cough", "headache", "diarrhea", "chest pain"]

    # Regional awareness
    if country and country.lower() == "nigeria":
        if "fever" in complaint.lower() or "headache" in complaint.lower():
            return "Medical (rule out malaria or typhoid)"
    if country and country.lower() in ["india", "pakistan"]:
        if "cough" in complaint.lower() or "weight loss" in complaint.lower():
            return "Medical (consider tuberculosis)"

    # Racial background
    if race and race.lower() == "african descent":
        if "pain" in complaint.lower() and "back" in complaint.lower():
            return "Medical (consider sickle cell crisis)"

    # Occupational factors
    if occupation and occupation.lower() == "construction worker":
        if "pain" in complaint.lower() and "back" in complaint.lower():
            return "Medical (consider musculoskeletal strain)"

    # General classification
    if any(word in complaint.lower() for word in surgical):
        return "Surgical"
    elif any(word in complaint.lower() for word in medical):
        return "Medical"
    else:
        return "General Practitioner"

def recommend_specialist(specialty):
    return {
        "Surgical": "General Surgeon or Specialist Surgeon",
        "Medical": "Physician or Medical Consultant",
        "General Practitioner": "ZepusClinics General Practitioner"
    }.get(specialty, "Consult a ZepusClinics Doctor")

def triage_bot_flow():
    patient = collect_patient_info()
    # patient["language"] = data.get("language", "en")
# patient["country"] = data.get("country")
# patient["race"] = data.get("race")
# patient["occupation"] = data.get("occupation")

    # Simulate inputs for now
    patient["name"] = "Jane Doe"
    patient["age"] = 35
    patient["sex"] = "Female"
    patient["location"] = "Lagos"
    patient["main_complaint"] = "abdominal pain and vomiting"
    patient["symptom_duration"] = "2 days"
    patient["associated_symptoms"] = ["nausea", "fever"]

    # Analyze
    patient["urgency"] = determine_urgency(patient["main_complaint"] + ' ' + ' '.join(patient["associated_symptoms"]))
    patient["likely_specialty"] = classify_specialty(patient["main_complaint"])
    specialist = recommend_specialist(patient["likely_specialty"])

    # Ask preference
    patient["consultation_mode"] = "online"

    # Output summary
    print(f"Hello {patient['name']}, based on your symptoms, you likely need a {specialist}.")
    print(f"Urgency Level: {patient['urgency'].capitalize()}")
    print(f"Preferred consultation mode: {patient['consultation_mode']}")

from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/triage", methods=["POST"])
def triage():
    data = request.get_json()
    session = data.get("session", collect_patient_info())
    message = data.get("message", "").strip()

    # Identify the step
    step = session.get("step", 0)
    response = ""

    if step == 0:
        response = "Hi! I'm Dr. Zepus, your virtual health assistant. May I know your name?"
        session["step"] = 1

    elif step == 1:
        session["name"] = message
        response = f"Nice to meet you, {message}. How old are you?"
        session["step"] = 2

    elif step == 2:
        session["age"] = message
        response = "What is your sex (Male/Female)?"
        session["step"] = 3

    elif step == 3:
        session["sex"] = message
        response = "Which city or town are you in?"
        session["step"] = 4

    elif step == 4:
        session["location"] = message
        response = "Which country are you in?"
        session["step"] = 5

    elif step == 5:
        session["country"] = message
        response = "What is your racial background (optional)?"
        session["step"] = 6

    elif step == 6:
        session["race"] = message
        response = "What is your occupation?"
        session["step"] = 7

    elif step == 7:
        session["occupation"] = message
        response = "What symptom is troubling you the most?"
        session["step"] = 8

    elif step == 8:
        session["main_complaint"] = message
        response = "How long have you had this symptom?"
        session["step"] = 9

    elif step == 9:
        session["symptom_duration"] = message
        response = "Do you have any other symptoms? (List them separated by commas, or say 'none')"
        session["step"] = 10

    elif step == 10:
        if message.lower() != "none":
            session["associated_symptoms"] = [s.strip() for s in message.split(",")]
        else:
            session["associated_symptoms"] = []

        all_symptoms = session["main_complaint"] + ' ' + ' '.join(session["associated_symptoms"])
        session["urgency"] = determine_urgency(all_symptoms, session["location"])
        session["likely_specialty"] = classify_specialty(session["main_complaint"], session["location"], session["country"], session["race"], session["occupation"])
        specialist = recommend_specialist(session["likely_specialty"].split(" ")[0])

        summary = f"Thanks {session['name']}. Based on what you've told me, you likely need a {specialist}. "
        if session["urgency"] == "emergency":
            summary += "Please go to the nearest hospital immediately."
        else:
            summary += "Would you prefer an online or in-person consultation?"
            session["step"] = 11
            return jsonify({"response": summary, "session": session})

        session["step"] = -1  # finished
        return jsonify({"response": summary, "session": session})

    elif step == 11:
        session["consultation_mode"] = message.lower()
        summary = f"Great. A {session['consultation_mode']} consultation with a {session['likely_specialty']} is recommended."
        session["step"] = -1  # done
        return jsonify({"response": summary, "session": session})

    else:
        response = "This session is already complete. If you'd like to restart, please refresh or say 'restart'."

    return jsonify({"response": response, "session": session})

if __name__ == "__main__":
    app.run(debug=True)
