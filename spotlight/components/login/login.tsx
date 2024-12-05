import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, Platform, Alert } from 'react-native';
import { useFonts } from 'expo-font';
import { RootStackParamList } from '../../types/navigation';
import { StackScreenProps } from '@react-navigation/stack';
import { normalize } from '../../normallize';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

type Props = StackScreenProps<RootStackParamList, 'Login'>;

export default function Login({ navigation }: Props) {
  const [fontsLoaded] = useFonts({
    PretendardSemiBold: require("../../assets/fonts/otf/Pretendard-SemiBold.otf"),
    PretendardRegular: require("../../assets/fonts/otf/Pretendard-Regular.otf"),
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!fontsLoaded) return null;

  const { setToken } = useAuth(); // 토큰 저장 함수 가져오기

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/login', { email, password });
      const { token } = response.data;

      if (token) {
        setToken(token); // AuthContext에 토큰 저장
        Alert.alert('로그인 성공', '홈 화면으로 이동합니다.');
        navigation.navigate('Select');
      } else {
        Alert.alert('로그인 실패', '토큰을 받을 수 없습니다.');
      }
    } catch (error) {
      Alert.alert('오류', '로그인에 실패했습니다. 이메일 또는 비밀번호를 확인하세요.');
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Image source={require('../../assets/Left Arrow.png')} />
        </TouchableOpacity>
        <Text style={styles.titletext}>로그인</Text>
      </View>
      <View style={styles.badminton}>
        <Image source={require('../../assets/Badminton.png')} />
      </View>
      <View style={styles.titlebottomcontainer}>
        <Text style={styles.minititle}>이메일</Text>
        <View style={styles.inputContainer}>
          <Image source={require('../../assets/Mail.png')} />
          <TextInput
            style={styles.input}
            placeholder="이메일"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <Text style={styles.minititle}>비밀번호</Text>
        <View style={styles.inputContainer}>
          <Image source={require('../../assets/Lock.png')} />
          <TextInput
            style={styles.input}
            placeholder="비밀번호"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>로그인</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.signup}>
          <Text style={styles.notuser}>아직 회원이 아니신가요?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signupbutton}>회원가입</Text>
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
  badminton: {
    top: 40,
    width: 200,
    height: 200
  },
  title: {
    width: normalize(375),
    height: normalize(56),
    marginTop: Platform.OS === 'ios' ? normalize(40) : normalize(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titletext: {
    color: "#FFF",
    fontSize: 20,
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
    fontSize: 12,
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
    marginTop: 40,
  },
  buttonText: {
    color: "#fff",
    fontFamily: "PretendardSemiBold",
    textAlign: 'center',
    fontSize: 14,
  },
  titlebottomcontainer: {
    flex: 1,
    top: Platform.OS === 'ios' ? normalize(64): normalize(60)
  },
  back: {
    position: 'absolute',
    left: 30,
  },
  notuser: {
    color: '#9EA3B2',
    fontSize: 14
  },
  signup: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    top: Platform.OS === 'ios' ? -10 : 10
  },
  signupbutton: {
    color: '#479BFF',
    fontFamily: 'PretendardSemiBold',
    borderBottomWidth: 1,
    borderBottomColor: '#4798FF',
    left: 5,
    fontSize: 14
  }
});
