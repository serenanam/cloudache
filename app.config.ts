import 'dotenv/config';

export default {
  "expo": {
    "owner": "serenanams-organization",
    "name": "cloudache",
    "slug": "cloudache",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "cloudache",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundImage": "./assets/images/android-icon-background.png",
        "monochromeImage": "./assets/images/android-icon-monochrome.png"
      },
      "edgeToEdgeEnabled": true,
      "predictiveBackGestureEnabled": false
    },
    "web": {
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff",
          "dark": {
            "backgroundColor": "#000000"
          }
        }
      ],
      "expo-font"
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    },
    "extra": {
      "eas": {
      "projectId": "3b4cff00-756c-49a7-9f81-6a84c0f54a9c"
      },
      "FIREBASE_API_KEY": process.env.FIREBASE_API_KEY,
      "FIREBASE_AUTH_DOMAIN": process.env.FIREBASE_AUTH_DOMAIN,
      "FIREBASE_PROJECT_ID": process.env.FIREBASE_PROJECT_ID,
      "FIREBASE_STORAGE_BUCKET": process.env.FIREBASE_STORAGE_BUCKET,
      "FIREBASE_MESSAGING_SENDER_ID": process.env.FIREBASE_MESSAGING_SENDER_ID,
      "FIREBASE_APP_ID": process.env.FIREBASE_APP_ID,
      "FIREBASE_MEASUREMENT_ID": process.env.FIREBASE_MEASUREMENT_ID
    },
    "updates": {
      "url": "https://u.expo.dev/3b4cff00-756c-49a7-9f81-6a84c0f54a9c"
    },
    "runtimeVersion": {
      "policy": "appVersion"
    }    
  }
}
