const clientId = 'b717312e3a904a39943442f7f6f11b4b';
const clientSecret = 'fb9b3c5b93bb49e3a89a637f17d471ce';
const redirectUri = encodeURIComponent('https://henvag.github.io');
const scopes = encodeURIComponent('user-read-private user-read-email user-top-read');

// Test mode state
let isTestMode = false;
let currentlyPlaying = null;

// Mock data for testing
const mockTracks = [
    {
        name: "Bohemian Rhapsody",
        artist: "Queen",
        preview_url: "https://p.scdn.co/mp3-preview/fake-url-1",
        album: { images: [{ url: "/api/placeholder/64/64" }] }
    },
    {
        name: "Hotel California",
        artist: "Eagles",
        preview_url: "https://p.scdn.co/mp3-preview/fake-url-2",
        album: { images: [{ url: "/api/placeholder/64/64" }] }
    },
    {
        name: "Sweet Child O' Mine",
        artist: "Guns N' Roses",
        preview_url: "https://p.scdn.co/mp3-preview/fake-url-3",
        album: { images: [{ url: "/api/placeholder/64/64" }] }
    },
    {
        name: "Billie Jean",
        artist: "Michael Jackson",
        preview_url: "https://p.scdn.co/mp3-preview/fake-url-4",
        album: { images: [{ url: "/api/placeholder/64/64" }] }
    },
    {
        name: "Smells Like Teen Spirit",
        artist: "Nirvana",
        preview_url: "https://p.scdn.co/mp3-preview/fake-url-5",
        album: { images: [{ url: "/api/placeholder/64/64" }] }
    }
];

// Function to create track element
function createTrackElement(track, number) {
    const div = document.createElement('div');
    div.className = 'track-item';

    const albumCover = document.createElement('img');
    albumCover.src = track.album.images[0].url;
    albumCover.className = 'album-cover';
    albumCover.style.width = '48px';
    albumCover.style.height = '48px';
    albumCover.style.borderRadius = '4px';
    albumCover.style.marginRight = '10px';

    div.innerHTML = `
        <span class="track-number">${number}</span>
        <img src="${track.album.images[0].url}" class="album-cover" alt="${track.name}">
        <div class="track-info">
            <p class="track-title">${track.name}</p>
            <p class="track-artist">${track.artist || track.artists[0].name}</p>
        </div>
    `;

    div.addEventListener('click', () => playTrack(track, div));
    return div;
}

// Function to play track
function playTrack(track, element) {
    const audioPlayer = document.getElementById('audio-player');

    // Remove playing class from all tracks
    document.querySelectorAll('.track-item').forEach(item => {
        item.classList.remove('playing');
    });

    if (currentlyPlaying === track) {
        audioPlayer.pause();
        currentlyPlaying = null;
    } else {
        if (track.preview_url) {
            audioPlayer.src = track.preview_url;
            audioPlayer.play();
            element.classList.add('playing');
            currentlyPlaying = track;
        } else {
            console.log(`No preview available for: ${track.name}`);
        }
    }
}

// Function to toggle test mode
function toggleTestMode() {
    isTestMode = !isTestMode;
    const loginButton = document.getElementById('login');
    loginButton.textContent = isTestMode ? 'Exit Test Mode' : 'Login with Spotify';
    if (isTestMode) {
        displayMockTracks();
    } else {
        clearTracks();
    }
}

// Function to display mock tracks
function displayMockTracks() {
    const tracksContainer = document.getElementById('top-tracks');
    tracksContainer.innerHTML = '';

    mockTracks.forEach((track, index) => {
        const trackElement = createTrackElement(track, index + 1);
        tracksContainer.appendChild(trackElement);
    });
}

// Function to clear tracks
function clearTracks() {
    const tracksContainer = document.getElementById('top-tracks');
    tracksContainer.innerHTML = '';
    currentlyPlaying = null;
}

// Get access token function
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

// Get user's top tracks
async function getUserTopTracks(accessToken) {
    const result = await fetch('https://api.spotify.com/v1/me/top/tracks', {
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    });

    const data = await result.json();
    const topTracksDiv = document.getElementById('top-tracks');
    topTracksDiv.innerHTML = ''; // Clear existing tracks

    // Display only top 5 tracks
    data.items.slice(0, 5).forEach((track, index) => {
        const trackElement = createTrackElement(track, index + 1);
        topTracksDiv.appendChild(trackElement);
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', (event) => {
    const code = new URLSearchParams(window.location.search).get('code');
    const loginButton = document.getElementById('login');

    // Double-click login button to enter test mode
    let clickCount = 0;
    let clickTimer = null;

    loginButton.addEventListener('click', (e) => {
        clickCount++;

        if (clickCount === 1) {
            clickTimer = setTimeout(() => {
                clickCount = 0;
                if (!isTestMode) {
                    // Normal Spotify login
                    const url = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}`;
                    window.location.href = url;
                }
            }, 300);
        } else if (clickCount === 2) {
            clearTimeout(clickTimer);
            clickCount = 0;
            // Toggle test mode on double click
            toggleTestMode();
        }
    });

    // If there's a code in the URL, exchange it for an access token
    if (code) {
        getAccessToken(code).then(function(accessToken) {
            getUserTopTracks(accessToken);
        });
    }
});