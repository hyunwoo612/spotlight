import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, Platform} from 'react-native';
import { useFonts } from 'expo-font';
import { RootStackParamList } from '../../types/navigation';
import { StackScreenProps } from '@react-navigation/stack';
import { normalize } from '../../normallize'; // normalize 함수 import
import axios, { AxiosError } from 'axios';



type Props = StackScreenProps<RootStackParamList, 'Signup'>;

export default function Signup({ navigation }: Props) {
  const [fontsLoaded] = useFonts({
    PretendardSemiBold: require("../../assets/fonts/otf/Pretendard-SemiBold.otf"),
    PretendardRegular: require("../../assets/fonts/otf/Pretendard-Regular.otf"),
  });

  const [checkBox1, setCheckBox1] = useState(false);
  const [checkBox2, setCheckBox2] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');


  if (!fontsLoaded) return null;

  const handleCheckBox1 = () => {
    if (checkBox1) {
      setCheckBox1(false);
    } else {
      setCheckBox1(true);
      setCheckBox2(false);
    }
  };

  const handleCheckBox2 = () => {
    if (checkBox2) {
      setCheckBox2(false);
    } else {
      setCheckBox2(true);
      setCheckBox1(false);
    }
  };

  const handleSignup = async () => {
    const user = {
      name: name,
      email: email,
      password: password,
      birth_date: birthDate,
      user_type: checkBox1 ? '장애인' : '비장애인',
    };

    try {
      const response = await axios.post('http://127.0.0.1:5000/signup', user);
      if (response.status === 201) {
        alert('회원가입이 완료되었습니다!');
        navigation.navigate('Login');
      }
    } catch (error) {
      // AxiosError로 타입 지정
      if (error instanceof AxiosError && error.response) {
        // error.response가 존재할 경우, 서버에서 보낸 error 메시지를 출력
        alert(error.response.data.error);
      } else {
        alert('서버에 연결할 수 없습니다.');
      }
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Image source={require('../../assets/Left Arrow.png')} />
        </TouchableOpacity>
        <Text style={styles.titletext}>회원가입</Text>
      </View>
      <View style={styles.titlebottomcontainer}>
        <Text style={styles.minititle}>이름</Text>
        <View style={styles.inputContainer}>
          <Image source={require('../../assets/User_02.png')} />
          <TextInput
            style={styles.input}
            placeholder="이름을 입력해 주세요"
            placeholderTextColor="#aaa"
            maxLength={4}
            value={name} // 상태 값 사용
            onChangeText={(text) => setName(text)} // 상태 업데이트
          />
        </View>
        <Text style={styles.minititle}>이메일</Text>
        <View style={styles.inputContainer}>
          <Image source={require('../../assets/Mail.png')} />
          <TextInput
            style={styles.input}
            placeholder="이메일을 입력해 주세요"
            placeholderTextColor="#aaa"
            value={email} // 상태 값 사용
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <Text style={styles.minititle}>비밀번호</Text>
        <View style={styles.inputContainer}>
          <Image source={require('../../assets/Lock.png')} />
          <TextInput
            style={styles.input}
            placeholder="비밀번호를 입력해 주세요"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={password} // 상태 값 사용
            onChangeText={(text) => setPassword(text)}
          />
        </View>
        <Text style={styles.minititle}>생년월일</Text>
        <View style={styles.inputContainer}>
          <Image source={require('../../assets/Calendar.png')} />
          <TextInput
            style={styles.input}
            placeholder="0000-00-00"
            placeholderTextColor="#aaa"
            value={birthDate} // 상태 값 사용
            onChangeText={(text) => setBirthDate(text)}
          />
        </View>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              { borderColor: checkBox1 ? '#479BFF' : '#252932' },
            ]}
            onPress={handleCheckBox1}
          >
            <Image style={styles.togglecheck} source={checkBox1 ? require('../../assets/CheckActive.png') : require('../../assets/Check.png')}/>
            <Text style={[styles.toggleText, checkBox1 && styles.activeText]}>장애인</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              { borderColor: checkBox2 ? '#479BFF' : '#252932' },
            ]}
            onPress={handleCheckBox2}
          >
            <Image style={styles.togglecheck} source={checkBox2 ? require('../../assets/CheckActive.png') : require('../../assets/Check.png')}/>
            <Text style={[styles.toggleText, checkBox2 && styles.activeText]}>비장애인</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181A20',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    width: normalize(375),
    height: normalize(56),
    marginTop: Platform.OS === 'ios' ? normalize(40) : normalize(10),
    flexDirection: 'row', // 가로 방향으로 배치
    alignItems: 'center', // 수직 중앙 정렬
    justifyContent: 'center', // 중앙 정렬
  },
  titletext: {
    color: "#FFF",
    fontSize: 20,// 화살표와 텍스트 사이의 간격
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#252932',
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: normalize(295),
    height: normalize(60),
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    marginLeft: 10,
    fontFamily: "PretendardRegular",
  },
  minititle: {
    color: '#92A3B2',
    fontFamily: "PretendardRegular",
    fontSize: 14,
    marginBottom: normalize(8),
    alignSelf: 'flex-start'
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 5,
  },
  toggleButton: {
    flex: 1,
    marginHorizontal: 5,
    height: 40,
    width: 130,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#181A20',
    borderWidth: 2,
  },
  togglecheck: {
    position: 'absolute', // 화살표를 절대 위치로 설정
    left: 8, // 왼쪽 여백
  },
  toggleText: {
    fontSize: 14,
    fontFamily: "PretendardRegular",
    marginLeft: normalize(15),
    color: '#92A3B2',
  },
  activeText: {
    color: '#479BFF',
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#479BFF',
    width: normalize(285),
    height: normalize(60),
    borderRadius: 10,
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: Platform.OS === 'ios' ? 40: 20,
  },
  buttonText: {
    color: "#fff",
    fontFamily: "PretendardRegular",
    textAlign: 'center',
    fontSize: 14,
  },
  titlebottomcontainer: {
    flex:1,
    top: Platform.OS === 'ios' ? 79 : 20
  },
  back: {
    position: 'absolute', // 화살표를 절대 위치로 설정
    left: 30, // 왼쪽 여백
  }
});
