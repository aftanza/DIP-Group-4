import * as WebBrowser from 'expo-web-browser'
import {
  AccessTokenRequest,
  makeRedirectUri,
  RefreshTokenRequest,
  useAuthRequest,
} from 'expo-auth-session'
import { useAuthStore } from '../../Store/useAuthStore'
import { useFirebaseSignInAnon } from '../../../firebaseConfig'

WebBrowser.maybeCompleteAuthSession()

const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
}

const clientId = process.env.EXPO_PUBLIC_SPOTIFY_API_CLIENT_ID
const clientSecret = process.env.EXPO_PUBLIC_SPOTIFY_API_CLIENT_SECRET

// const redirectUri = Linking.createURL('/');
const redirectUri = makeRedirectUri({
  scheme: 'radioroom',
  path: 'redirect',
})
// The redirect URI ideally would be radioroom://redirect. In expo project would be exp://localhost

const scope = [
  'user-read-email',
  'playlist-modify-public',
  'playlist-modify-private',
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-read-recently-played',
  'user-read-playback-state',
]
//Todo
//Add logout function
//add refresh token function

export function useSpotifyAuthenticate() {
  const changeAccessToken = useAuthStore((state) => state.changeAccessToken)
  const changeIsLoggedIn = useAuthStore((state) => state.changeIsLoggedIn)
  const changeRefreshToken = useAuthStore((state) => state.changeRefreshToken)
  // const changeCode = useAuthStore((state) => state.changeCode)
  // const changeCodeVerifier = useAuthStore((state) => state.changeCodeVerifier)

  const [firebaseSignIn] = useFirebaseSignInAnon()

  const [_, __, promptAsync] = useAuthRequest(
    {
      clientId: clientId,
      // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
      // this must be set to false
      usePKCE: false,
      redirectUri: redirectUri,
      scopes: scope,
    },
    discovery
  )

  async function getAccessToken(response) {
    // console.log(response)
    if (response?.type === 'success') {
      const { code } = response.params
      return new AccessTokenRequest(
        {
          code: code,
          redirectUri: redirectUri,
          clientId: clientId,
          clientSecret: clientSecret,
          scopes: scope,
        },
        discovery
      )
    } else if (response?.type === 'error') {
      new Error('Error in getting the access token. Skill issue.')
      console.log(response.error)
      return null
    }
  }

  async function apiLogin() {
    promptAsync().then(async (response) => {
      const tokenRequest = await getAccessToken(response)

      await tokenRequest
        ?.performAsync(discovery)
        .then((r) => {
          changeAccessToken(r.accessToken)
          changeRefreshToken(r.refreshToken)
          changeIsLoggedIn(true)
        })
        .catch((error) => {
          console.log(error)
        })
      await firebaseSignIn()
    })
  }
  return [apiLogin]
}

export function useSpotifyRefresh() {
  const changeAccessToken = useAuthStore((state) => state.changeAccessToken)
  const refreshToken = useAuthStore((state) => state.refreshToken)
  async function doRefresh() {
    const refreshTokenRequest = await new RefreshTokenRequest(
      {
        refreshToken: refreshToken,
        clientId: clientId,
        clientSecret: clientSecret,
        scopes: scope,
      },
      discovery
    )
    await refreshTokenRequest.performAsync(discovery).then((r) => {
      changeAccessToken(r)
      // console.log(r.accessToken)
    })
  }
  return [doRefresh]
}
//legacy code -----------------------------------------------------------------------------------------------

//     import * as Linking from 'expo-linking';
// // import { Linking } from 'react-native'
//     import * as WebBrowser from 'expo-web-browser';
//
//     const clientId = process.env.EXPO_PUBLIC_SPOTIFY_API_CLIENT_ID
//     const redirectUri = Linking.createURL('/');
//
//     const authUrl = 'https://accounts.spotify.com/authorize?';
//
//
//     async function generateCodeChallenge(codeVerifier) {
//         //Temp static hash
//         return "932f3c1b56257ce8539ac269d7aab42550dacf8818d075f0bdf1990562aae3ef"
//             .replace(/\+/g, '-')
//             .replace(/\//g, '_')
//             .replace(/=+$/, '');
//         // sha256("codeVerifier").then((hash) => {
//         //     console.log(hash);
//         // });
//
//         // return sha256Bytes(generateMessage(codeVerifier)).then(hash => {
//         //     console.log(hash);
//         //     return hash
//         // });
//     }
//
//     function generateRandomString(length) {
//         let text = '';
//         let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//
//         for (let i = 0; i < length; i++) {
//             text += possible.charAt(Math.floor(Math.random() * possible.length));
//         }
//         return text;
//     }
//
//     export const Api = (changeCode, changeCodeVerifier, changeAccessToken, changeRefreshToken) => {
//
//         let codeVerifier = generateRandomString(128);
//         // console.log(codeVerifier)
//         // generateCodeChallenge(codeVerifier)
//         // // console.log(generateCodeChallenge(codeVerifier))
//
//
//
//         generateCodeChallenge(codeVerifier)
//             .then(codeChallenge => {
//                 let state = generateRandomString(16);
//                 let scope = 'streaming user-read-private user-read-email';
//
//                 changeCodeVerifier(codeVerifier)
//
//                 let args = new URLSearchParams({
//                     response_type: 'code',
//                     client_id: clientId,
//                     scope: scope,
//                     redirect_uri: redirectUri,
//                     state: state,
//                     code_challenge_method: 'S256',
//                     code_challenge: codeChallenge
//                 });
//
//                 // window.location = 'https://accounts.spotify.com/authorize?' + args;
//                 WebBrowser.openAuthSessionAsync(authUrl + args)
//                     .then((response) => {
//                         console.log(response)
//                         if(response === 'success'){
//                             const {url, params} = response
//
//                             console.log('Authentication successful');
//                             console.log('Final URL:', url);
//                             console.log('Query Parameters:', params);
//                         }
//                     })
//                     .catch((error) => {
//                         console.error('Error opening web browser:', error);
//                     });
//             });
//     }
