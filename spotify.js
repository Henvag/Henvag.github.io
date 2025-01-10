console.log("spotify.js is loading");

let spotifyAccessToken = null; // Add token storage

let tracksList = [];
let currentTrackIndex = 0;
let isPlaying = false;
let currentAudioPlayer = null;

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
    tracksList = tracks; // Store tracks for controls
    const container = document.getElementById('top-tracks');
    if (!container) {
        console.error('No #top-tracks container found');
        return;
    }

    container.innerHTML = tracks
        .map((track, index) => displayTrack(track, index))
        .join('') + `
        <div class="music-controls">
            <button class="control-btn" onclick="playPrevious()">⏮️</button>
            <button class="control-btn" onclick="togglePlayPause()" id="playPauseBtn">⏸️</button>
            <button class="control-btn" onclick="playNext()">⏭️</button>
        </div>`;
}

// Redirect to Spotify OAuth
function redirectToSpotify() {
    const clientId = 'b717312e3a904a39943442f7f6f11b4b';
    const redirectUri = 'https://henvag.github.io';
    // Add streaming scope
    const scopes = 'user-top-read user-read-playback-state streaming user-modify-playback-state';

    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&show_dialog=true`;
    console.log("Redirecting to Spotify:", authUrl);
    window.location.href = authUrl;
}

// Handle OAuth callback
async function handleSpotifyCallback(code) {
    try {
        spotifyAccessToken = await getAccessToken(code); // Store token
        await getUserTopTracks(spotifyAccessToken);
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
    const response = await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&market=US&limit=5', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Spotify API error: ${errorData.error}`);
    }

    const data = await response.json();
    // Debug preview URLs
    data.items.forEach(track => {
        console.log(`Track: ${track.name}, Preview URL: ${track.preview_url}`);
    });
    displayTracks(data.items);
}

// Display individual track with image and info
function displayTrack(track, index) {
    return `
        <div class="track-item" onclick="playTrack('${track.preview_url || ''}', '${track.uri}', this)">
            <img src="${track.album.images[2].url}" alt="${track.name}" class="track-image">
            <div class="track-info">
                <p class="track-title">${track.name}</p>
                <p class="track-artist">${track.artists[0].name}</p>
            </div>
        </div>
    `;
}



async function playTrack(previewUrl, uri, element) {
    currentTrackIndex = Array.from(document.querySelectorAll('.track-item')).indexOf(element);
    const audioPlayer = document.getElementById('audio-player');
    currentAudioPlayer = audioPlayer;

    if (previewUrl) {
        try {
            console.log('Setting audio source to:', previewUrl);
            audioPlayer.src = previewUrl;
            audioPlayer.load(); // Ensure audio is loaded

            // Add event listeners for debugging
            audioPlayer.addEventListener('error', (e) => {
                console.error('Audio player error:', e);
            });

            audioPlayer.addEventListener('loadstart', () => {
                console.log('Audio loading started');
            });

            audioPlayer.addEventListener('canplay', () => {
                console.log('Audio can play');
            });

            await audioPlayer.play();
            console.log('Audio playback started');
            updatePlayingState(element);
        } catch (error) {
            console.error('Preview playback failed:', error);
            await playFullTrack(uri, element);
        }
    } else {
        console.log('No preview URL available, trying full track');
        await playFullTrack(uri, element);
    }

    // Update play button state after successful playback
    const playPauseBtn = document.getElementById('playPauseBtn');
    if (playPauseBtn) {
        playPauseBtn.textContent = '⏸️';
        isPlaying = true;
    }
}




async function playFullTrack(uri, element) {
    if (!spotifyAccessToken) {
        console.error('No access token available');
        return;
    }

    try {
        // First check for active devices
        const devices = await fetch('https://api.spotify.com/v1/me/player/devices', {
            headers: {
                'Authorization': `Bearer ${spotifyAccessToken}`
            }
        });
        const deviceData = await devices.json();
        console.log('Available devices:', deviceData);

        if (!deviceData.devices.length) {
            console.error('No active Spotify devices found');
            alert('Please open Spotify on any device to enable playback');
            return;
        }

        // Try to play on active device
        const response = await fetch('https://api.spotify.com/v1/me/player/play', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${spotifyAccessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uris: [uri],
                device_id: deviceData.devices[0].id
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Playback error:', error);
            throw new Error(error.error.message);
        }

        updatePlayingState(element);
    } catch (error) {
        console.error('Full track playback failed:', error);
        alert('Please ensure Spotify is open and you have an active Premium subscription');
    }
}

function updatePlayingState(element) {
    document.querySelectorAll('.track-item').forEach(item => {
        item.classList.remove('playing');
    });
    element.classList.add('playing');
}



let isPlaying = false;
let currentAudioPlayer = null;

function togglePlayPause() {
    const audioPlayer = document.getElementById('audio-player');
    const playPauseBtn = document.getElementById('playPauseBtn');

    if (!audioPlayer.src || audioPlayer.src === '') {
        // No track loaded, start playing current track
        const currentTrack = tracksList[currentTrackIndex];
        if (currentTrack) {
            playTrack(currentTrack.preview_url || '', currentTrack.uri,
                     document.querySelectorAll('.track-item')[currentTrackIndex]);
        }
    } else {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseBtn.textContent = '⏸️';
            isPlaying = true;
        } else {
            audioPlayer.pause();
            playPauseBtn.textContent = '▶️';
            isPlaying = false;
        }
    }
}

function playNext() {
    if (currentTrackIndex < tracksList.length - 1) {
        currentTrackIndex++;
        const nextTrack = tracksList[currentTrackIndex];
        const trackElement = document.querySelectorAll('.track-item')[currentTrackIndex];
        playTrack(nextTrack.preview_url || '', nextTrack.uri, trackElement);
    }
}

function playPrevious() {
    if (currentTrackIndex > 0) {
        currentTrackIndex--;
        const prevTrack = tracksList[currentTrackIndex];
        const trackElement = document.querySelectorAll('.track-item')[currentTrackIndex];
        playTrack(prevTrack.preview_url || '', prevTrack.uri, trackElement);
    }
}