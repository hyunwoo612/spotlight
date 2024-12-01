import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image } from 'react-native';
import { useFonts } from 'expo-font';

export default function Edit() {
  const [fontsLoaded] = useFonts({
    PretendardSemimini_title: require("../../assets/fonts/Pretendard-SemiBold.ttf"),
    PretendardRegular: require("../../assets/fonts/Pretendard-Regular.ttf"),
  });

  const [checkBox1, setCheckBox1] = useState(false);
  const [checkBox2, setCheckBox2] = useState(false);

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원가입</Text>
      <Text style={styles.minititle}>이름</Text>
      <View style={styles.inputContainer}>
        <Image source={require('../../assets/User_02.svg')} />
        <TextInput
          style={styles.input}
          placeholder="이름을 입력해 주세요"
          placeholderTextColor="#aaa"
          maxLength={4}
        />
      </View>
      <Text style={styles.minititle}>이메일</Text>
      <View style={styles.inputContainer}>
        <Image source={require('../../assets/Mail.svg')} />
        <TextInput
          style={styles.input}
          placeholder="이메일을 입력해 주세요"
          placeholderTextColor="#aaa"
        />
      </View>
      <Text style={styles.minititle}>비밀번호</Text>
      <View style={styles.inputContainer}>
        <Image source={require('../../assets/Lock.svg')} />
        <TextInput
          style={styles.input}
          placeholder="비밀번호를 입력해 주세요"
          placeholderTextColor="#aaa"
          secureTextEntry
        />
      </View>
      <Text style={styles.minititle}>생년월일</Text>
      <View style={styles.inputContainer}>
        <Image source={require('../../assets/Calendar.svg')} />
        <TextInput
          style={styles.input}
          placeholder="0000-00-00"
          placeholderTextColor="#aaa"
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
          <Image source={require('../../assets/Check.svg')} />
          <Text style={[styles.toggleText, checkBox1 && styles.activeText]}>사업자</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            { borderColor: checkBox2 ? '#479BFF' : '#252932' },
          ]}
          onPress={handleCheckBox2}
        >
          <Image source={require('../../assets/Check.svg')} />
          <Text style={[styles.toggleText, checkBox2 && styles.activeText]}>개인 사용자</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>회원가입</Text>
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
    fontFamily: "PretendardSemimini_title",
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 61,
    marginTop: 40,
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
  minititle: {
    color: '#92A3B2',
    fontFamily: "PretendardRegular",
    fontSize: 14,
    margin: 8,
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
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#181A20',
    borderWidth: 2,
  },
  toggleText: {
    fontSize: 14,
    fontFamily: "Pretendard",
    color: '#92A3B2',
  },
  activeText: {
    color: '#FFFFFF',
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#479BFF',
    width: 270,
    height: 60,
    borderRadius: 10,
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: 40,
  },
  buttonText: {
    color: "#fff",
    fontFamily: "PretendardSemimini_title",
    textAlign: 'center',
    fontSize: 14,
  },
});
