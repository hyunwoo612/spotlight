import { StyleSheet, Text, View, TouchableOpacity, Platform} from 'react-native';
import { useFonts } from 'expo-font';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import Basketball from '../../assets/Basketball.svg';

type Props = StackScreenProps<RootStackParamList, 'Start'>;

export default function Start({ navigation } : Props) {

  const [fontsLoaded] = useFonts({
    PretendardSemiBold: require("../../assets/fonts/otf/Pretendard-SemiBold.otf"),
    PretendardRegular: require("../../assets/fonts/otf/Pretendard-Regular.otf")
  });

  if (!fontsLoaded) return null;


  return (
    <View style={styles.container}>
        <View style={styles.basketball}>
          <Basketball width={200} height={200} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.bold}>스포트 라이트</Text>
          <Text style={styles.light}>스포츠 일자리를{"\n"}쉽게 찾도록 도와주는 빛.</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.buttonText}>시작하기</Text>
          </TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181A20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  basketball: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 200 : 150,
    marginBottom: Platform.OS === 'ios' ? 100 : 150,
  },
  bold: {
    fontSize: 32,
    color: '#fff',
    textAlign: 'center',
    fontFamily: "PretendardSemiBold",
    width: 175,
    height: 44,
  },
  light: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    fontFamily: "PretendardRegular",
  },
  textContainer: {
    flex: 1,
  },
  size: {
    width: 200,
    height: 200,
  },
  buttonContainer: {
    flex: 1,
    marginBottom: Platform.OS === 'ios' ? 120 : 80,
  },
  button: {
    backgroundColor: '#479BFF',
    width: 271,
    height: 60,
    borderRadius: 10,
    justifyContent:'center',
    alignContent: 'center'
  },
  buttonText: {
    color: "#fff",
    fontFamily: "PretendardSemiBold",
    textAlign: 'center',
    fontSize: 14,
  }
});
