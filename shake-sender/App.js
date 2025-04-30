import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { DeviceMotion } from "expo-sensors";
import * as Ably from "ably";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  useEffect(() => {
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

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Shake me to send 📳</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  text: { fontSize: 24 },
});
