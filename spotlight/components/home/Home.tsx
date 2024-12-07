import React, { useState, useEffect } from 'react';
import { useFonts } from 'expo-font';
import { NavigationIndependentTree } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Platform, TextInput, TouchableOpacity } from 'react-native';
import InactiveHouse from '../../assets/House_01.svg';
import ActiveHouse from '../../assets/House_02.svg';
import InActiveHeart from '../../assets/Heart_01.svg';
import ActiveHeart from '../../assets/Heart_02.svg';
import InactiveUser from '../../assets/User_01.svg';
import ActiveUser from '../../assets/User_active.svg'
import InactiveSearch from '../../assets/Search_Magnifying_Glass.svg';
import ActiveSearch from '../../assets/Search_01.svg';
import UnderArrow from '../../assets/Chevron_Down.svg';
import Navi from '../../assets/Navigation.svg';
import InactiveJim from '../../assets/JimInactive.svg';
import ActiveJim from '../../assets/Jimactive.svg';
import { normalize } from '../../normallize';
import SearchIcon from '../../assets/Search.svg';
import * as Location from "expo-location";
import axios from "axios";
import { useAuth } from '../../context/AuthContext';

const Tab = createBottomTabNavigator();

const KAKAO_REST_API_KEY = "b2f1d72ae0832594f5212637f336234c";

type FacilityItem = {
  FCLTY_NM: string;
  COURSE_NM: string;
  COURSE_NO: number;
  COURSE_PRC: number;
  CTPRVN_NM: string;
  ITEM_NM: string;
  SIGNGU_NM: string;
  TROBL_TY_NM: string;
};

type LocationItem = {
  facilityName: string;
  courseName: string;
};

function HomeScreen() {
  // 각 버튼의 상태를 배열로 관리
  const [jimStates, setJimStates] = useState([false, false, false, false, false]);

  const [apiResponse, setApiResponse] = useState(null); // API 응답 상태
  const [error, setError] = useState<string | null>(null);

  const [addressText, setAddressText] = useState("위치 X");

  const [locations, setLocations] = useState<LocationItem[]>([]);

  const { token } = useAuth();

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        // 위치 권한 요청
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setAddressText("위치 권한이 거부되었습니다.");
          return;
        }
    
        // 현재 위치 가져오기
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
    
        // 카카오 지도 API 호출
        const response = await axios.get("https://dapi.kakao.com/v2/local/geo/coord2address.json", {
          headers: { Authorization: `KakaoAK ${KAKAO_REST_API_KEY}` },
          params: { x: longitude, y: latitude },
        });
    
        if (response.data && response.data.documents.length > 0) {
          const address = response.data.documents[0].address;
          setAddressText(address.region_1depth_name); // 시(city) 정보 추출
    
          // 서버에 위치 정보 전송
          const userToken = token;  // 실제 사용자의 JWT 토큰을 가져와야 합니다
          await axios.post('https://port-0-flask-m49z6h7qc9e231b8.sel4.cloudtype.app/process_user_selection', {
            token: userToken,
            region: address.region_1depth_name  // 현재 위치를 서버에 전달
          });
    
        } else {
          setAddressText("주소 정보를 가져올 수 없습니다.");
        }
      } catch (error) {
        console.error(error);
        setAddressText("위치 정보를 가져오는 중 오류 발생");
      }
    };
    
    fetchLocation();
    
  }, []);

  const fetchUserSelection = async () => {
    try {
      const response = await axios.post(
        'https://port-0-flask-m49z6h7qc9e231b8.sel4.cloudtype.app/process_user_selection',
        { token: token },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setApiResponse(response.data); 
      // Map the FCLTY_NM and COURSE_NM values from the API response to locations
      if (response.data && response.data.recommendations) {
        const facilityData = response.data.recommendations[0]["추천 데이터"].map(
          (item: FacilityItem) => ({
            facilityName: item.FCLTY_NM,
            courseName: item.COURSE_NM
          })
        );
        setLocations(facilityData); // Store both facilityName and courseName
      }
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message); 
    }
  };


  // 컴포넌트가 마운트될 때 API 호출
  useEffect(() => {
    if (token) { // token이 존재할 경우에만 API 호출
      fetchUserSelection();
    } else {
      setError("토큰이 유효하지 않습니다."); // 에러 메시지 설정
    }
  }, [token]);

  const [fontsLoaded] = useFonts({
    PretendardBold: require("../../assets/fonts/otf/Pretendard-Bold.otf"),
    PretendardSemiBold: require("../../assets/fonts/otf/Pretendard-SemiBold.otf"),
    PretendardRegular: require("../../assets/fonts/otf/Pretendard-Regular.otf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.screen}>
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  // 버튼 상태 토글 함수
  const toggleJim = (index: number) => {
    setJimStates((prevStates) =>
      prevStates.map((state, i) => (i === index ? !state : state))
    );
  };

  return (
    <View style={styles.home}>
      <Text style={styles.title}>추천 정보</Text>
      <View style={styles.selectbox}>
        <View style={styles.info}>
          <Text style={styles.infotext}>가까운 순</Text>
          <UnderArrow style={styles.arrow} />
        </View>
        <View style={styles.address}>
          <Navi style={styles.addressarrow} />
          <Text style={styles.addresstext}>{addressText}</Text>
        </View>
      </View><View style={styles.onecontainer}>
        {locations.map((location, index) => (
          <View style={styles.one} key={index}>
            <View style={styles.onebox}>
              <View style={styles.onetextcontainer}>
                <Text style={styles.onetext}>{location.facilityName}</Text>
                <Text style={styles.onetextinfo}>({location.courseName})</Text>
              </View>
              <TouchableOpacity onPress={() => toggleJim(index)}>
                {jimStates[index] ? (
                  <ActiveJim style={styles.jim} />
                ) : (
                  <InactiveJim style={styles.jim} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}


function FavoritesScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.text}>Favorites Screen</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.text}>Profile Screen</Text>
    </View>
  );
}

function SearchScreen() {
  return (
    <View style={styles.searchscreen}>
      <View style={styles.searchcontainer}>
        <View style={styles.inputContainer}>
            <SearchIcon style={styles.search} width={16} height={16} />
            <TextInput
              style={styles.input}
              placeholder="검색어 입력"
              placeholderTextColor="#aaa"
            />
        </View>
        <View style={styles.spacer}>
          <Text style={styles.searchColor}>
            최근 검색어
          </Text>
          <TouchableOpacity>
            <Text style={styles.buttonText}>전체 삭제</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function Home() {
  return (
    <NavigationIndependentTree>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            ...styles.underbar,
          },
          tabBarShowLabel: false,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.iconContainer}>
                {focused ? <ActiveHouse /> : <InactiveHouse />}
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Favorites"
          component={FavoritesScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.iconContainer}>
                {focused ? <ActiveHeart /> : <InActiveHeart />}
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.iconContainer}>
                {focused ? <ActiveSearch /> : <InactiveSearch />}
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.iconContainer}>
                {focused ? <ActiveUser /> : <InactiveUser />}
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationIndependentTree>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#181A20',
  },
  searchscreen: {
    flex: 1,
    backgroundColor: '#181A20',
    alignItems: 'center',
    
  },
  home: {
    flex: 1,
    backgroundColor: '#181A20',
  },
  title: {
    top: Platform.OS === 'ios' ? 80 : 60,
    color: '#fff',
    fontSize: 24,
    left: 50,
    fontFamily: 'PretendardSemiBold'
  },
  onetextcontainer: {
    flexDirection: 'column',
  },
  info: {
    backgroundColor: '#252932',
    width: 80,
    height: 28,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center', 
    flexDirection: 'row',
  },
  infotext: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 12,
    fontFamily: 'PretendardSemiBold'
  },
  arrow: {
    left: 5
  },
  addressarrow: {
    right: 5
  },
  address: {
    backgroundColor: '#252932',
    width: 80,
    height: 28,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addresstext : {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'PretendardSemiBold'
  },
  selectbox: {
    flexDirection: 'row',
    gap: 10,
    top: Platform.OS === 'ios' ? 100: 80,
    left: 50
  },
  one: {
    width: 270,
    height: 170,
    backgroundColor: '#252932',
    borderRadius: 10,
  },
  onetext: {
    color: '#fff',
    fontFamily: 'PretendardBold',
    fontSize: 16,
    width: 190,
    top: 16,
    left: 16
  },
  onetextinfo: {
    color: '#fff',
    top: 20,
    left: 16
  },
  text: {
    color: '#fff',
    fontSize: 24,
  },
  underbar: {
    backgroundColor: '#252932',
    height: Platform.OS === 'ios' ? 70 : 60,
    justifyContent: 'center',
    borderTopWidth: 0,
  },
  jim: {
    top: Platform.OS === 'ios' ? 15 : 17,
    left: 40,
  },
  onecontainer: {
    flex:1,
    alignItems: 'center',
    top: 120,
    gap: 50
  },
  onebox: {
    flexDirection: 'row',
  },
  iconContainer: {
    flex:1,
    top: 5
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D9D9D9',
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: normalize(313),
    height: normalize(40),
  },
  searchcontainer: {
    top: 70
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    marginLeft: 10,
    fontFamily: "PretendardRegular"
  },
  search: {
  },
  buttonText: {
    color: "#7D7D7D",
    fontFamily: "PretendardBold",
    fontSize: 16,
  },
  searchColor: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "PretendardRegular",
  },
  spacer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
});
