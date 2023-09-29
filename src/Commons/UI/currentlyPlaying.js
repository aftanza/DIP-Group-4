import { View, Image, TouchableOpacity, Pressable } from 'react-native'
import { Dimensions } from 'react-native'
import { LightText, MediumText } from './styledText'
import { COLORS } from '../../Constants'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useMusicStore } from '../../Store/useMusicStore'
import { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'

const SongProgessBar = ({ currentTime, duration }) => {
  return (
    <View
      style={{
        height: 4,
        backgroundColor: '#100D22',
        borderRadius: 3,
      }}
    >
      <View
        style={{
          width: `${(currentTime / duration) * 100}%`,
          height: '100%',
          backgroundColor: COLORS.light,
          borderRadius: 3,
        }}
      />
    </View>
  )
}

export function CurrentlyPlaying({ duration, currentTime }) {
  const screenWidth = Dimensions.get('window').width
  const songInfo = useMusicStore((state) => state.songInfo)
  const isPlaying = useMusicStore((state) => state.isPlaying)
  const soundObject = useMusicStore((state) => state.soundObject)
  const changeIsPlaying = useMusicStore((state) => state.changeIsPlaying)
  const navigation = useNavigation()

  const play = async () => {
    try {
      await soundObject.playAsync()
    } catch (err) {
      console.log(err)
    }
  }

  const pause = async () => {
    try {
      await soundObject.pauseAsync()
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (soundObject) {
      isPlaying ? play() : pause()
    }
  }, [isPlaying])

  return !soundObject ? null : (
    <Pressable
      style={{
        position: 'absolute',
        width: screenWidth - 20,
        left: 10,
        right: 10,
        height: 70,
        bottom: 100,
        backgroundColor: '#303847',
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
      }}
      onPress={() => {
        navigation.navigate('Track')
      }}
    >
      <Image style={{ width: 50, height: 50 }} src={songInfo.coverUrl} />
      <View
        aria-label='text and bar'
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          height: '100%',
          paddingLeft: 10,
          justifyContent: 'space-around',
        }}
      >
        <View
          aria-label='text and play button box'
          style={{ display: 'flex', flexDirection: 'row' }}
        >
          <View
            aria-label='text box'
            style={{
              flexGrow: 1,
              display: 'flex',
            }}
          >
            <MediumText style={{ color: 'white', fontSize: 14 }}>
              {songInfo.songTitle}
            </MediumText>
            <LightText style={{ color: COLORS.light, fontSize: 12 }}>
              {songInfo.songArtist}
            </LightText>
          </View>
          <TouchableOpacity
            onPress={() => {
              changeIsPlaying(!isPlaying)
            }}
          >
            {/* update state for pause and play */}
            {!isPlaying ? (
              <Ionicons name='play' size={24} color={COLORS.white} />
            ) : (
              <Ionicons name='pause' size={24} color={COLORS.white} />
            )}
          </TouchableOpacity>
        </View>
        <SongProgessBar currentTime={currentTime} duration={duration} />
      </View>
    </Pressable>
  )
}
