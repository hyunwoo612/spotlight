import React, { useState } from "react";
import { StyleSheet, Text, View, Button, Alert } from "react-native";
import * as Location from "expo-location";

interface LocationData {
  latitude: number;
  longitude: number;
}

const App: React.FC = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const getLocation = async (): Promise<void> => {
    try {
      // 위치 권한 요청
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("위치 액세스 권한이 거부되었습니다.");
        Alert.alert("권한 필요", "위치를 가져오려면 권한이 필요합니다.");
        return;
      }

      // 현재 위치 가져오기
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
      setErrorMsg(null); // 이전 에러 메시지 초기화
    } catch (error) {
      setErrorMsg("위치를 가져오는 동안 오류가 발생했습니다.");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>현재 위치 테스트</Text>
      <Button title="위치 가져오기" onPress={getLocation} />

      {errorMsg ? (
        <Text style={styles.error}>{errorMsg}</Text>
      ) : location ? (
        <Text style={styles.result}>
          위도: {location.latitude}, 경도: {location.longitude}
        </Text>
      ) : (
        <Text style={styles.info}>위치를 가져오기 위해 버튼을 눌러주세요.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  error: {
    color: "red",
    marginTop: 20,
  },
  result: {
    marginTop: 20,
    fontSize: 16,
  },
  info: {
    marginTop: 20,
    fontSize: 14,
    color: "gray",
  },
});

export default App;
