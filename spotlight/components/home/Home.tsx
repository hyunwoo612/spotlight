import React from 'react';
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
import { normalize } from '../../normallize';
import SearchIcon from '../../assets/Search.svg';

const Tab = createBottomTabNavigator();

function HomeScreen() {

  const [fontsLoaded] = useFonts({
    PretendardBold: require("../../assets/fonts/otf/Pretendard-Bold.otf"),
    PretendardSemiBold: require("../../assets/fonts/otf/Pretendard-SemiBold.otf"),
    PretendardRegular: require("../../assets/fonts/otf/Pretendard-Regular.otf"),
  });

  if (!fontsLoaded) return null;

  return (
    <View style={styles.home}>
      <Text style={styles.title}>추천 정보</Text>
        <View style={styles.selectbox}>
        <View style={styles.info}><Text style={styles.infotext}>가까운 순</Text><UnderArrow style={styles.arrow} /></View>
        <View style={styles.address}><Navi style={styles.addressarrow}/><Text style={styles.addresstext}>화천리</Text></View>
        </View>
      <View style={styles.onecontainer}>
        <View style={styles.one}>
          <View style={styles.onebox}>
            <Text style={styles.onetext}>더스윙블랙경기광주태전점</Text>
            <InactiveJim style={styles.Jim} width={20} height={20}/>
          </View>
        </View>
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

  },
  onecontainer: {
    flex:1,
    alignItems: 'center',
    top: 120
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
