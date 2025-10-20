Android Gradle / Java compatibility

Situation

The native Android project in this repo had a Gradle wrapper configured to 8.0.2 while your environment reported Java 21.0.6. Gradle 8.0.2 is not compatible with newer JVMs and Android Studio recommended upgrading the Gradle wrapper to a compatible version (8.12) or using a supported JVM (<=19).

What I changed in the project

- Updated `android/gradle/wrapper/gradle-wrapper.properties` to use Gradle 8.12.
- Bumped Android Gradle Plugin in `android/build.gradle` to `com.android.tools.build:gradle:8.3.2` which is compatible with Gradle 8.12.

If Android Studio still complains

1. Change the Gradle JDK used by Android Studio

- Open Android Studio -> File -> Settings (Windows) or Android Studio -> Preferences (macOS)
- Navigate to: Build, Execution, Deployment -> Build Tools -> Gradle
- For "Gradle JDK" choose a JDK that is supported (Java 17 or Java 19 is safe). If you don't have Java 19 installed, install it and then point Android Studio to that JDK.

2. Re-sync the project

- Click File -> Sync Project with Gradle Files or press the IDE prompt to sync.

3. If the IDE still fails to download the Gradle distribution

- Ensure your machine has outbound HTTPS access to services.gradle.org
- Alternatively download Gradle manually and place it in the Gradle user home wrapper location or configure offline mode in the IDE.

Fallbacks

- If you prefer not to upgrade AGP, you can instead use a supported JDK version (Java 19) for Gradle/IDE. This is often the simplest fix.
- If your environment must keep Java 21, Gradle 8.12 + AGP 8.3.2 should help; however some plugins might still expect older JVMs.

Commands (CLI)

To force the wrapper to download the updated distribution (if Android Studio doesn't do it automatically):

```powershell
cd android\gradle\wrapper
# The wrapper will download Gradle automatically when you run Gradle tasks from the project root
cd ..\..
./gradlew --version
```

Notes

- I recommend using Android Studio to run the first sync; it will provide clear guidance if additional plugin updates or migrations are required.
- If you'd like, I can revert the AGP bump or try a different AGP version (for example 8.5.x) depending on your CI or plugin constraints. Tell me which option to take if you want me to change it.
