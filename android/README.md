# Pradhan eSeva Android App

Android app shell for the Pradhan Digital Services portal.

- App name: Pradhan eSeva
- Application ID: in.pradhandigitalservices.eseva
- Website/API source: https://pradhan-frontend-4g39.onrender.com/
- Minimum Android version: Android 6.0 (API 23)

The app keeps the existing website account, service catalogue, backend APIs, orders and payment flows connected to the same live platform. It adds an Android-native shell, file picker support, downloads, external portal hand-off and Android navigation.

## Build

From this directory with JDK 17 and Gradle 8.9, run: gradle assembleRelease

APK output: app/build/outputs/apk/release/app-release-unsigned.apk

A GitHub Actions workflow builds the APK and uploads it as the artifact named Pradhan-eSeva-Android-APK.

## Important

The app uses the live website for business logic and data. Features such as push notifications, biometric login and offline service transactions require corresponding backend support and are not enabled by this shell. The first launch requires an internet connection.
