import * as React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from '@expo/vector-icons/Ionicons'

import { Home } from '../Screens/Home'
import { Search, SearchClick } from '../Screens/Search'
import { RadioRooms } from '../Screens/RadioRooms'
import { Profile } from '../Screens/Profile'
import { EditProfile } from '../Screens/Profile/EditProfile'
import { Login } from '../Screens/Login'

import { Fragment } from 'react'
import { useAuthStore } from '../Store/useAuthStore'
import { Playlist } from '../Commons/Playlist'
import { TestAPI } from '../Screens/TestAPI'
import { COLORS, SIZES } from '../Constants'
import { CurrentlyPlaying } from '../Commons/UI/currentlyPlaying'
import { Queue } from '../Screens/Queue'
import { Chatroom } from '../Screens/RadioRooms/Components/Chatroom'
import { CreateRoom } from '../Screens/RadioRooms/Components/CreateRoom'
import { RadioRoomQueue } from '../Screens/RadioRooms/Components/RadioRoomQueue'
import { RoomQueue } from '../Screens/RadioRooms/Components/RoomQueue'
import { AddSong } from '../Screens/RadioRooms/Components/AddSong'

// Track
import { Track } from '../Commons/Track/track'
import { useMusicStore } from '../Store/useMusicStore'
import { RoomDetails } from '../Screens/RadioRooms/Components/RoomDetails'

const Stack = createNativeStackNavigator()
const ProfileStack = createNativeStackNavigator()
const SearchStack = createNativeStackNavigator()
const RadioRoomStack = createNativeStackNavigator()
const HomeStack = createNativeStackNavigator()

const Tab = createBottomTabNavigator()

// Navigation after user LOG IN
function HomeTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, size }) => {
                    let iconName

                    // Determine the iconName based on the route name
                    if (route.name === 'Home') {
                        iconName = 'ios-home'
                    } else if (route.name === 'Search') {
                        iconName = 'ios-search'
                    } else if (route.name === 'JamRooms') {
                        iconName = 'ios-folder'
                    } else if (route.name === 'Profile') {
                        iconName = 'ios-person'
                    }

                    return (
                        <Ionicons
                            name={iconName}
                            size={size}
                            color={focused ? COLORS.primary : COLORS.grey}
                        />
                    )
                },
                tabBarInactiveTintColor: COLORS.grey,
                tabBarActiveTintColor: COLORS.primary,
                tabBarStyle: {
                    backgroundColor: COLORS.dark,
                    paddingVertical: SIZES.small,
                },
                headerShown: false,
                tabBarLabelStyle: {
                    fontFamily: 'InterMedium',
                },
            })}
        >
            <Tab.Screen
                name='Home'
                component={HomeStackNavigator}
                options={{ unmountOnBlur: true }}
            />
            <Tab.Screen
                name='Search'
                component={SearchStackNavigator}
                options={{ unmountOnBlur: true }}
            />
            {/*Really dont know if radioRoom can be unmounted or not. For now unmount*/}
            <Tab.Screen
                name='JamRooms'
                component={RadioRoomStackNavigator}
                options={{ unmountOnBlur: true }}
            />
            <Tab.Screen
                name='Profile'
                component={ProfileStackNavigator}
                options={{ unmountOnBlur: true }}
            />
            {/* <Tab.Screen name='TestAPI' component={TestAPI} /> */}
        </Tab.Navigator>
    )
}

// Navigation before user LOG IN
function AuthStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Login' component={Login} />
        </Stack.Navigator>
    )
}

function HomeStackNavigator() {
    return (
        <HomeStack.Navigator screenOptions={{ headerShown: false }}>
            <HomeStack.Screen name='HomeTab' component={Home} />
            <HomeStack.Screen name='Track' component={Track} />
            <HomeStack.Screen name='Playlist' component={Playlist} />
            {/*<ProfileStack.Screen name='CreateRoom' component={CreateRoom} />*/}
        </HomeStack.Navigator>
    )
}

function ProfileStackNavigator() {
    return (
        <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
            <ProfileStack.Screen name='ProfileTab' component={Profile} />
            <ProfileStack.Screen name='EditProfile' component={EditProfile} />
            <ProfileStack.Screen name='Track' component={Track} />
            <ProfileStack.Screen name='Playlist' component={Playlist} />
            {/*<ProfileStack.Screen name='CreateRoom' component={CreateRoom} />*/}
        </ProfileStack.Navigator>
    )
}

function SearchStackNavigator() {
    return (
        <SearchStack.Navigator screenOptions={{ headerShown: false }}>
            <SearchStack.Screen name='SearchTab' component={Search} />
            <SearchStack.Screen name='SearchClick' component={SearchClick} />
            <SearchStack.Screen name='Track' component={Track} />
            <SearchStack.Screen name='Playlist' component={Playlist} />
        </SearchStack.Navigator>
    )
}

function RadioRoomStackNavigator() {
    return (
        <RadioRoomStack.Navigator screenOptions={{ headerShown: false }}>
            <RadioRoomStack.Screen name='RadioRoom' component={RadioRooms} />
            <RadioRoomStack.Screen name='Chatroom' component={Chatroom} />
            <RadioRoomStack.Screen name='RoomDetails' component={RoomDetails} />
            <RadioRoomStack.Screen name='CreateRoom' component={CreateRoom} />
            <RadioRoomStack.Screen name='Track' component={Track} />
            <RadioRoomStack.Screen name='Playlist' component={Playlist} />
            <RadioRoomStack.Screen name='RoomQueue' component={RoomQueue} />
            <RadioRoomStack.Screen name='AddSong' component={AddSong} />
        </RadioRoomStack.Navigator>
    )
}

export const Navigation = () => {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
    const currentPage = useMusicStore((state) => state.currentPage)

    return (
        <React.Fragment>
            <Stack.Navigator
                screenOptions={{
                    headerBackTitleVisible: false,
                    headerBackVisible: false,
                    headerShown: false,
                }}
            >
                {isLoggedIn ? (
                    <Fragment>
                        <Stack.Screen name='RootHome' component={HomeTabs} />
                        <Stack.Screen name='EditProfile' component={EditProfile} />
                        <Stack.Screen name='Queue' component={Queue} />
                        <Stack.Screen name='Playlist' component={Playlist} />
                        <Stack.Screen name='Chatroom' component={Chatroom} />
                        <Stack.Screen name='CreateRoom' component={CreateRoom} />
                        <Stack.Screen name='Track' component={Track} />
                        <Stack.Screen name='RadioRoomQueue' component={RadioRoomQueue} />
                        <Stack.Screen name='RoomQueue' component={RoomQueue} />
                        <Stack.Screen name='AddSong' component={AddSong} />
                    </Fragment>
                ) : (
                    <Stack.Screen name='Auth' component={AuthStack} />
                )}
            </Stack.Navigator>
            {isLoggedIn && <CurrentlyPlaying />}
        </React.Fragment>
    )
}
