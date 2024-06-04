const clientId = 'b717312e3a904a39943442f7f6f11b4b'; // Replace with your client ID
const clientSecret = 'fb9b3c5b93bb49e3a89a637f17d471ce'; // Replace with your client secret
const redirectUri = encodeURIComponent('https://henvag.github.io'); // Replace with your redirect URI
const scopes = encodeURIComponent('user-read-private user-read-email'); // Replace with the scopes you need

// Function to get an access token
async function getAccessToken(code) {
  const result = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
    },
    body: `grant_type=authorization_code&code=${code}&redirect_uri=${redirectUri}`
  });

  const data = await result.json();
  return data.access_token;
}

// Function to handle the login button click
document.getElementById('login').addEventListener('click', function() {
  const url = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}`;

  // Redirect the user to the Spotify login page
  window.location.href = url;
});

// Get the code from the URL
const code = new URLSearchParams(window.location.search).get('code');

if (code) {
  // If there's a code in the URL, exchange it for an access token
  getAccessToken(code).then(function(accessToken) {
    // Now you can use the access token to make requests to the Spotify Web API
    // For example, you could get the user's top tracks and display them on the page
  });
}


