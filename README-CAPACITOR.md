Capacitor Android build

This repo now includes a basic Capacitor config and npm scripts to help produce an Android APK.

Prerequisites

- Node.js and npm
- Java JDK 11+
- Android Studio and Android SDK (platform-tools)
- ANDROID_HOME / ANDROID_SDK_ROOT environment variable set

Quick start (PowerShell)

1. Install the new dependencies:

```powershell
npm install
```

2. Build the Angular app (production):

```powershell
npm run build
```

3. Initialize Capacitor (only once) — this will create native directories. If you already ran this locally, skip this step:

```powershell
npx cap init "SlingBilling" "com.example.slingbilling" --web-dir=dist/sling-billing-software-app
```

4. Add Android platform and copy web assets:

```powershell
npx cap add android
npx cap copy android
```

5. Open Android Studio and build APK:

```powershell
npx cap open android
```

Then use Android Studio to Build > Build Bundle(s) / APK(s) > Build APK(s) (debug) or Generate Signed Bundle / APK for release.

Notes

- Update `capacitor.config.json` appId/appName as needed.
- Ensure `environment.apiBase` points to a reachable API from the Android device/emulator.
- For signing release APK, create a keystore and configure Gradle or use Android Studio's wizard.

If you want, I can also add npm script shortcuts like `npm run cap:android` to run the common sequence.
