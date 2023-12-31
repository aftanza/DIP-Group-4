import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { createIconSetFromIcoMoon } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BackgroundImage } from '@rneui/base'
import { room_queue_updateQueue } from '../../Utilities/Firebase/room_queue_functions';

const Icon = createIconSetFromIcoMoon(
  require('../../../assets/icomoon/selection.json'),
  'IcoMoon',
  'icomoon.ttf'
);

const Item = props => {
return(
<TouchableOpacity style={styles.segment} onPress={props.do} > 
  <Icon style={styles.icon} name={props.iconname} size={20}/>
  <Text style={styles.text}>{props.text}</Text>
</TouchableOpacity>
)
}

export const TrackInfo = () => {
  // Initialize navigation
  
  const navigation = useNavigation()
  const route = useRoute()
  const img = route.params.image
  const title = route.params.title
  const artist = route.params.artist
  const trackId = route.params.trackId
  const [fontsLoaded] = useFonts({
    IcoMoon: require('../../../assets/icomoon/icomoon.ttf'),
  });
  if (!fontsLoaded) {
    return null;
  }

  const handleClick = () => {
    if(trackId){
      // const roomID='123qweasd'
      room_queue_updateQueue({queueList: ["05XoZNL3OMdegGO0SnrHWD", "05XoZNL3OMdegGO0SnrHWDsdf", "05XoZNL3OMdegGO0SnrHWDsdjhfb"]})
      navigation.navigate('Track', {setpop: true})
    }
  }
  
  return (
  <View style={styles.container}>
    <BackgroundImage style={styles.container} src={img} blurRadius={90}>
    <LinearGradient
      colors={['#121212', 'transparent']}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      locations={[0.5, 1]}
      style={styles.linearGradient}
    >
      <Image style={styles.img} src = {img}/>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.desc}>{artist}</Text>
    {/* album, hide, addsong, addqueue, user, users */}
      {/* <Item text='Hide song' iconname = 'hide'></Item> */}
      <Item text='Add to playlist' iconname = 'addsong' ></Item>
      <Item text='Add to queue' iconname = 'addqueue' do={() =>handleClick()}></Item>
      <Item text='View album' iconname = 'album'></Item>
      {/* <Item text='View artist' iconname = 'user'></Item>
      <Item text='Song credits' iconname = 'users'></Item> */}
      <TouchableOpacity style={styles.segment1} onPress={() => navigation.goBack()} > 
        <Text style={styles.text}>Close</Text>
      </TouchableOpacity>
      
    </LinearGradient>
    </BackgroundImage>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
  },linearGradient: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
  }, title:{
    color: '#FFF',
    textAlign: 'center',
    marginTop:30,
    /* Heading 2 */
    fontSize: 17,
    fontWeight: 'bold',
  }, desc:{
    color: '#B3B3B3',
    marginTop:5,
    marginBottom:32,
    /* Body 3 */
    fontSize: 15,
  }, segment:{
    display: 'flex',
    flexDirection:  'row',
    width:320,
    padding: 16,
    // CHECK SIZE OF SEGMENT
    // borderColor: '#bbb',
    // borderWidth: 1,
    // borderStyle: "dashed",
    // borderRadius: 10,
  },text:{
    color: '#FFF',
    fontSize: 16,
  }, img:{
    width: 164,
    height: 164,
    borderRadius:10,
    marginTop:100,
  }, icon:{
    marginRight:15,
    color: "#FFF",
  }, segment1:{
    display: 'flex',
    flexDirection:  'row',
    padding: 16,
    bottom: -60
  },
});