const soundscapes = {
    mornings: {
        folder: "Audio/Mornings",
        ambient: "ambient-track.mp3",
        groups: {
            "🎸 Bass": ["bass-one[8].mp3","bass-two[4].mp3","bass-three[4].mp3"],
            "🥁 Rhythm": ["rhythm-drums[4].mp3","rhythm-kick[8].mp3","rhythm-reverse[4].mp3","rhythm-tops[8].mp3"],
            "🎹 Melody": ["melody-one[8].mp3","melody-two[8].mp3","melody-three[4].mp3"],
            "🎼 Harmony": ["harmony-one[4].mp3","harmony-two[4].mp3","harmony-three[4].mp3"],
            "✨ Extras": ["extra-jammy[8].mp3","extra-pad[8].mp3","extra-sweep[4].mp3"]
        }
    },

    moonrise: {
        folder: "Audio/Moonrise",
        ambient: "ambient-track.mp3",
        groups: {
            "🌌 Atmosphere": ["atmo-crunch[4].mp3","atmo-photay[4].mp3","atmo-swirl[16].mp3","atmo-water[4].mp3"],
            "🥁 Rhythm": ["belly-percs[2].mp3","fast-hats[4].mp3","kick-snare[4].mp3","rides[4].mp3"],
            "🎹 Rhodes": ["rhodes-arps[4].mp3","rhodes-chords[4].mp3","rhodes-sad[2].mp3"],
            "🎵 Melody": ["melody-bluesy[8].mp3","melody-soft[8].mp3","melody-trance[4].mp3"],
            "🎸 Sub": ["sub-bouncey[8].mp3","sub-desc[8].mp3","sub-simple[8].mp3"]
        }
    },

    swamp: {
        folder: "Audio/Swamp",
        ambient: "ambient-track.mp3",
        groups: {
            "🎸 Bass": ["bass-long[4].mp3","bass-octave[2].mp3","bass-sequence[2].mp3"],
            "🥁 Rhythm": ["rhythm-breath[4].mp3","rhythm-hats[4].mp3","rhythm-kick[1].mp3","rhythm-snaps[2].mp3","rhythm-snare[4].mp3"],
            "🎹 Piano": ["piano-dark[4].mp3","piano-dreary[4].mp3","piano-drips[4].mp3","piano-theme[4].mp3"],
            "🎼 Harmony": ["harmony-build[4].mp3","harmony-tattletale[4].mp3","harmony-triplets[4].mp3"],
            "✨ Extras": ["extras-critters[4].mp3","extras-riser[8].mp3","extras-texture[4].mp3"]
        }
    }
};

let currentScape = "mornings";
let audioMap = {};
let ambientAudio = null;
let started = false;
let muted = false;

/* ELEMENTS */
const startBtn = document.getElementById("start-button");
const welcome = document.getElementById("welcome-screen");
const app = document.getElementById("app");
const container = document.getElementById("sound-container");
const resetBtn = document.getElementById("reset-btn");
const muteBtn = document.getElementById("mute-btn");

/* =========================
   START
========================= */
startBtn.onclick = () => {
    welcome.classList.add("hidden");
    app.classList.remove("hidden");
    started = true;
    loadScape();
};

/* =========================
   FULL CLEANUP (IMPORTANT)
========================= */
function destroyCurrentAudio() {

    // stop ambient
    if (ambientAudio) {
        ambientAudio.pause();
        ambientAudio.currentTime = 0;
        ambientAudio.src = "";
        ambientAudio = null;
    }

    // stop all layered sounds
    Object.values(audioMap).forEach(obj => {
        obj.audio.pause();
        obj.audio.currentTime = 0;
        obj.audio.src = "";
    });

    audioMap = {};
    container.innerHTML = "";
}

/* =========================
   LOAD SOUNDSCAPE
========================= */
function loadScape() {

    destroyCurrentAudio(); // 🔥 CLEAN OLD WORLD FIRST

    const scape = soundscapes[currentScape];

    ambientAudio = new Audio(`${scape.folder}/${scape.ambient}`);
    ambientAudio.loop = true;
    ambientAudio.volume = muted ? 0 : 0.6;
    ambientAudio.play();

    buildUI();
}

/* =========================
   RESET SYNC PLAYERS
========================= */
function restartAllActive() {

    if (ambientAudio) {
        ambientAudio.currentTime = 0;
        ambientAudio.play();
    }

    Object.values(audioMap).forEach(obj => {
        if (obj.active) {
            obj.audio.currentTime = 0;
            obj.audio.play();
        }
    });
}

/* =========================
   BUILD UI
========================= */
function buildUI() {

    const scape = soundscapes[currentScape];

    Object.entries(scape.groups).forEach(([groupName, sounds]) => {

        const group = document.createElement("div");
        group.className = "group";

        const title = document.createElement("h2");
        title.textContent = groupName;

        group.appendChild(title);

        sounds.forEach(sound => {

            const btn = document.createElement("button");
            btn.className = "sound-btn";
            btn.textContent = sound.replace(".mp3", "");

            const audio = new Audio(`${scape.folder}/${sound}`);
            audio.loop = true;

            audioMap[sound] = { audio, active: false, button: btn };

            btn.onclick = () => {

                const item = audioMap[sound];

                if (!item.active) {

                    item.active = true;
                    btn.classList.add("active");

                    restartAllActive(); // 🔥 sync reset for ALL

                } else {

                    item.active = false;
                    btn.classList.remove("active");

                    item.audio.pause();
                    item.audio.currentTime = 0;
                }
            };

            group.appendChild(btn);
        });

        container.appendChild(group);
    });
}

/* =========================
   RESET BUTTON
========================= */
resetBtn.onclick = () => {

    Object.values(audioMap).forEach(obj => {
        obj.active = false;
        obj.audio.pause();
        obj.audio.currentTime = 0;
        obj.button.classList.remove("active");
    });

    if (ambientAudio) {
        ambientAudio.currentTime = 0;
        ambientAudio.play();
    }
};

/* =========================
   MUTE BUTTON
========================= */
muteBtn.onclick = () => {

    muted = !muted;

    muteBtn.textContent = muted ? "🔊 Unmute" : "🔇 Mute";

    if (ambientAudio) {
        ambientAudio.volume = muted ? 0 : 0.6;
    }

    Object.values(audioMap).forEach(obj => {
        obj.audio.volume = muted ? 0 : 1;
    });
};

/* =========================
   SWITCH SOUNDSCAPE
========================= */
document.querySelectorAll(".soundscape").forEach(btn => {

    btn.onclick = () => {

        document.querySelectorAll(".soundscape")
            .forEach(b => b.classList.remove("active"));

        btn.classList.add("active");

        currentScape = btn.dataset.scape;

        if (started) loadScape();
    };
});