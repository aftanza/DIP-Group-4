// Music player bar used in track.js

import React, { useEffect, useState } from 'react'
import {StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native'
import { useFonts } from 'expo-font'
import { createIconSetFromIcoMoon } from '@expo/vector-icons'
import Slider from '@react-native-community/slider'
import { useAuthStore } from '../../Store/useAuthStore'
import { useMusicStore } from '../../Store/useMusicStore'
import { useQueueStore } from '../../Store/useQueueStore'
import { COLORS } from '../../Constants'
import { GetTrack } from '../../Utilities/SpotifyApi/Utils'
import { Audio } from 'expo-av'
import { userQueue_updateQueue } from '../../Utilities/Firebase/user_queue_functions'

const Icon = createIconSetFromIcoMoon(
    require('../../../assets/icomoon/selection.json'),
    'IcoMoon',
    'icomoon.ttf'
)

export const Play = ({previousPage}) => {
    const [localPosition, setLocalPosition] = useState(0)

    // music store
    const isPlaying = useMusicStore((state) => state.isPlaying)
    const changeIsPlaying = useMusicStore((state) => state.changeIsPlaying)
    const position = useMusicStore((state) => state.position)
    const duration = useMusicStore((state) => state.duration)
    const changePosition = useMusicStore((state) => state.changePosition)
    const changeSoundObject = useMusicStore((state) => state.changeSoundObject)
    const soundObject = useMusicStore((state) => state.soundObject)
    const isRepeat = useMusicStore((state) => state.isRepeat)
    const changeIsRepeat = useMusicStore((state) => state.changeIsRepeat)
    const songInfo = useMusicStore((state) => state.songInfo)
    const changeCurrentPage = useMusicStore((state) => state.changeCurrentPage)
    const changeSongInfo = useMusicStore((state) => state.changeSongInfo)
    const changeDuration = useMusicStore((state) => state.changeDuration)

    const radioRoom_isDJ = useMusicStore((state) => state.radioRoom_isDJ)

    // queue store
    const queue = useQueueStore((state) => state.queue)
    const changeQueue = useQueueStore((state) => state.changeQueue)
    const isShuffle = useQueueStore((state) => state.isShuffle)
    const changeIsShuffle = useQueueStore((state) => state.changeIsShuffle)

    // auth store
    const accessToken = useAuthStore((state) => state.accessToken)
    const userId = useAuthStore((state) => state.userId)

    useEffect(() => {
        console.log(previousPage)

    }, []);

    useEffect(() => {
        setLocalPosition(position)
    }, [position])

    const [fontsLoaded] = useFonts({
        IcoMoon: require('../../../assets/icomoon/icomoon.ttf'),
    })
    if (!fontsLoaded) {
        return null
    }

    const formatTime = (value) => {
        const totalSeconds = value / 1000
        const minutes = Math.floor(totalSeconds / 60)
        const seconds = Math.round(totalSeconds % 60)
        return `${minutes.toString().padStart(2, '0')}:${seconds
            .toString()
            .padStart(2, '0')}`
    }

    const togglePlay = () => {
        if(previousPage !== 'Chatroom'){
            changeIsPlaying(!isPlaying)
        }else{
            if(radioRoom_isDJ){
                changeIsPlaying(!isPlaying)
            } else {
                Alert.alert('Dj permissions', 'Not a DJ',
                  [
                    {text: 'OK :(', onPress: () => console.log('OK Pressed')},
                    ]
                )
            }
        }
    }

    const handleSlider = async (value) => {
        if(previousPage !== 'Chatroom'){
            changePosition(value)
            await soundObject.setPositionAsync(value)
        }else{
            if(radioRoom_isDJ){
                changePosition(value)
                await soundObject.setPositionAsync(value)
            } else {
                Alert.alert('Dj permissions', 'Not a DJ',
                  [
                      {text: 'OK :(', onPress: () => console.log('OK Pressed')},
                  ]
                )
            }
        }
    }

    const handlePrev = async () => {
        if(previousPage !== 'Chatroom'){
            changeIsPlaying(false)
            await soundObject.setPositionAsync(0)
            changePosition(0)
            changeIsPlaying(true)
        }else{
            if(radioRoom_isDJ){
                changeIsPlaying(false)
                await soundObject.setPositionAsync(0)
                changePosition(0)
                changeIsPlaying(true)
            } else {
                Alert.alert('Dj permissions', 'Not a DJ',
                  [
                      {text: 'OK :(', onPress: () => console.log('OK Pressed')},
                  ]
                )
            }
        }
    }

    const handleNextSong = (trackId) => {

        const createSoundObject = async (uri) => {
            // clear previous song
            if (soundObject) {
                changeIsPlaying(false)
                soundObject.unloadAsync()
            }
            const { sound } = await Audio.Sound.createAsync({ uri: uri })
            changeSoundObject(sound)
            changeIsPlaying(true)
        }

        const getTrackData = async () => {
            try {
                const trackData = await GetTrack({
                    accessToken: accessToken,
                    trackId: trackId,
                })
                changeSongInfo(
                    trackData.album.images[0].url,
                    trackData.name,
                    trackData.artists[0].name,
                    trackData.album.name
                )
                createSoundObject(trackData.preview_url)
            } catch (err) {
                console.error(err)
            }
        }
        changeIsPlaying(false)
        getTrackData()
    }

    const handleNext = async () => {
        if(previousPage !== 'Chatroom'){
            if (queue.length !== 0) {
                if (isShuffle){
                    const index = Math.floor(Math.random()*(queue.length+1))
                    const currSong = queue[index]
                    queue.splice(index, 1)
                    changeQueue(queue)
                    handleNextSong(currSong.id)
                    userQueue_updateQueue({ userID: userId, userQueueList: queue})
                } else {
                    const currSong = queue[0]
                    changeQueue(queue.slice(1))
                    handleNextSong(currSong.id)
                    userQueue_updateQueue({ userID: userId, userQueueList: queue})
                }
            } else {
                changeIsPlaying(false)
                await soundObject.setPositionAsync(0)
                changePosition(0)
            }
        }else{
            if(radioRoom_isDJ){
                if (queue.length !== 0) {
                    const currSong = queue[0]
                    changeQueue(queue.slice(1))
                    handleNextSong(currSong.id)
                } else {
                    changeIsPlaying(false)
                    await soundObject.setPositionAsync(0)
                    changePosition(0)
                }
            } else {
                Alert.alert('Dj permissions', 'Not a DJ',
                  [
                      {text: 'OK :(', onPress: () => console.log('OK Pressed')},
                  ]
                )
            }
        }
    }

    return (
        <View style={styles.container}>
            {/* SLIDER */}
            <Slider
                style={{ width: 350, height: 40, marginBottom: -5 }}
                minimumValue={0}
                maximumValue={duration}
                value={localPosition}
                onValueChange={(value) => setLocalPosition(value)}
                onSlidingComplete={(value) => handleSlider(value)}
                minimumTrackTintColor='#FFFFFF'
                maximumTrackTintColor='#777777'
                thumbTintColor='#FFF'
            />

            {/* NUMBERS */}
            <View style={styles.progress}>
                <Text style={styles.text}>{formatTime(localPosition)}</Text>
                <Text style={styles.text}>{formatTime(duration)}</Text>
            </View>

            {/* CONTROLS */}
            <View style={styles.controls}>
                <TouchableOpacity onPress={() => changeIsShuffle(!isShuffle)}>
                    <Icon style={[styles.icon, {
                        color: isShuffle ? COLORS.primary : COLORS.white,
                    }]} 
                    name='shuffle' size={25} />
                </TouchableOpacity>

                <TouchableOpacity onPress={handlePrev}>
                    <Icon style={styles.icon} name='back' size={30} />
                </TouchableOpacity>

                <TouchableOpacity onPress={togglePlay}>
                    <Icon
                        style={styles.icon}
                        name={isPlaying ? 'pause' : 'play'} // Set the name based on the state
                        size={65}
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={handleNext}>
                    <Icon
                        style={[styles.icon, styles.rot]}
                        name='back'
                        size={30}
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => changeIsRepeat(!isRepeat)}>
                    <Icon
                        style={{
                            color: isRepeat ? COLORS.primary : COLORS.white,
                        }}
                        name='repeat'
                        size={25}
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 10,
    },
    progress: {
        width: 350,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    text: {
        color: '#B2B2B2',
        fontSize: 12,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        paddingBottom: 35,
        paddingTop: 20,
    },
    icon: {
        color: '#FFF',
    },
    rot: {
        transform: [{ rotateY: '180deg' }],
    },
})
