import React, { useState, useEffect } from 'react';
import { useFonts } from 'expo-font';
import { NavigationIndependentTree } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Platform, TextInput, TouchableOpacity, ScrollView } from 'react-native';
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
import { WebView } from 'react-native-webview';

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

  const [addressText, setAddressText] = useState("위치 X");

  const [locations, setLocations] = useState<LocationItem[]>([]);

  const { token } = useAuth();

  
    const fetchLocationAndUserSelection = async () => {
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

          // 위치 정보와 함께 사용자 선택 가져오기
          const userSelectionResponse = await axios.post(
            'http://127.0.0.1:5000/process_user_selection',
            { token: token, region: address.region_1depth_name },  // 현재 위치를 서버에 전달
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          setApiResponse(userSelectionResponse.data); 
          
          // Map the FCLTY_NM and COURSE_NM values from the API response to locations
          if (userSelectionResponse.data && userSelectionResponse.data.recommendations) {
            const facilityData = userSelectionResponse.data.recommendations[0]["추천 데이터"].map(
              (item: FacilityItem) => ({
                facilityName: item.FCLTY_NM,
                courseName: item.COURSE_NM
              })
            );
            setLocations(facilityData); // Store both facilityName and courseName
          }
        } else {
          setAddressText("주소 정보를 가져올 수 없습니다.");
        }
      } catch (error) {
        console.error(error);
        setAddressText("위치 정보를 가져오는 중 오류 발생");
      }
    };

  useEffect(() => {
    if(token) {
      fetchLocationAndUserSelection();
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
          <Text style={styles.infotext}>현재 위치</Text>
          <UnderArrow style={styles.arrow} />
        </View>
        <View style={styles.address}>
          <Navi style={styles.addressarrow} />
          <Text style={styles.addresstext}>{addressText}</Text>
        </View>
      </View>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.onecontainer}>
          {locations.map((location, index) => (
            <View style={styles.one} key={index}>
              <View style={styles.onebox}>
                <View style={styles.onetextcontainer}>
                  <Text style={location.facilityName.length >= 15 ? styles.onetext15 : styles.onetext}>{location.facilityName}</Text>
                  <Text style={styles.onetextinfo}>({location.courseName.length > 14 
                    ? `${location.courseName.slice(0, 14)}\n${location.courseName.slice(14)}` 
                    : location.courseName})
                  </Text>
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
      </ScrollView>
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

type LocationCoords = {
  latitude: number;
  longitude: number;
};

function ProfileScreen() {
  const [addressText, setAddressText] = useState("위치 X");
  const [location, setLocation] = useState<LocationCoords | null>(null); // 타입 지정

  const fetchLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setAddressText("위치 권한이 거부되었습니다.");
      return;
    }

    // 현재 위치 가져오기
    const currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation.coords); // 타입이 맞아야 함

    // 카카오 지도 API 호출
    const { latitude, longitude } = currentLocation.coords;
    const response = await axios.get("https://dapi.kakao.com/v2/local/geo/coord2address.json", {
      headers: { Authorization: `KakaoAK ${KAKAO_REST_API_KEY}` },
      params: { x: longitude, y: latitude },
    });

    // 주소 텍스트 업데이트
    if (response.data.documents.length > 0) {
      const address = response.data.documents[0].address;
      setAddressText(`${address.region_1depth_name} ${address.region_2depth_name} ${address.region_3depth_name}`);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8"/>
    <title>Kakao 지도 시작하기</title>
  </head>
  <body>
    <div id="map" style="width:500px;height:400px;"></div>
    <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=0cd1fefc92df0a90f8cbd111c9d76469"></script>
    <script>
      var container = document.getElementById('map');
      var options = {
        center: new kakao.maps.LatLng(33.450701, 126.570667),
        level: 3
      };

      var map = new kakao.maps.Map(container, options);
    </script>
  </body>
  </html>
`;


  return (
    <View style={styles.profilescreen}>
      {/* 상단 프로필 정보 */}
      <View style={styles.profileHeader}>
        <Text style={styles.profileName}>김민재</Text>
        <Text style={styles.profileEmail}>minjae@naver.com</Text>
      </View>

      {/* 네비게이션 버튼들 */}
      <View style={styles.navButtons}>
        <TouchableOpacity style={styles.navButton}>
          <InActiveHeart />
          <Text style={styles.navButtonText}>찜목록</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <InactiveSearch />
          <Text style={styles.navButtonText}>공지사항</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <InactiveUser />
          <Text style={styles.navButtonText}>이벤트</Text>
        </TouchableOpacity>
      </View>

      {/* 지도 영역 */}
      <View style={styles.mapContainer}>
        <Text style={styles.mapLabel}>현재 위치</Text>
        {location && (
          <WebView
            originWhitelist={['*']}
            source={{ html: htmlContent }}
            style={styles.map}
          />
        )}
      </View>

      {/* 고객센터 링크 */}
      <View style={styles.customerService}>
        <Text style={styles.customerServiceTitle}>고객센터</Text>
        <Text style={styles.customerServiceItem}>회원탈퇴</Text>
        <Text style={styles.customerServiceItem}>자주 묻는 질문</Text>
        <Text style={styles.customerServiceItem}>카카오톡 1:1 문의</Text>
        <Text style={styles.customerServiceItem}>스포트 라이트 이용 안내</Text>
      </View>

      {/* 로그아웃 버튼 */}
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>로그아웃</Text>
      </TouchableOpacity>
    </View>
  );
}


function SearchScreen() {
  const [searchText, setSearchText] = useState<string>(""); // 검색어
  const [searchResults, setSearchResults] = useState<LocationItem[]>([]); // 검색 결과
  const [errorMessage, setErrorMessage] = useState<string>(""); // 에러 메시지

  // 검색 실행 함수
  const handleSearch = async () => {
    if (!searchText.trim()) {
      setErrorMessage("검색어를 입력해주세요.");
      return;
    }
  
    try {
      const response = await axios.post('http://127.0.0.1:5000/search', { FCLTY_NM: searchText });
      console.log("검색 결과:", response.data);
  
      // 결과를 검증
      if (response.data && Array.isArray(response.data.results)) {
        setSearchResults(
          response.data.results.map((item : FacilityItem) => ({
            facilityName: item.FCLTY_NM || "시설 정보 없음",
            courseName: item.COURSE_NM || "코스 정보 없음",
          }))
        );
        setErrorMessage(""); // 오류 메시지 초기화
      } else {
        setSearchResults([]);
        setErrorMessage("검색 결과가 없습니다.");
      }
    } catch (error) {
      console.error("검색 요청 중 오류 발생:", error);
      setErrorMessage("검색 중 문제가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <View style={styles.searchscreen}>
      <View style={styles.searchcontainer}>
        <View style={styles.inputContainer}>
          {/* 검색 입력 */}
          <TextInput
            style={styles.input}
            placeholder="검색어 입력"
            placeholderTextColor="#7D7D7D"
            value={searchText}
            onChangeText={setSearchText}
          />
          {/* 검색 버튼 */}
          <TouchableOpacity onPress={handleSearch}>
            <SearchIcon style={styles.buttonText} />
          </TouchableOpacity>
        </View>
      </View>
      {errorMessage ? (
        <Text>{errorMessage}</Text>
      ) : null}
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.onecontainer}>
          {/* 검색 결과 출력 */}
          {searchResults.map((location, index) => (
            <View style={styles.one} key={index}>
              <View style={styles.onebox}>
                <View style={styles.onetextcontainer}>
                  <Text
                    style={
                      location.facilityName.length >= 15
                        ? styles.onetext15
                        : styles.onetext
                    }
                  >
                    {location.facilityName}
                  </Text>
                  <Text style={styles.onetextinfo}>
                    {location.courseName.length > 14
                      ? `${location.courseName.slice(0, 14)}\n${location.courseName.slice(14)}`
                      : location.courseName || "코스 정보 없음"}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
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
    rowGap:5,
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
    marginBottom: 20,
  },
  onetext: {
    color: '#fff',
    fontFamily: 'PretendardBold',
    fontSize: 16,
    width: 190,
    top: 16,
    left: 16
  },
  onetext15: {
    color: '#fff',
    fontFamily: 'PretendardBold',
    fontSize: 14,
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
    gap: 20
  },
  scrollContainer: {
    flexGrow: 1, // ScrollView의 내용을 충분히 차지하도록 설정
    top: 120,
    paddingBottom: 140, // 아래쪽 여백 추가
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
    color: '#7D7D7D',
    fontSize: 15,
    marginLeft: 10,
    fontFamily: "PretendardRegular"
  },
  search: {
  },
  buttonText: {
    marginRight: 10
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
  profilescreen: {
    flex: 1,
    backgroundColor: '#181A20',
  },
  profileHeader: {
    marginTop: 80,
    marginLeft: 20
  },
  profileName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'PretendardBold',
    marginBottom: 5,
  },
  profileEmail: {
    color: '#7D7D7D',
    fontSize: 14,
    fontFamily: 'PretendardRegular',
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginHorizontal: 20,
  },
  navButton: {
    alignItems: 'center',
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'PretendardRegular',
    marginTop: 8,
  },
  mapContainer: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  mapLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'PretendardBold',
    marginBottom: 10,
  },
  map: {
    height: 240,
    backgroundColor: '#252932',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholder: {
    color: '#7D7D7D',
    fontFamily: 'PretendardRegular',
    fontSize: 14,
  },
  customerService: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  customerServiceTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'PretendardBold',
    marginBottom: 10,
  },
  customerServiceItem: {
    color: '#7D7D7D',
    fontSize: 14,
    fontFamily: 'PretendardRegular',
    marginBottom: 5,
  },
  logoutButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#FF4D4D',
    marginLeft: 20,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoutText: {
    color: '#FFFFFF',
    fontFamily: 'PretendardSemiBold',
    fontSize: 14,
  },
});
