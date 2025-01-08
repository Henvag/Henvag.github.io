console.log("spotify.js is loading");

document.addEventListener('DOMContentLoaded', () => {
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

function redirectToSpotify() {
    const clientId = 'b717312e3a904a39943442f7f6f11b4b';
    const redirectUri = 'https://henvag.github.io'; // Must match your Spotify App Settings
    const scopes = 'user-top-read';

    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&show_dialog=true`;
    console.log("Redirecting to Spotify:", authUrl);
    window.location.href = authUrl;
}

async function handleSpotifyCallback(code) {
    try {
        const accessToken = await getAccessToken(code);
        displayLoggedInState();
        await getUserTopTracks(accessToken);
    } catch (error) {
        console.error('Error in Spotify callback:', error);
    }
}

function displayLoggedInState() {
    const loginButton = document.getElementById('login');
    if (loginButton) {
        loginButton.style.display = 'none';
    }
}

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

function displayTracks(tracks) {
    const topTracksDiv = document.getElementById('top-tracks');
    topTracksDiv.innerHTML = '';
    tracks.forEach((track, index) => {
        const trackElement = document.createElement('div');
        trackElement.textContent = `${index + 1}. ${track.name} by ${track.artists.map(artist => artist.name).join(', ')}`;
        topTracksDiv.appendChild(trackElement);
    });
}