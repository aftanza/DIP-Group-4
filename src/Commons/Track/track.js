import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { createIconSetFromIcoMoon } from '@expo/vector-icons';
import { Play } from './play';
import { TopBar } from './topbar';

const Icon = createIconSetFromIcoMoon(
    require('../../../assets/icomoon/selection.json'),
    'IcoMoon',
    'icomoon.ttf'
);

export const Track = () => {

    const [fontsLoaded] = useFonts({
        IcoMoon: require('../../../assets/icomoon/icomoon.ttf'),
      });
    
      if (!fontsLoaded) {
        return null;
      }

  return (
  <View style={styles.container}>
  <LinearGradient
    colors={['#121212', '#5C4C3F', '#9A7E66']}
    start={{ x: 0, y: 1 }}
    end={{ x: 0, y: 0 }}
    locations={[0.6, 0.8, 1]}
    style={styles.linearGradient}
  >
  <ScrollView showsVerticalScrollIndicator={false}>

    <TopBar></TopBar>

    <Image style={styles.img} source ={ require('../../../assets/songimgtest.jpg')}/>

    <View style ={styles.midbar}>
      <View>
        <Text style={styles.title}>Nightlight</Text>
        <Text style={styles.desc}>crescent moon</Text>
      </View>
      <TouchableOpacity onPress={()=>console.log('queue')}>
      <Icon style={[styles.icon, styles.marg]} name='viewqueue' size={33}/>
      </TouchableOpacity>
    </View>
      
    <Play></Play>

    <View style={styles.lyrics}>
      <Text style={styles.lyrhead}>Lyrics</Text>
      <Text style={styles.text}>"Lorem ipsum dolor sit amet, consectetur adipiscing 
      elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim 
      ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea 
      commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse 
      cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
      sunt in culpa qui officia deserunt mollit anim id est laborum."</Text>
    </View>
  </ScrollView> 
  </LinearGradient>
  </View>

  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },linearGradient: {
      flex: 1,
      alignItems: 'center',
    }, icon:{
      color:'#FFF',
    },

    img:{
      width: 350,
      height: 350,
      borderRadius:10,
      marginTop:20,
    },
    
    midbar:{
      flex:1,
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems: 'center',
      width:350,
    },
    title:{
      color: '#FFF',
      marginTop:30,
      /* Heading 1 */
      fontSize: 25,
      fontWeight: 'bold',
    }, desc:{
      color: '#B3B3B3',
      marginTop:5,
      marginBottom:7,
      /* Body 3 */
      fontSize: 15,
    }, marg:{
      marginRight:10,
      marginTop:15
    },
    
    lyrics:{
      height:'auto',
      width:350,
      backgroundColor: '#665959',
      borderRadius: 10,
      padding: 30,
      paddingBottom:40,
      marginBottom:100,
    }, lyrhead:{
      color: '#FFF',
      /* Heading 2 */
      fontSize: 17,
      fontWeight: 'bold',
    },text:{
      color: '#FFF',
      fontSize: 16,
      marginTop: 25,
      lineHeight:25
    },
});