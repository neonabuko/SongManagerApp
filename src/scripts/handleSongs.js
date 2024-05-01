import { API_URL } from "./variables"
import axios from "axios"
import general from './general'
import CHUNK_SIZE from './constants'

export default {
  methods: {
    ...general.methods,

    async uploadAsync(baseRoute, file, data) {
      this.uploading = true
      this.setProgressHeader('', '')

      let response

      try {
        response = await this.uploadChunksAsync(file, baseRoute)
      } catch (error) {
        let errorStatus = error.response.status
        let errorMessage
        if (errorStatus === 409) {
          errorMessage = file.name + ' already exists'
        }
        else if (errorStatus === 500) {
          errorMessage = 'Internal server error'
        }
        else {
          errorMessage = 'Unexpected error' + ' ' + errorStatus
        }
        this.setProgressHeader(errorMessage, 'red')
        this.uploading = false
        return
      }

      await this.uploadToRepositoryAsync('/songs', data)

      this.uploading = false
      this.setProgressHeader('Success', 'green')
    },

    createChunkDto(currentChunk, fileName, chunk, totalChunks) {
      const chunkData = new FormData()
      chunkData.append("id", currentChunk)
      chunkData.append("name", fileName)
      chunkData.append("data", chunk)
      chunkData.append("totalChunks", totalChunks)
      return chunkData
    },

    createSongDto(songName, title, author, timeSpan, bitrate) {
      const songData = new FormData()
      songData.append("name", songName)
      songData.append("title", title)
      songData.append("author", author)
      songData.append("duration", timeSpan)
      songData.append("bitrate", bitrate)
      return songData
    },

    createSongEditDto(title, author) {
      const songEditData = new FormData()
      songEditData.append("title", title)
      songEditData.append("author", author)
      return songEditData
    },

    async postChunkAsync(baseRoute, chunkData, startByte, fileSize) {
      return axios.post(API_URL + `${baseRoute}/chunks`, chunkData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: progressEvent => {
          this.uploadProgress = Math.round((startByte + progressEvent.loaded) * 100 / fileSize)
        }
      })
    },

    async uploadChunksAsync(file, baseRoute) {
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE)

      let currentChunk = 1
      let startByte = 0

      while (startByte < file.size) {
        const chunk = file.slice(startByte, startByte + CHUNK_SIZE)
        let chunkData = this.createChunkDto(currentChunk, file.name, chunk, totalChunks)

        let response = await this.postChunkAsync(baseRoute, chunkData, startByte, file.size)

        if (response.status === 202) {
          currentChunk++
          startByte += CHUNK_SIZE
          let progressCount = Math.round((startByte / file.size) * 100)
          this.setProgressHeader(`Progress: ${progressCount}%`, 'white')
          if (progressCount >= 100) this.setProgressHeader('Saving song metadata...', 'white')
        } else if (response.status === 200) {
          return response
        }
      }
    },

    async uploadToRepositoryAsync(endpoint, data) {
      try {
        axios.post(API_URL + endpoint, data)
        this.uploadSuccess = true
      } catch (error) {
        console.error(error.message)
        this.setProgressHeader('Repository save error', 'red')
      }
    },

    setProgressHeader(text, color) {
      this.progressHeader.innerText = text
      this.progressHeader.style.color = color
    },

    async deleteSongAsync(name) {
      let confirmDelete = confirm('Delete permanently?')
      if (confirmDelete) {
        axios.delete(API_URL + `/songs/${name}`).then(() => {
          this.goBack()
        })
      }
    },

    async updateSongAsync() {
      let confirmUpdate = confirm('Confirm update?')
      if (confirmUpdate) {
        var name = this.$refs.name.value
        var title = this.$refs.title.value
        var author = this.$refs.author.value

        let songEditData = this.createSongEditDto(title, author)
        axios.patch(API_URL + `/songs?name=${name}`, songEditData).then(async () => {
          this.goBack()
          await this.getAllSongDataAsync()
        })
      }
    },

    async getAllSongDataAsync() {
      this.$store.state.loading = true
      const songs = await this.fetchAllSongDataAsync()
      this.$store.commit('setSongs', songs)
      this.$store.commit('filterSongs', songs)
      this.$store.state.loading = false
    },

    async getCurrentSongAsync(currentSongName) {
      this.updateAudioRowColor(currentSongName)

      const currentSongUrl = API_URL + '/songs/' + currentSongName
      this.$store.commit('startPlayer', {
        currentSongUrl: currentSongUrl,
        currentSongName: currentSongName
      })
    },

    resetPlayer(currentSongName) {
      this.$store.commit('resetPlayer')
      this.updateAudioRowColor(currentSongName)
    },
  }
}
