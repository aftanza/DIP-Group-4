import { Text, TouchableOpacity, View, TextInput, FlatList, Image, Dimensions } from 'react-native'
import { COLORS, SIZES } from '../../../../Constants'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../../../../Store/useAuthStore'
import { SearchTrack } from '../../../../Utilities/SpotifyApi/Utils'
import { useMusicStore } from '../../../../Store/useMusicStore'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
    userQueue_updateRoomQueue,
    userQueue_getRoomQueue,
} from '../../../../Utilities/Firebase/user_queue_functions'
import { addQueue } from '../../../../Commons/UI/toaster'
import { useFonts } from 'expo-font'

export const AddSong = ({ route }) => {
    const { roomID } = route.params || {}
    const insets = useSafeAreaInsets()
    // Initialize navigation
    const navigation = useNavigation()
    const changeCurrentPage = useMusicStore((state) => state.changeCurrentPage)

    useEffect(() => {
        changeCurrentPage('AddSong')
    }, [])

    const [input, setInput] = useState()
    const [data, setData] = useState([])

    const accessToken = useAuthStore((state) => state.accessToken)
    const onChangeText = async (text) => {
        setInput(text)

        if (text.length == 0) setData([])
        // else setData(test);
        else {
            try {
                const trackdata = await SearchTrack({
                    accessToken: accessToken,
                    text: text,
                })
                const trackArray = []
                trackdata.tracks.items.map((track) => {
                    trackArray.push({
                        id: track.id,
                        coverUrl: track.album.images[0].url,
                        title: track.name,
                        artist: track.artists[0].name,
                    })
                })
                setData(trackArray)
            } catch (error) {
                console.error(error)
            }
        }
    }

    const addSongtoRoomQ = async (item) => {
        const storeQueue = await userQueue_getRoomQueue({ roomID: roomID })
        const addedSong = {
            id: item.id,
            title: item.title,
            artist: item.artist,
            img: item.coverUrl,
        }

        let newQueue = []
        if (storeQueue) newQueue = [...storeQueue, addedSong]
        else newQueue = [addedSong]

        userQueue_updateRoomQueue({
            roomID: roomID,
            userRoomQueueList: newQueue,
        })
    }

    const renderItem = ({ item }) => (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 7,
            }}
        >
            <TouchableOpacity
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
                disabled={true}
            >
                {/* SONG IMAGE */}
                <Image
                    style={{
                        width: 50,
                        height: 50,
                        borderRadius: 10,
                        marginRight: 15,
                    }}
                    src={item.coverUrl}
                />
                <View style={{ flex: 1 }}>
                    {/* TITLE AND ARTIST */}
                    <Text
                        numberOfLines={1}
                        ellipsizeMode='tail'
                        style={{ color: '#FFF', fontSize: SIZES.medium }}
                    >
                        {item.title}
                    </Text>
                    <Text style={{ color: COLORS.grey }}>{item.artist}</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    addSongtoRoomQ(item)
                    addQueue()
                }}
            >
                <Ionicons name={'add-circle-outline'} size={35} color={COLORS.light} />
            </TouchableOpacity>
        </View>
    )

    const [fontsLoaded] = useFonts({
        IcoMoon: require('../../../../../assets/icomoon/icomoon.ttf'),
    })

    if (!fontsLoaded) {
        return null
    }

    return (
        <View style={{ backgroundColor: COLORS.dark, flex: 1 }}>
            <View
                style={{
                    paddingTop: insets.top,
                    padding: 20,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}
            >
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ justifyContent: 'center', marginTop: 20 }}
                >
                    <Ionicons name={'arrow-back'} size={25} color={COLORS.grey} />
                </TouchableOpacity>
                <View
                    style={{
                        marginTop: 20,
                        flexDirection: 'row',
                        backgroundColor: '#333',
                        borderRadius: 10,
                        alignItems: 'center',
                        paddingHorizontal: 10,
                    }}
                >
                    <Ionicons name={'ios-search'} size={20} color={COLORS.grey} />
                    <TextInput
                        autoFocus={true}
                        style={{
                            color: COLORS.light,
                            width: 250,
                            fontSize: SIZES.medium,
                            padding: 10,
                        }}
                        placeholder='What do you want to listen to?'
                        placeholderTextColor={COLORS.grey}
                        value={input}
                        onChangeText={onChangeText}
                    />
                </View>
            </View>

            <View style={{ paddingHorizontal: 20 }}>
                <FlatList data={data} renderItem={renderItem} keyExtractor={(item) => item.id} />
            </View>
        </View>
    )
}
