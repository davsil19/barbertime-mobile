// Navegación: Auth (login/registro) o Main (tabs según rol + pantallas de detalle)
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '../theme';
import Icon from '../components/Icon';
import { useAuth } from '../controllers/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import CitasScreen from '../screens/CitasScreen';
import CitaFormScreen from '../screens/CitaFormScreen';
import CitaDetailScreen from '../screens/CitaDetailScreen';
import UsersScreen from '../screens/UsersScreen';
import UserDetailScreen from '../screens/UserDetailScreen';
import UserFormScreen from '../screens/UserFormScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AudioScreen from '../screens/AudioScreen';
import CameraScreen from '../screens/CameraScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const tema = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: colors.cream } };

const TABS_CLIENTE = [['Inicio', HomeScreen, 'home', 'Inicio'], ['Citas', CitasScreen, 'calendar', 'Mis citas'], ['Agendar', CitaFormScreen, 'plus', 'Agendar'], ['Perfil', ProfileScreen, 'user', 'Perfil']];
const TABS_ADMIN = [['Inicio', HomeScreen, 'grid', 'Panel'], ['Usuarios', UsersScreen, 'users', 'Usuarios'], ['Citas', CitasScreen, 'calendar', 'Citas'], ['Perfil', ProfileScreen, 'user', 'Perfil']];

function Tabs() {
  const { esAdmin } = useAuth();
  const ins = useSafeAreaInsets();
  const lista = esAdmin ? TABS_ADMIN : TABS_CLIENTE;
  return (
    <Tab.Navigator key={esAdmin ? 'a' : 'c'} screenOptions={{
      headerShown: false, tabBarActiveTintColor: colors.goldD, tabBarInactiveTintColor: colors.mut,
      tabBarStyle: { height: 64 + ins.bottom, backgroundColor: colors.paper, borderTopColor: colors.line, paddingTop: 8, paddingBottom: 6 + ins.bottom },
      tabBarLabelStyle: { fontFamily: fonts.m, fontSize: 10.5 },
    }}>
      {lista.map(([name, comp, icon, label]) => (
        <Tab.Screen key={name} name={name} component={comp}
          options={{ tabBarLabel: label, tabBarButtonTestID: `tab-${name}`, tabBarIcon: ({ color }) => <Icon name={icon} size={24} color={color} /> }} />))}
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, cargando } = useAuth();
  if (cargando) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cream }}><ActivityIndicator color={colors.goldD} size="large" /></View>;
  return (
    <NavigationContainer theme={tema}>
      <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.cream } }}>
        {!user ? (<>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>) : (<>
          <Stack.Screen name="Tabs" component={Tabs} />
          <Stack.Screen name="CitaDetail" component={CitaDetailScreen} />
          <Stack.Screen name="CitaForm" component={CitaFormScreen} />
          <Stack.Screen name="UserDetail" component={UserDetailScreen} />
          <Stack.Screen name="UserForm" component={UserFormScreen} />
          <Stack.Screen name="Audio" component={AudioScreen} />
          <Stack.Screen name="Camera" component={CameraScreen} options={{ presentation: 'modal' }} />
        </>)}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
