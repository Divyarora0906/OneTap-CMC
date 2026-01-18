import { Text, View } from "react-native";
import Starter from "./Starter";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      className="bg-primarybg"
    >
      
      <Starter />
    </View>
  );
}
