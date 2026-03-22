import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Svg, { Path } from 'react-native-svg';

import { Page } from './components/home/Page';
import { DetailsPage } from './components/details/DetailsPage';
import { WatchlistPage } from './components/watchlist/WatchlistPage';

const queryClient = new QueryClient();
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeIcon = ({ color, focused }: { color: string, focused: boolean }) => (
  <Svg width="26" height="20" viewBox="0 0 26 20" fill="none">
    <Path d="M12.5658 4.03735L3.60276 11.4265C3.60276 11.4369 3.60014 11.4522 3.5949 11.4731C3.58977 11.4939 3.58704 11.5089 3.58704 11.5197V19.0019C3.58704 19.272 3.68581 19.5062 3.88329 19.7033C4.08072 19.9006 4.31451 19.9998 4.58472 19.9998H10.5704V14.0139H14.5613V20.0001H20.5469C20.8171 20.0001 21.0512 19.901 21.2484 19.7033C21.4458 19.5064 21.5449 19.2721 21.5449 19.0019V11.5197C21.5449 11.4782 21.5393 11.4468 21.5292 11.4265L12.5658 4.03735Z" fill={color}/>
    <Path d="M24.9582 9.74279L21.5446 6.90574V0.545713C21.5446 0.400317 21.4979 0.280746 21.4041 0.187164C21.3111 0.0936912 21.1915 0.0469548 21.0458 0.0469548H18.0529C17.9073 0.0469548 17.7878 0.0936912 17.6942 0.187164C17.6008 0.280746 17.5541 0.400371 17.5541 0.545713V3.58538L13.7506 0.405285C13.4184 0.135077 13.0235 0 12.5662 0C12.1089 0 11.714 0.135077 11.3815 0.405285L0.173217 9.74279C0.069316 9.82578 0.0123697 9.93749 0.00177759 10.0778C-0.00875993 10.218 0.0275481 10.3405 0.110811 10.4443L1.07726 11.5979C1.16052 11.6914 1.2695 11.7485 1.40463 11.7694C1.52939 11.7799 1.65415 11.7434 1.77891 11.6603L12.5658 2.66567L23.3529 11.6603C23.4362 11.7328 23.5451 11.769 23.6802 11.769H23.7271C23.862 11.7485 23.9708 11.6909 24.0545 11.5977L25.021 10.4443C25.1041 10.3402 25.1405 10.218 25.1297 10.0776C25.1191 9.93765 25.0619 9.82594 24.9582 9.74279Z" fill={color}/>
  </Svg>
);

const WatchlistIcon = ({ color, focused }: { color: string, focused: boolean }) => (
  <Svg width="16" height="20" viewBox="0 0 16 20" fill="none">
    <Path d="M13.3789 0C14.3238 0 15.0906 0.777203 15.0908 1.69727V18.8643C15.0907 19.6489 14.6467 20 14.1914 20C13.9223 19.9999 13.6547 19.8794 13.3887 19.6523L8.21484 15.2461C8.05412 15.1088 7.82421 15.0304 7.58496 15.0303C7.34548 15.0303 7.11444 15.1082 6.9541 15.2451L1.7627 19.6533C1.49748 19.8799 1.21017 20 0.94043 20C0.65516 20.0001 0.388857 19.864 0.223633 19.627C0.0855771 19.4287 7.92182e-05 19.172 0 18.8643V1.69727C0.000287967 0.77736 0.829701 0.000265203 1.77441 0H13.3789Z" fill={color}/>
    <Path d="M13.3789 0C14.3238 0 15.0906 0.777203 15.0908 1.69727V18.8643C15.0907 19.6489 14.6467 20 14.1914 20C13.9223 19.9999 13.6547 19.8794 13.3887 19.6523L8.21484 15.2461C8.05412 15.1088 7.82421 15.0304 7.58496 15.0303C7.34548 15.0303 7.11444 15.1082 6.9541 15.2451L1.7627 19.6533C1.49748 19.8799 1.21017 20 0.94043 20C0.65516 20.0001 0.388857 19.864 0.223633 19.627C0.0855771 19.4287 7.92182e-05 19.172 0 18.8643V1.69727C0.000287967 0.77736 0.829701 0.000265203 1.77441 0H13.3789Z" stroke="#032541"/>
  </Svg>
);

const HomeStack = createNativeStackNavigator();
function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={Page} />
      <HomeStack.Screen name="Details" component={DetailsPage} />
    </HomeStack.Navigator>
  );
}

const WatchlistStack = createNativeStackNavigator();
function WatchlistStackScreen() {
  return (
    <WatchlistStack.Navigator screenOptions={{ headerShown: false }}>
      <WatchlistStack.Screen name="Watchlist" component={WatchlistPage} />
      <WatchlistStack.Screen name="Details" component={DetailsPage} />
    </WatchlistStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
        tabBarStyle: {
          backgroundColor: '#032541',
          height: 75,
          paddingTop: 12,
          paddingBottom: 8,
          borderTopWidth: 0,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackScreen}
        options={{
          tabBarIcon: ({ color, focused }) => <HomeIcon color={color} focused={focused} />,
        }}
      />
      <Tab.Screen
        name="WatchlistTab"
        component={WatchlistStackScreen}
        options={{
          tabBarIcon: ({ color, focused }) => <WatchlistIcon color={color} focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <NavigationContainer>
          <MainTabs />
        </NavigationContainer>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
