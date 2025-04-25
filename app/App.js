import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Shake from "react-native-shake";
import Ably from "ably/promises";

const ably = new Ably.Realtime.Promise(
  "DKaEwg.3nk-tg:bJ_kgD9qWySagyTuNq_mqJMLSaQTEb5n8E_tZ8Fytso"
);
const channel = ably.channels.get("shake-channel");

export default function App() {
  useEffect(() => {
    const subscription = Shake.addListener(() => {
      channel.publish("shake", { from: "app" });
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Shake me!</Text>
    </View>
  );
}
