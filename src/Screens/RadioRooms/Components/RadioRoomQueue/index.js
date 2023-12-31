import {View, Text, Button, StyleSheet, TouchableOpacity, FlatList, PanResponder, Animated, Dimensions} from 'react-native';
import { Image } from 'expo-image';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Draggable from 'react-native-draggable';
import DraggableFlatList from "react-native-draggable-flatlist";
import "react-native-gesture-handler";
import { GestureHandlerRootView, PanGestureHandler, State} from 'react-native-gesture-handler';
import { GetQueue, GetCurrentUserProfile} from '../../../../Utilities/SpotifyApi/Utils'
import { useAuthStore } from '../../../../Store/useAuthStore'
import { useQueueStore } from '../../../../Store/useQueueStore'
import { useMusicStore } from '../../../../Store/useMusicStore'
import { red, white } from 'color-name';
import { useUserCurrentQueue } from '../../../../Utilities/Firebase/useFirebaseListener';
import {
    userQueue_getQueue,
    userQueue_updateQueue,
} from '../../../../Utilities/Firebase/user_queue_functions'


export const RadioRoomQueue = ({navigation}) => {

    const [play, setPlay] = useState(false);

    const storeQueue = useQueueStore((state) => state.queue)
    const changeQueue = useQueueStore((state) => state.changeQueue)
    const storeCurrTrack = useMusicStore((state) => state.songInfo)

    const toggleImage = () => {
      setPlay(!play)
    }; 

    // Generating list of songs from store
    const generateSongs = () => {        
        return (<DraggableFlatList
          data={storeQueue}
          onDragEnd={({data}) => {changeQueue(data)}}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          style={{ height: (47/100)*Math.round(Dimensions.get('window').height)}}
          renderItem={({ item, drag, isActive }) => (
            <TouchableOpacity 
                style={styles.songInQ} 
                onLongPress={drag} 
                background={isActive ? "gray300" : "white"} 
                minPressDuration={150}
            >
                <View>
                    <Text style={styles.songName}>{item.title}</Text>
                    <Text style={styles.artistName}>{item.artist}</Text>
                </View>
                <Image
                    style={styles.draggable}
                    source={require("../../../../../assets/draggable.png")}
                />
            </TouchableOpacity>
        )}
        />);
    };
    
    return (
        <GestureHandlerRootView style={styles.container}>
            <Text style={styles.header}>Now Playing</Text>
            <View style={styles.playingNow}>
                <Image
                    style={styles.playlistImage}
                    source={storeCurrTrack.coverUrl}
                /> 
                <View style={styles.songDets}>
                    <Text style={styles.currSong}>
                        {storeCurrTrack.songTitle}
                    </Text>
                    <Text style={styles.currArtistName}>
                        {storeCurrTrack.songArtist}
                    </Text>
                </View>
            </View>
            <Text style={styles.header}>Next In Queue</Text>

            {generateSongs()}
            {/* Insert music status bar */}

            <View style={styles.musicPlayer}>
                <TouchableOpacity>
                    <Image
                        style={styles.skip}
                        source={require("../../../../../assets/skipPrev.png")}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleImage}>
                    <Image
                        style={styles.playCircle}
                        source={require("../../../../../assets/playCircle.png")}
                    />
                    <Image
                        style={play ? styles.play : styles.pause}
                        source={play ? require("../../../../../assets/play.png") : require("../../../../../assets/pause.png")}
                    />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image
                        style={styles.skip}
                        source={require("../../../../../assets/skipNext.png")}
                    />
                </TouchableOpacity>
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'flex-end',
        paddingTop: 10,
        paddingLeft: 25,
        paddingRight: 25,
        paddingBottom: 80,
        backgroundColor: '#13151e',
    },  
    header: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 10,
    },
    playlistImage: {
        width: 81,
        height: 81,
    },
    playingNow: {
        flexDirection: 'row',
        marginBottom: 28,
    },
    songDets: {
        justifyContent: 'center',
        padding: 10,
    },
    currSong: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#41BBC4',
    },
    currArtistName: {
        fontSize: 15,
        color: '#B3B3B3',
    },
    songInQ: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    songName: {
        fontSize: 16,
        color: '#FFFFFF',
    },
    artistName: {
        fontSize: 13,
        color: '#B3B3B3',
    },
    draggable: {
        width: 20,
        height: 10,
    },
    musicPlayer: {
        height: 60, 
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },  
    skip: {
        width: 29,
        height: 25,
        margin: 30,
    },
    playCircle: {
        width: 60,
        height: 60,
    },
    play: {
        width: 21,
        height: 25,
        position: 'absolute',
        top: 18,
        left: 21,
    },
    pause: {
        width: 20,
        height: 22,
        position: 'absolute',
        top: 19,
        left: 20,
    },
})

