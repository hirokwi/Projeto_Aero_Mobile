import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';


import Login from './src/paginas/login';
import Create from './src/paginas/create';
import MeusVoos from './src/paginas/meusvoos';
import Servicos from './src/paginas/servicos';
import Aeroporto from './src/paginas/aeroporto';
import Perfil from './src/paginas/perfil';
import Check_in from './src/paginas/check_in';
import Gerenciar from './src/paginas/gerenciar';
import Rastrear from './src/paginas/rastrear';
import Empresa from './src/paginas/empresa';
import Inbox from './src/paginas/inbox';


const Stack = createStackNavigator();

export const api = 'http://*******/aero_conexao/';

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Create" component={Create} />
        <Stack.Screen name="MeusVoos" component={MeusVoos} />
        <Stack.Screen name="Servicos" component={Servicos} />
        <Stack.Screen name="Aeroporto" component={Aeroporto} />
        <Stack.Screen name="Perfil" component={Perfil} />
        <Stack.Screen name="Check_in" component={Check_in} />
        <Stack.Screen name="Gerenciar" component={Gerenciar} />
        <Stack.Screen name="Rastrear" component={Rastrear} />
        <Stack.Screen name="Empresa" component={Empresa} />
        <Stack.Screen name="Inbox" component={Inbox} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
