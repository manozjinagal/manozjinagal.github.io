// ═══════════════════════════════════════════════════
// music-player.js — Space Portfolio Music Player
// Loads tracks from public/audio/music.json
// Persists state across pages via localStorage
// ═══════════════════════════════════════════════════

(function() {
  'use strict';

  // ── STATE ──
  let tracks      = [];
  let currentIdx  = 0;
  let isPlaying   = false;
  let audio       = null;
  let playerEl    = null;
  let playlistEl  = null;
  let playlistOpen= false;

  // Persist which track + position across page navigation
  function saveState() {
    try {
      localStorage.setItem('mj_music_idx',   currentIdx);
      localStorage.setItem('mj_music_time',  audio ? audio.currentTime : 0);
      localStorage.setItem('mj_music_vol',   audio ? audio.volume      : 0.6);
      localStorage.setItem('mj_music_play',  isPlaying ? '1' : '0');
    } catch(_) {}
  }

  function loadState() {
    try {
      return {
        idx:     parseInt(localStorage.getItem('mj_music_idx')  || '0'),
        time:    parseFloat(localStorage.getItem('mj_music_time')|| '0'),
        vol:     parseFloat(localStorage.getItem('mj_music_vol') || '0.6'),
        playing: localStorage.getItem('mj_music_play') === '1',
      };
    } catch(_) {
      return { idx: 0, time: 0, vol: 0.6, playing: false };
    }
  }

  // ── BUILD PLAYER HTML ──
  function buildPlayer() {
    const nav = document.getElementById('nav');
    if (!nav) return;

    const wrap = document.createElement('div');
    wrap.id = 'music-player';
    wrap.innerHTML = `
      <!-- Animated visualizer bars -->
      <div class="music-viz">
        <span></span><span></span><span></span><span></span>
      </div>

      <!-- Track info -->
      <div class="music-info">
        <div class="music-title" id="mp-title">No Signal</div>
        <div class="music-artist" id="mp-artist">// Load a track</div>
      </div>

      <!-- Controls -->
      <div class="music-controls">
        <button class="music-btn prev-btn" id="mp-prev" title="Previous">&#9664;&#9664;</button>
        <button class="music-btn" id="mp-play" title="Play / Pause">&#9654;</button>
        <button class="music-btn next-btn" id="mp-next" title="Next">&#9654;&#9654;</button>
        <input class="music-vol" id="mp-vol" type="range" min="0" max="1" step="0.05" value="0.6" title="Volume"/>
        <button class="music-btn" id="mp-list" title="Playlist">&#9776;</button>
      </div>

      <!-- Thin progress bar at bottom -->
      <div class="music-progress-wrap" id="mp-prog-wrap">
        <div class="music-progress-bar" id="mp-prog"></div>
      </div>

      <!-- Playlist dropdown -->
      <div class="music-playlist" id="mp-playlist">
        <div class="playlist-header">// Signal Frequencies</div>
        <div id="mp-playlist-items">
          <div class="pl-empty">No tracks loaded.<br/>Drop .mp3 files into<br/><code>public/audio/</code><br/>then run:<br/><code>node scripts/generate-music.js</code></div>
        </div>
      </div>
    `;

    nav.appendChild(wrap);
    playerEl  = wrap;
    playlistEl = wrap.querySelector('#mp-playlist');

    // Wire events
    wrap.querySelector('#mp-play').addEventListener('click', togglePlay);
    wrap.querySelector('#mp-prev').addEventListener('click', prevTrack);
    wrap.querySelector('#mp-next').addEventListener('click', nextTrack);
    wrap.querySelector('#mp-vol').addEventListener('input', e => {
      if (audio) audio.volume = parseFloat(e.target.value);
      saveState();
    });
    wrap.querySelector('#mp-list').addEventListener('click', e => {
      e.stopPropagation();
      playlistOpen = !playlistOpen;
      playlistEl.classList.toggle('open', playlistOpen);
    });
    wrap.querySelector('#mp-prog-wrap').addEventListener('click', e => {
      if (!audio || !tracks.length) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const pct  = (e.clientX - rect.left) / rect.width;
      audio.currentTime = pct * audio.duration;
    });

    // Close playlist on outside click
    document.addEventListener('click', e => {
      if (!wrap.contains(e.target)) {
        playlistOpen = false;
        playlistEl.classList.remove('open');
      }
    });
  }

  // ── BUILD AUDIO ELEMENT ──
  function buildAudio() {
    audio = new Audio();
    audio.preload  = 'metadata';
    audio.loop     = false;

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended',      nextTrack);
    audio.addEventListener('error',      () => {
      console.warn('Audio error, skipping to next track');
      setTimeout(nextTrack, 500);
    });
    audio.addEventListener('canplay', () => {
      if (isPlaying) audio.play().catch(() => {});
    });
  }

  // ── LOAD TRACK ──
  function loadTrack(idx, autoplay) {
    if (!tracks.length) return;
    idx = ((idx % tracks.length) + tracks.length) % tracks.length;
    currentIdx = idx;
    const t = tracks[idx];

    audio.src = t.path;
    audio.load();

    // Update UI
    document.getElementById('mp-title').textContent  = t.title;
    document.getElementById('mp-artist').textContent = '// ' + t.artist;
    document.getElementById('mp-prog').style.width   = '0%';

    // Update playlist highlight
    document.querySelectorAll('.playlist-item').forEach((el, i) => {
      el.classList.toggle('active', i === idx);
    });

    if (autoplay) {
      isPlaying = true;
      audio.play().catch(() => { isPlaying = false; updatePlayBtn(); });
    }

    updatePlayBtn();
    saveState();
  }

  // ── CONTROLS ──
  function togglePlay() {
    if (!tracks.length) return;
    if (!audio.src || audio.src === window.location.href) {
      loadTrack(currentIdx, true);
      return;
    }
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
    } else {
      audio.play().catch(() => {});
      isPlaying = true;
    }
    updatePlayBtn();
    saveState();
  }

  function prevTrack() {
    loadTrack(currentIdx - 1, isPlaying);
  }

  function nextTrack() {
    loadTrack(currentIdx + 1, isPlaying);
  }

  // ── UI UPDATES ──
  function updatePlayBtn() {
    const btn = document.getElementById('mp-play');
    if (!btn) return;
    btn.innerHTML   = isPlaying ? '&#9646;&#9646;' : '&#9654;';
    btn.title       = isPlaying ? 'Pause' : 'Play';
    btn.classList.toggle('active', isPlaying);
    playerEl.classList.toggle('playing', isPlaying);
  }

  function updateProgress() {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    const bar = document.getElementById('mp-prog');
    if (bar) bar.style.width = pct + '%';
  }

  // ── RENDER PLAYLIST ──
  function renderPlaylist() {
    const container = document.getElementById('mp-playlist-items');
    if (!container) return;

    if (!tracks.length) {
      container.innerHTML = `<div class="pl-empty">No tracks loaded.<br/>Drop .mp3 files into<br/><code>public/audio/</code><br/>then run:<br/><code>node scripts/generate-music.js</code></div>`;
      return;
    }

    container.innerHTML = tracks.map((t, i) => `
      <div class="playlist-item${i === currentIdx ? ' active' : ''}" data-idx="${i}">
        <span class="pl-num">${String(i + 1).padStart(2, '0')}</span>
        <div class="pl-info">
          <div class="pl-title">${t.title}</div>
          <div class="pl-artist">${t.artist}</div>
        </div>
      </div>`).join('');

    container.querySelectorAll('.playlist-item').forEach(el => {
      el.addEventListener('click', () => {
        loadTrack(parseInt(el.dataset.idx), true);
        playlistOpen = false;
        playlistEl.classList.remove('open');
      });
    });
  }

  // ── INIT ──
  async function init() {
    buildPlayer();
    buildAudio();

    // Restore volume
    const state = loadState();
    audio.volume = state.vol;
    const volEl  = document.getElementById('mp-vol');
    if (volEl) volEl.value = state.vol;

    // Load music manifest
    try {
      const res  = await fetch('public/audio/music.json');
      if (!res.ok) throw new Error('music.json not found');
      const data = await res.json();
      tracks     = data.tracks || [];

      if (tracks.length) {
        // Restore last track + position
        const savedIdx = Math.min(state.idx, tracks.length - 1);
        currentIdx = savedIdx;
        loadTrack(savedIdx, false);

        // Restore time after metadata loads
        audio.addEventListener('loadedmetadata', () => {
          if (state.time > 0 && state.time < audio.duration) {
            audio.currentTime = state.time;
          }
        }, { once: true });

        // If was playing, try to resume (may need user gesture)
        if (state.playing) {
          audio.play()
            .then(() => { isPlaying = true; updatePlayBtn(); })
            .catch(() => { isPlaying = false; updatePlayBtn(); });
        }
      }
    } catch(_) {
      // No music.json or empty — show empty state
      tracks = [];
    }

    renderPlaylist();
    updatePlayBtn();

    // Save state before navigating away
    window.addEventListener('beforeunload', saveState);

    // Keyboard shortcut: Space = play/pause (when not in input)
    document.addEventListener('keydown', e => {
      if (e.code === 'Space' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        togglePlay();
      }
      if (e.code === 'ArrowRight' && e.altKey) nextTrack();
      if (e.code === 'ArrowLeft'  && e.altKey) prevTrack();
    });
  }

  // Start when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
