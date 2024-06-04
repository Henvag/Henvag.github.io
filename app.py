from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

@app.route('/')
def home():
    return "Spotify Connected!"

@app.route('/callback')
def callback():
    code = request.args.get('code')
    # Here you can add the code to handle the authorization code received from Spotify
    # For example, you could call your getAccessToken function here
    return "Received authorization code: " + code

if __name__ == '__main__':
    try:
        app.run(port=80)
    except PermissionError:
        print("You don't have the necessary permissions to bind to port 80.")