from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/patient-register', methods=['POST'])
def patient_register():
    data = request.get_json()
    print("ZepusClinics Patient Registration Data:", data)
    # You can save data to a file or database here
    return jsonify({"message": "ZepusClinics Patient registered successfully!"})

@app.route('/doctor-register', methods=['POST'])
def doctor_register():
    data = request.get_json()
    print("ZepusClinics Doctor Registration Data:", data)
    # You can save data to a file or database here
    return jsonify({"message": "ZepusClinics Doctor registered successfully!"})

if __name__ == '__main__':
    app.run(debug=True)
