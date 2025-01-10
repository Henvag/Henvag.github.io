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
    const scopes = 'user-top-read user-read-playback-state streaming'; // Added scopes

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
    const response = await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=short_term', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Spotify API error: ${errorData.error}`);
    }

    const data = await response.json();
    // Debug preview URLs
    data.items.forEach((track, i) => {
        console.log(`Track ${i + 1}: ${track.name}`);
        console.log(`Preview URL: ${track.preview_url}`);
    });
    displayTracks(data.items.slice(0, 5));
}

// Display individual track with image and info
function displayTrack(track, index) {
    // Ensure preview URL is not null before creating element
    if (!track.preview_url) {
        console.log(`No preview URL for track: ${track.name}`);
    }

    return `
        <div class="track-item" onclick="playPreview('${track.preview_url || ''}', this)">
            <img src="${track.album.images[2].url}" alt="${track.name}" class="track-image">
            <div class="track-info">
                <p class="track-title">${track.name}</p>
                <p class="track-artist">${track.artists[0].name}</p>
                ${!track.preview_url ? '<span class="no-preview-text">No preview available</span>' : ''}
            </div>
        </div>
    `;
}

function playPreview(previewUrl, element) {
    if (!previewUrl) {
        console.log('Preview URL is missing');
        return;
    }

    const audioPlayer = document.getElementById('audio-player');

    // Validate URL before setting
    try {
        new URL(previewUrl);
        audioPlayer.src = previewUrl;
        audioPlayer.load();
        audioPlayer.play()
            .then(() => {
                document.querySelectorAll('.track-item').forEach(item => {
                    item.classList.remove('playing');
                });
                element.classList.add('playing');
            })
            .catch(err => console.error('Playback error:', err));
    } catch (e) {
        console.error('Invalid preview URL:', previewUrl);
    }
}