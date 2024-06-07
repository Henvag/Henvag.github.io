const clientId = 'b717312e3a904a39943442f7f6f11b4b'; // Replace with your client ID
const clientSecret = 'fb9b3c5b93bb49e3a89a637f17d471ce'; // Replace with your client secret
const redirectUri = encodeURIComponent('https://henvag.github.io');
const scopes = encodeURIComponent('user-read-private user-read-email user-top-read'); // Added user-top-read scope

// Function to get an access token
document.addEventListener('DOMContentLoaded', (event) => {
  // ... Your existing code ...

  // Get the code from the URL
  const code = new URLSearchParams(window.location.search).get('code');

  if (code) {
    // If there's a code in the URL, exchange it for an access token
    getAccessToken(code).then(function(accessToken) {
      // Now you can use the access token to make requests to the Spotify Web API
      getUserTopTracks(accessToken); // Call the new function to get the user's top tracks
    });
  }
});

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

// New function to get the user's top tracks
// New function to get the user's top tracks
async function getUserTopTracks(accessToken) {
  const result = await fetch('https://api.spotify.com/v1/me/top/tracks', {
    headers: {
      'Authorization': 'Bearer ' + accessToken
    }
  });

  const data = await result.json();

  const topTracksDiv = document.getElementById('top-tracks');
  const audioPlayer = document.getElementById('audio-player'); // Get the audio player

  // Limit the number of tracks processed to ten
  data.items.slice(0, 5).forEach(track => {
    // Create a new div for each track
    const trackDiv = document.createElement('div');
    trackDiv.classList.add('track');

    // Create an img element for the album cover
    const albumCover = document.createElement('img');
    albumCover.src = track.album.images[0].url;
    albumCover.classList.add('album-cover');

    // Add a click event listener to the album cover
    albumCover.addEventListener('click', () => {
      audioPlayer.src = track.preview_url; // Change the source of the audio player
      audioPlayer.play(); // Play the audio
    });

    // Create a p element for the track name
    const trackName = document.createElement('p');
    trackName.textContent = track.name;
    trackName.classList.add('track-name');

    // Create a p element for the artist name
    const artistName = document.createElement('p');
    artistName.textContent = track.artists[0].name;
    artistName.classList.add('artist-name');

    // Append the img and p elements to the track div
    trackDiv.appendChild(albumCover);
    trackDiv.appendChild(trackName);
    trackDiv.appendChild(artistName);

    // Append the track div to the top tracks div
    topTracksDiv.appendChild(trackDiv);
  });
}





// Function to handle the login button click


document.getElementById('login').addEventListener('click', function() {
  const url = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}`;











  // Redirect the user to the Spotify login page
  window.location.href = url;
});