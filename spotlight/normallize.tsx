import { Dimensions } from 'react-native';

// 화면 크기 정보
const { width, height } = Dimensions.get('window');

// Figma 기준 화면 크기 (예: 375px)
const scale = width / 375; // 기본 화면 크기(375px 기준)로 스케일 비율 계산

// normalize 함수 정의
const normalize = (size: number): number => {
  const newSize = size * scale; // 화면 비율을 고려하여 크기 변환
  return Math.round(newSize); // 반올림하여 최종 크기 반환
};

export { normalize };
