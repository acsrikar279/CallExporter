# CallExporter

An android app built using React Native for exporting call log data to CSV.

Call logs data is stored as CSV in the mobile's internal storage Download folder.

# Instructions

npm install
npx react-native start
npx react-native run-android 


If building fails because of spawnSync ./gradlew EACCES use chmod 755 android/gradlew

# Generate APK

To generate the keystore ---> keytool -genkey -v -keystore debug.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000

Building the apk (from the projectDIR) --> cd andoird && ./gradlew assembleRelease