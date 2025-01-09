from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:63342"],
        "methods": ["GET", "POST"],
        "allow_headers": ["Content-Type"]
    }
})

REDIRECT_URI = 'http://localhost:63342/Henvag.github.io/callback'
@app.route('/')
def home():
    return "Spotify Auth Server Running"


@app.route('/callback')
def callback():
    code = request.args.get('code')
    if not code:
        return jsonify({"error": "No code provided"}), 400

    # Exchange code for token
    response = requests.post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    })

    return response.json()


if __name__ == '__main__':
    app.run(port=5000, debug=True)
