import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput } from 'react-native';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';

type Props = StackScreenProps<RootStackParamList, 'Start'>;

export default function Select({ navigation } : Props) {
  const [fontsLoaded] = useFonts({
    PretendardSemimini_title: require("../../assets/fonts/Pretendard-SemiBold.ttf"),
    PretendardRegular: require("../../assets/fonts/Pretendard-Regular.ttf")
  });
  
  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
    <Text style={styles.title}>원하는 종목을</Text>
    <Text style={styles.minititle}>이름</Text>
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="이름을 입력해 주세요"
        placeholderTextColor="#aaa"
        maxLength={4}
      />
    </View>
    <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Select')}>
        <Text style={styles.buttonText}>다음</Text>
      </TouchableOpacity>
    </View>
  </View>
);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#181A20',
        justifyContent: 'center',
        padding: 20,
      },
      title: {
        color: '#FFFFFF',
        fontFamily: "Pretendardsemibold",
        textAlign: 'center',
        fontSize: 20,

      },
      inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#252932',
        borderRadius: 8,
        marginBottom: 20,
        paddingHorizontal: 10,
        height: 60,
      },
      input: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
        marginLeft: 10,
      },
      minititle:{
        color: '#92A3B2',
        fontFamily: "Pretendard",
        fontSize: 14,
        margin: 8,
      },
      buttonContainer: {
        flex: 1,
        marginBottom: 120,
        alignItems: 'center',
      },
      button: {
        backgroundColor: '#479BFF',
        width: 270,
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
      },
    });