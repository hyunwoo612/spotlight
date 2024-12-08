import { StyleSheet, Text, View, TouchableOpacity, TextInput, Platform } from 'react-native';
import { useFonts } from 'expo-font';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import React, { useState } from 'react';
import { normalize } from '../../normallize';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

type Props = StackScreenProps<RootStackParamList, 'Select'>;

export default function Select({ navigation }: Props) {
  const [fontsLoaded] = useFonts({
    PretendardSemiBold: require("../../assets/fonts/otf/Pretendard-SemiBold.otf"),
    PretendardRegular: require("../../assets/fonts/otf/Pretendard-Regular.otf")
  });

  const [selectedButtons, setSelectedButtons] = useState(new Array(16).fill(false));
  const { token } = useAuth(); // JWT 토큰 가져오기

  const toggleButton = (index: number) => {
    const updatedButtons = [...selectedButtons];
    updatedButtons[index] = !updatedButtons[index];
    setSelectedButtons(updatedButtons);
  };

  const buttonLabels = [
    '볼링', '탁구', '요가', '태권도',
    '검도', '수영', '필라테스', '축구(풋살)',
    '배드민턴', '헬스', '댄스', '복싱',
    '골프', '줄넘기', '탁구', '기타종목',
  ];
  
  // 선택된 항목 인덱스를 추출하여 해당 항목들만 담은 배열로 반환
  const selectedItems = buttonLabels.filter((label, index) => selectedButtons[index]);

  const handleSubmit = async () => {
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }
  
    if (selectedItems.length < 3) {
      alert('최소 3개 이상 선택해야 합니다.');
      return;
    }
  
    // 선택된 항목을 콤마로 구분된 문자열로 변환
    const selectionsString = selectedItems.join(',');
  
    try {
      const response = await axios.post('http://127.0.0.1:5000/saveSelections', {
        token, // JWT 토큰 전송
        selectedItems: selectionsString, // 콤마로 구분된 문자열 전송
      });

      console.log(response)
  
      if (response.status === 200) {
        alert("선택 항목이 성공적으로 저장되었습니다.");
        navigation.navigate('Home'); // 홈으로 이동
      } else {
        alert("선택 항목 저장에 실패했습니다.");
      }
    } catch (error) {
      alert("서버와의 연결에 문제가 발생했습니다.");
    }
  };
  
  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>원하는 종목을</Text>
        <Text style={styles.title2}>선택해주세요.(최소 3개 이상)</Text>
      </View>
      <View style={styles.buttonGrid}>
        {buttonLabels.map((label, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.button1,
              selectedButtons[index] && styles.selectedButton,
            ]}
            onPress={() => toggleButton(index)}
          >
            <Text
              style={[
                styles.buttonText1,
                selectedButtons[index] && styles.selectedButtonText,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
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
  titleContainer: {
    marginTop: Platform.OS === 'ios' ? normalize(80) : normalize(120),
    marginBottom: Platform.OS === 'ios' ? normalize(28) : 60,
    bottom: Platform.OS === 'ios' ? 0 : normalize(60),
  },
  title: {
    color: '#FFFFFF',
    fontFamily: "PretendardSemiBold",
    textAlign: 'left',
    fontSize: 28,
  },
  title2: {
    color: '#FFFFFF',
    fontFamily: "PretendardRegular",
    fontSize: 18,
  },
  buttonContainer: {
    flex: 1,
    marginBottom: Platform.OS === 'ios' ? 120 : 0,
    bottom: Platform.OS === 'ios' ? 0 : 80,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#479BFF',
    width: 270,
    height: 60,
    borderRadius: 10,
    justifyContent: 'center',
    alignContent: 'center',
  },
  buttonText: {
    color: "#fff",
    fontFamily: "PretendardRegular",
    textAlign: 'center',
    fontSize: 14,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Platform.OS === 'ios' ? normalize(30) : 0,
    bottom: Platform.OS === 'ios' ? 0 : normalize(80),
  },
  button1: {
    width: '48%', // 두 버튼이 한 줄에 배치되도록 설정
    height: 50,
    borderRadius: 10,
    backgroundColor: '#252932',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#35383F', // 기본 테두리 색상
  },
  selectedButton: {
    borderColor: '#479BFF', // 선택 시 테두리 색상
  },
  buttonText1: {
    color: '#92A3B2',
    fontSize: 14,
  },
  selectedButtonText: {
    color: '#479BFF', // 선택 시 텍스트 색상
  },
});
