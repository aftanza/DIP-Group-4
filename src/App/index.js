import * as React from 'react'
import { Fragment, useEffect } from 'react'
import { Text } from 'react-native'
import { Navigation } from '../Navigation'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'react-native'
import * as Linking from 'expo-linking'
import { NavigationContainer } from '@react-navigation/native'
import Toast from 'react-native-toast-message'

const prefix = [Linking.createURL('/'), 'exp://', 'radioroom://']

export const AppContainer = () => {
    const linking = {
        prefix: prefix,
        // prefixes: prefix,
        config: {
            /* configuration for matching screens with paths */
        },
    }
    return (
        <SafeAreaProvider>
            <StatusBar barStyle={'light-content'} />
            <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
                <Navigation />
            </NavigationContainer>
            <Toast />
        </SafeAreaProvider>
    )
}
