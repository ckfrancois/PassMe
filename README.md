# PassMe
A new iteration on the PassMe brand, a reinvention of Nintendo's StreetPass for the modern age. PassMe allows you to interact with people you pass by! 

In PassMe, you'll be represented by a Passling, a digital avatar that represents you! Attached to your Passling will be interactions like a greeting or a question for others to answer, or information like what you've been up to!

Once you pass someone, their Passling will join your town! The more Passlings in your town, the more it will grow, turning into a village, city, or even Kingdom! 

The Passlings in your town can be used across multiple fun minigames aswell!

----

# Table of Contents

* [Setup PassMe](#setting-up-passme)
* [Build Passme](#building-passme)
* Examples for Building
   - [Example of Building on Windows](#windows-example-build)
   - [Example of Building on MacOS](#mac-example-build)


----
# Setting Up PassMe
> [!NOTE]
> A .env file is required in the addons folder for godot-firebase
>
> Node version 20.20.2 is required to build properly
> 
> Known Requirements for Android Building:
>    * Java SDK v17
>    * Android SDK




---

### Project Setup
> [!TIP]
> Use a platform specific guide for more details to get the project running

<details>
   <summary>General Basic Setup</summary>


1. Clone the PassMe Repository
2. Enter the Project Folder and open terminal at Project root folder 
3. Run `npm install`

</details>


<details> 
<summary>Windows Project Setup</summary>
   
### Windows Project Setup
1. Open the project root in terminal.
> <img width="735" height="477" alt="Screenshot 2026-03-30 at 6 39 05 PM" src="https://github.com/user-attachments/assets/075ef798-f312-49ea-8caa-0f32d30fcdc7" />


2. Run `npm install`
    - This may take a while
    - It should look like this: 
> <img width="835" height="468" alt="image" src="https://github.com/user-attachments/assets/b363d6d1-6118-4a07-a71a-b0de931f5b0f" />

</details>


<details>
   <summary>MacOS Project Setup</summary>

### MacOS Project Setup
1. Open the Project root in terminal.
> <img width="679" height="501" alt="Shows where to click to open Project root in terminal" src="https://github.com/user-attachments/assets/c30599d5-27e9-4c9f-8bd0-0501d9c19448" />

2. Run `npm install`
    - This may take a while
    - It should look like this:
> <img width="816" height="491" alt="Shows the output of running 'npm install'" src="https://github.com/user-attachments/assets/21eeebce-a717-422c-b8ab-fd3b2aefb7da" />

</details>

<details>
   <summary>MacOS Setup for building iOS</summary>


### MacOS Setup for building iOS App
1. Follow Steps in [MacOS Project Setup](#macos-project-setup)
2. Run prebuild to do necessary actions to build for iOS, including downloading CocoaPods

   ```
   npx expo prebuild --clean
   ```
   
> <img width="1107" height="262" alt="Show output of running command to prebuild" src="https://github.com/user-attachments/assets/4815b9f5-046f-47a8-bd1e-089df1808738" />
3. Follow Steps to set up [Signing Certificate](#setup-signing-certificate-in-xcode-on-mac)

</details>

---

## Setup Signing Certificate in XCode on Mac
1. Open XCode in the "ios" folder in the project
2. Click "PassMe"
3. Click "Signing & Capabilities"
4. Click "Add Account" and sign into your app account
5. Change team to added account
6. Ensure you have downloaded the proper OS version for [simulator runtimes in XCode](#downloading-more-ios-versions-in-xcode).

---
## Downloading More iOS versions in XCode
1. While in XCode, at the top click "Product"
2. Then hover over "Destination"
3. Then click on "Manage Run Destinations"
4. Then click the "+" at the bottom
5. Click on OS Version and click "Download more simulator runtimes"

---

## Building PassMe

### Android
> [!Important]
> Developer Mode must be enabled on the Android Phone to sideload the APK
> 
> [Android SDK is required to be installed in order to build APK](https://developer.android.com/about/versions/16/setup-sdk#install-sdk). Ensure that ANDROID_HOME is set in System Environment Variables.
>
> Java Version 17 is required to build for Android. Ensure that JAVA_HOME is set to a JDK v17 in System Environment Variables.


<details>
   <summary>Building for Connected Android Phone</summary>

#### Building for Connected Android Phone
1. Plug Android Phone into Computer
    - Ensure the Phone has data transfer enabled and trusts the computer
3. Paste this command
   
   ```
   npx expo run:android --variant release --device
   ```
   
4. Select the device
5. Wait for Build to complete and the app should open on Android phone when done.

</details>

<details>
   <summary>Building APK</summary>


#### Building APK

1. Prebuild the project in the root terminal
```
   npx expo prebuild --clean
```

2. Then paste and run this command
   * Windows:
     
     ```
     cd android; .\gradlew assembleRelease
     ```
     
   * Mac/Linux:

     ```
     cd android && ./gradlew assembleRelease
     ```
     
3. Retrieve APK from `android/app/build/outputs/apk/release/app-release.apk`
4. Ensure developer mode is enabled on Phone
5. Install the APK on the Phone

</details>

---
### iOS (Mac required for Signing App)
> [!IMPORTANT]
> Signing up as a [Certificate Signer](#setup-signing-certificate-in-xcode-on-mac) in XCode is required to build for iOS.
> 
> Make sure to have the proper [iOS version installed](#downloading-more-ios-versions-in-xcode) that matches the iPhones version.

1. Plug in iOS device into Computer
2. Navigate to PassMe project folder in Terminal or VSCode
3. Paste this command into terminal `npx expo run:ios --device`
4. Select the device that you intend to run the app on
---

### Example Builds


<a name="windows-example-build"></a>
<details>
   <summary>Example Building for Android on Windows</summary>


## Example Building for Android on Windows

1. After setup in [Windows](#windows-project-setup)
2. Run `npx expo run:android --variant release --device` in project root
> <img width="830" height="458" alt="Example of what it should look like when choosing a device to build to" src="https://github.com/user-attachments/assets/9ccde36a-ab26-4ba9-95be-a9e22adff75e" />
3. Select the device. (In this case I will choose "SM_F956U1" since this is the phone plugged in)
    - This will take a while (~5-10 minutes)
> <img width="834" height="686" alt="Example output of successful build" src="https://github.com/user-attachments/assets/7bbdd9f6-d78f-4d7a-a6ab-7b181951172b" />

</details>


<a name="mac-example-build"></a>
<details>
   <summary>Example Building for iOS on Mac</summary>

## Example Building for iOS on Mac
1. After setup in [MacOS](#macos-project-setup)
2. Run `npx expo run:ios --device` in project root
> <img width="1092" height="330" alt="Example of what it should look like when choosing a device to build to on Mac" src="https://github.com/user-attachments/assets/6b0729ae-ccae-4af9-a4b0-65d958b53e01" />
3. Select the device. (In this case I will choose "sonic" since this is the phone plugged in)
    - This will take a bit (~1-5 minutes)
> <img width="731" height="566" alt="Example of successful build for iOS" src="https://github.com/user-attachments/assets/32bdf485-69e7-47ab-bfc1-7c23edf4a2e4" />
</details>

