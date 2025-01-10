console.log("spotify.js is loading");

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Spotify login functionality
    console.log("DOMContentLoaded triggered");
    const loginButton = document.getElementById('login');

    if (!loginButton) {
        console.error("No #login button found on page");
        return;
    }
    console.log("Found #login button:", loginButton);

    // 1. Call redirectToSpotify on click
    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        console.log("Login button clicked");
        redirectToSpotify();
    });

    // 2. Check URL for 'code' after redirect
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
        console.log("Found authorization code:", code);
        handleSpotifyCallback(code);
    }
});

// Display tracks in the music box
function displayTracks(tracks) {
    const container = document.getElementById('top-tracks');
    if (!container) {
        console.error('No #top-tracks container found');
        return;
    }

    container.innerHTML = tracks
        .map((track, index) => displayTrack(track, index))
        .join('');
}

// Redirect to Spotify OAuth
function redirectToSpotify() {
    const clientId = 'b717312e3a904a39943442f7f6f11b4b';
    const redirectUri = 'https://henvag.github.io';
    const scopes = 'user-top-read';

    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&show_dialog=true`;
    console.log("Redirecting to Spotify:", authUrl);
    window.location.href = authUrl;
}

// Handle OAuth callback
async function handleSpotifyCallback(code) {
    try {
        const accessToken = await getAccessToken(code);
        await getUserTopTracks(accessToken);
        displayLoggedInState();
        document.querySelector('.music-box').classList.add('expanded');
        document.querySelector('.music-text').style.display = 'none';
    } catch (error) {
        console.error('Error in Spotify callback:', error);
    }
}

// Update UI for logged in state
function displayLoggedInState() {
    const loginButton = document.getElementById('login');
    if (loginButton) {
        loginButton.style.display = 'none';
    }
}

// Get Spotify access token
async function getAccessToken(code) {
    const clientId = 'b717312e3a904a39943442f7f6f11b4b';
    const clientSecret = 'fb9b3c5b93bb49e3a89a637f17d471ce';
    const redirectUri = 'https://henvag.github.io';

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(redirectUri)}`
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Spotify API error: ${errorData.error}`);
    }

    const data = await response.json();
    return data.access_token;
}

// Get user's top tracks from Spotify
async function getUserTopTracks(accessToken) {
    const response = await fetch('https://api.spotify.com/v1/me/top/tracks', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Spotify API error: ${errorData.error}`);
    }

    const data = await response.json();
    displayTracks(data.items.slice(0, 5));
}

// Display individual track with image and info
function displayTrack(track, index) {
    return `
        <div class="track-item">
            <img src="${track.album.images[2].url}" alt="${track.name}" class="track-image">
            <div class="track-info">
                <p class="track-title">${track.name}</p>
                <p class="track-artist">${track.artists[0].name}</p>
            </div>
        </div>
    `;
}