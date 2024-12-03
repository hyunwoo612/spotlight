import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, Platform } from 'react-native';
import { useFonts } from 'expo-font';
import { RootStackParamList } from '../../types/navigation';
import { StackScreenProps } from '@react-navigation/stack';
import { normalize } from '../../normallize'; // normalize 함수 import
import Badminton from '../../assets/Badminton.svg'

type Props = StackScreenProps<RootStackParamList, 'Login'>;

export default function Login({ navigation }: Props) {
  const [fontsLoaded] = useFonts({
    PretendardSemiBold: require("../../assets/fonts/otf/Pretendard-SemiBold.otf"),
    PretendardRegular: require("../../assets/fonts/otf/Pretendard-Regular.otf"),
  });

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Image source={require('../../assets/Left Arrow.png')} />
        </TouchableOpacity>
        <Text style={styles.titletext}>로그인</Text>
      </View>
      <View style={styles.badminton}>
        <Image source={require('../../assets/Badminton.png')}/>
      </View>
      <View style={styles.titlebottomcontainer}>
        <Text style={styles.minititle}>이메일</Text>
        <View style={styles.inputContainer}>
          <Image source={require('../../assets/Mail.png')} />
          <TextInput
            style={styles.input}
            placeholder="이메일"
            placeholderTextColor="#aaa"
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
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Select')}>
            <Text style={styles.buttonText}>로그인</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.signup}>
          <Text style={styles.notuser}>아직 회원이 아니신가요?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}><Text style={styles.signupbutton}>회원가입</Text></TouchableOpacity>
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
    alignContent: 'center',
    marginTop: 40,
  },
  buttonText: {
    color: "#fff",
    fontFamily: "PretendardSemiBold",
    textAlign: 'center',
    fontSize: 14,
  },
  titlebottomcontainer: {
    flex:1,
    top: Platform.OS === 'ios' ? normalize(64): normalize(60)
  },
  back: {
    position: 'absolute', // 화살표를 절대 위치로 설정
    left: 30, // 왼쪽 여백
  },
  notuser: {
    color: '#9EA3B2',
    fontSize: 14
  },
  signup: {
    flex: 1,
    flexDirection:'row',
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
