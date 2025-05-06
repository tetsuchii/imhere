import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  Image,
} from "react-native";
import { DeviceMotion } from "expo-sensors";
import * as Ably from "ably";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font"; // Hook to load custom fonts
import { Inter_400Regular, Inter_700Bold } from "@expo-google-fonts/inter"; // Import Inter font weights
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient"; // Importing LinearGradient
import Svg, { Path } from "react-native-svg"; // Importing Svg for SVG support

let deviceId;
const ably = new Ably.Realtime(
  "DKaEwg.3nk-tg:bJ_kgD9qWySagyTuNq_mqJMLSaQTEb5n8E_tZ8Fytso"
); // we’ll fill this soon
const channel = ably.channels.get("shake-channel");

const loadDeviceId = async () => {
  const storedId = await AsyncStorage.getItem("device-id");
  if (storedId) {
    deviceId = storedId;
  } else {
    deviceId = uuidv4();
    await AsyncStorage.setItem("device-id", deviceId);
  }
};

export default function App() {
  const { width, height } = Dimensions.get("window");

  const [fontsLoaded] = useFonts({
    Inter_400Regular, // Regular weight
    Inter_700Bold, // Bold weight
  });

  const [isDeviceIdLoaded, setIsDeviceIdLoaded] = useState(false);

  useEffect(() => {
    const fetchDeviceId = async () => {
      await loadDeviceId();
      setIsDeviceIdLoaded(true);
    };

    fetchDeviceId();

    let lastShake = 0;

    const subscription = DeviceMotion.addListener((motionData) => {
      const acc = motionData.accelerationIncludingGravity;
      const totalForce = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2);

      if (totalForce > 25 && Date.now() - lastShake > 1000) {
        lastShake = Date.now();
        channel.publish("shake", { deviceId });
        console.log("Shake detected and sent!");
      }
    });

    DeviceMotion.setUpdateInterval(200);

    return () => subscription.remove();
  }, []);

  if (!fontsLoaded || !isDeviceIdLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={[styles.container, { width, height }]}>
      {/* Blur View */}
      <BlurView intensity={50} style={styles.blurView}>
        <Text style={styles.text}>Shake your phone to connect to the car!</Text>

        {/* Display Device ID */}
        {/*deviceId && (
          <Text style={styles.deviceIdText}>Device ID: {deviceId}</Text>
        )*/}

        {/* Add SVG */}
        <Svg width="200" height="200" viewBox="0 0 200 200" fill="none">
          <Path
            d="M190.503 30.7022C190.389 29.0737 189.703 27.5378 188.568 26.3647C187.433 25.1916 185.92 24.4564 184.296 24.2884L173.152 23.2539L172.255 43.9229L180.227 44.6815C180.504 44.7048 180.773 44.783 181.02 44.9116C181.266 45.0401 181.484 45.2165 181.661 45.4303C181.838 45.6441 181.971 45.8911 182.052 46.1569C182.132 46.4226 182.159 46.7018 182.131 46.978L181.765 50.6884L170.676 166.454C170.613 167 170.338 167.499 169.909 167.843C169.48 168.186 168.932 168.347 168.386 168.288L166.869 168.15L166.352 180.213C166.216 183.291 165.042 186.232 163.021 188.557L168.448 189.068C169.351 189.164 170.264 189.081 171.135 188.823C172.006 188.566 172.817 188.138 173.522 187.566C174.227 186.994 174.812 186.288 175.243 185.488C175.674 184.689 175.943 183.813 176.034 182.909L176.786 175.144L176.793 174.937L188.634 51.5367L188.641 51.3298L190.517 31.8815C190.547 31.491 190.542 31.0918 190.503 30.7022Z"
            fill="white"
          />
          <Path
            d="M168.014 25.9983C167.829 24.3758 167.077 22.8708 165.891 21.7481C164.705 20.6254 163.162 19.9569 161.531 19.8603L150.359 19.3086V39.9983L158.359 40.412C158.636 40.4235 158.908 40.4899 159.159 40.6075C159.41 40.725 159.635 40.8913 159.821 41.0967C160.007 41.3021 160.151 41.5424 160.243 41.8038C160.335 42.0651 160.375 42.3422 160.359 42.6189L160.152 46.3431L154.083 162.481C154.044 163.029 153.791 163.539 153.377 163.901C152.964 164.262 152.424 164.446 151.876 164.412L150.359 164.343V176.412C150.358 179.494 149.312 182.484 147.394 184.895L152.842 185.171C153.748 185.228 154.657 185.105 155.515 184.809C156.374 184.514 157.166 184.052 157.845 183.449C158.524 182.847 159.078 182.116 159.474 181.299C159.87 180.482 160.1 179.594 160.152 178.688L160.566 170.895V170.688L167.049 46.8948V46.6879L168.083 27.1707C168.095 26.7786 168.072 26.3863 168.014 25.9983Z"
            fill="white"
            fillOpacity="0.4"
          />
          <Path
            d="M33.6547 180.206L33.1306 168.15L31.6133 168.288C31.0669 168.347 30.5196 168.186 30.0907 167.843C29.6618 167.499 29.3861 167 29.3237 166.454L18.234 50.6884L17.8685 46.978C17.84 46.7023 17.8667 46.4237 17.9469 46.1584C18.0271 45.893 18.1593 45.6463 18.3358 45.4326C18.5123 45.2189 18.7296 45.0424 18.975 44.9134C19.2204 44.7845 19.4889 44.7056 19.7651 44.6815L27.7444 43.9229L26.8478 23.2539L15.7099 24.2884C14.0861 24.4564 12.5735 25.1916 11.4382 26.3647C10.3029 27.5378 9.61766 29.0737 9.503 30.7022C9.46172 31.0916 9.4548 31.4839 9.48231 31.8746L11.3582 51.3298L11.3651 51.5367L23.2064 174.937L23.2133 175.144L23.9651 182.909C24.0563 183.813 24.3252 184.689 24.7564 185.488C25.1876 186.288 25.7725 186.994 26.4775 187.566C27.1825 188.138 27.9937 188.566 28.8645 188.823C29.7352 189.081 30.6483 189.164 31.5513 189.068L36.9789 188.557C34.9575 186.232 33.7834 183.291 33.6478 180.213L33.6547 180.206Z"
            fill="white"
          />
          <Path
            d="M49.6411 176.412V164.343L48.1238 164.412C47.5757 164.446 47.0362 164.262 46.6229 163.901C46.2096 163.539 45.9559 163.029 45.9169 162.481L39.848 46.3431L39.6411 42.6189C39.6253 42.3422 39.6647 42.0651 39.757 41.8038C39.8494 41.5424 39.9928 41.3021 40.1789 41.0967C40.365 40.8913 40.5902 40.725 40.8412 40.6075C41.0922 40.4899 41.3641 40.4235 41.6411 40.412L49.6411 39.9983V19.3086L38.4686 19.8603C36.8385 19.9569 35.2947 20.6254 34.1089 21.7481C32.9231 22.8708 32.1713 24.3758 31.9859 25.9983C31.9285 26.3863 31.9055 26.7786 31.9169 27.1707L32.9514 46.6879V46.8948L39.4342 170.688V170.895L39.848 178.688C39.8998 179.594 40.1303 180.482 40.5263 181.299C40.9222 182.116 41.4758 182.847 42.1552 183.449C42.8345 184.052 43.6263 184.514 44.4849 184.809C45.3435 185.105 46.2521 185.228 47.1583 185.171L52.6066 184.895C50.6879 182.484 49.6426 179.494 49.6411 176.412Z"
            fill="white"
            fillOpacity="0.4"
          />
          <Path
            d="M137.931 10.8984H62.0694C60.2403 10.8984 58.4862 11.625 57.1928 12.9184C55.8995 14.2117 55.1729 15.9659 55.1729 17.795V176.416C55.1729 178.245 55.8995 179.999 57.1928 181.292C58.4862 182.586 60.2403 183.312 62.0694 183.312H137.931C139.761 183.312 141.515 182.586 142.808 181.292C144.101 179.999 144.828 178.245 144.828 176.416V17.795C144.828 15.9659 144.101 14.2117 142.808 12.9184C141.515 11.625 139.761 10.8984 137.931 10.8984ZM100 179.864C98.6364 179.864 97.303 179.459 96.1689 178.702C95.0348 177.944 94.1508 176.867 93.6288 175.607C93.1069 174.346 92.9703 172.96 93.2364 171.622C93.5025 170.284 94.1593 169.055 95.1238 168.091C96.0883 167.126 97.3172 166.469 98.655 166.203C99.9928 165.937 101.379 166.074 102.64 166.596C103.9 167.118 104.977 168.002 105.735 169.136C106.493 170.27 106.897 171.603 106.897 172.967C106.897 174.796 106.17 176.551 104.877 177.844C103.584 179.137 101.83 179.864 100 179.864ZM137.931 160.554C137.931 161.102 137.53 161.505 137.026 161.505H62.0694C61.5652 161.505 61.1644 161.102 61.1644 160.554V27.2525C61.1644 26.7046 61.5652 26.3017 62.0694 26.3017H137.931C138.435 26.3017 138.836 26.7046 138.836 27.2525V160.554H137.931Z"
            fill="white"
          />
        </Svg>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
    backgroundColor: "transparent",
  },
  gradientBackground: {
    position: "absolute",
    top: 220,
    left: 0,
  },
  blurView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderRadius: 15,
  },
  text: {
    marginTop: 60,
    fontFamily: "Inter_500Bold",
    fontSize: 24,
    color: "white",
    textAlign: "center",
    marginBottom: 100,
    marginHorizontal: 10,
  },
  image: {
    width: 140,
    height: 140,
    marginBottom: 0,
  },
});
