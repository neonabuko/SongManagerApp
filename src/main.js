import { createApp } from "vue";
import "./style.css";
import "./components/Navbar.css"
import "./components/song/UploadForm.css"
import "./components/song/AudioRow.css"
import "./components/song/EditForm.css"
import "./components/song/Player.css"
import "./components/score/Score.css"
import "./components/score/ScoreRow.css"
import App from "./App.vue";
import router from "./router/index.js";
import { createStore } from "vuex";
import axios from "axios";
import { API_URL } from "./scripts/variables.js";

const store = createStore({
    state() {
        return {
            songs: [],
            currentSongUrl: '',
            currentSongName: '',
            songSelected: false,
            loading: false,
            isPlaying: false,
            progress: 0,
            currentTime: 0,
            totalTime: 0,
        };
    },
    actions: {
        async fetchAllSongDataAsync() {
            let response = await axios.get(API_URL + "/songs")
            return await response.data
        },
    },
    mutations: {
        setSongs(state, songs) {
            state.songs = songs
        },
        resetPlayer(state) {
            state.currentSongUrl = ''
            state.isPlaying = false
            state.songSelected = false
            state.progress = 0
            state.currentTime = 0
            state.totalTime = 0
        },
        startPlayer(state, { currentSongUrl, currentSongName }) {
            state.currentSongUrl = currentSongUrl
            state.currentSongName = currentSongName
            state.songSelected = true
            state.isPlaying = true
        },
    }
});

createApp(App).use(router).use(store).mount("#app");
