import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput } from 'react-native';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';

export default function Signup() {
  const [fontsLoaded] = useFonts({
    PretendardSemimini_title: require("../../assets/fonts/Pretendard-SemiBold.ttf"),
    PretendardRegular: require("../../assets/fonts/Pretendard-Regular.ttf")
  });
  
  if (!fontsLoaded) return null;

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
    <Text style={styles.minititle}>이름</Text>
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="이름을 입력해 주세요"
        placeholderTextColor="#aaa"
      />
    </View>
    <Text style={styles.minititle}>이름</Text>
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="이메일을 입력해 주세요"
        placeholderTextColor="#aaa"
      />
    </View>
    <Text style={styles.minititle}>이름</Text>
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="비밀번호를 입력해 주세요"
        placeholderTextColor="#aaa"
        secureTextEntry
      />
    </View>
    <Text style={styles.minititle}>이름</Text>
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="0000-00-00"
        placeholderTextColor="#aaa"
      />
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
        marginLeft: 10,
        fontSize: 16,
      },
      minititle:{
        color: '#92A3B2',
        fontFamily: "PretendardSemiBold",
      }
    });