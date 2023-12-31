import { create } from 'zustand'

export const useMusicStore = create((set) => ({
    soundObject: null,
    playlist: [],
    isPlaying: false,
    songInfo: {
        coverUrl: '',
        songTitle: '',
        songArtist: '',
        songAlbum: '',
        songId: '',
    },
    currentPage: '',
    position: 0,
    duration: 0,
    isRepeat: false,

    radioRoom_isDJ: false,
    radioRoom_isBroadcasting: false,
    radioRoom_roomId: '',

    changeCurrentPage: (page) => {
        console.log('changePage', page)
        set(() => ({ currentPage: page }))
    },
    changeSoundObject: (sound) => {
        set(() => ({ soundObject: sound }))
        // console.log('created sound object', sound)
    },
    addToPlaylist: (track) => set(() => ({ playlist: [...playlist, track] })),
    clearPlaylist: () => set(() => ({ playlist: [] })),
    changeIsPlaying: (isPlaying) => set(() => ({ isPlaying: isPlaying })),
    changeSongInfo: (url, title, artist, albumName, id) =>
        set(() => ({
            songInfo: {
                coverUrl: url,
                songTitle: title,
                songArtist: artist,
                songAlbum: albumName,
                songId: id,
            },
        })),
    changePosition: (pos) => set(() => ({ position: pos })),
    changeDuration: (duration) => set(() => ({ duration: duration })),
    changeIsRepeat: (isRepeat) => set(() => ({ isRepeat: isRepeat })),

    changeRadioRoom_isDJ: (isDJ) => set(() => ({ radioRoom_isDJ: isDJ })),
    changeRadioRoom_isBroadcasting: (isBroadcasting) =>
        set(() => ({ radioRoom_isBroadcasting: isBroadcasting })),
    changeRadioRoom_roomId: (roomId) => {
        console.log('changeRoomId', roomId)
        set(() => ({ radioRoom_roomId: roomId }))
    },

    resetPlayer: () => {
        set(() => ({
            soundObject: null,
            isPlaying: false,
            songInfo: {
                coverUrl: '',
                songTitle: '',
                songArtist: '',
                songAlbum: '',
                songId: '',
            },
            position: 0,
            duration: 0,
            isRepeat: false,
        }))
    },
}))
