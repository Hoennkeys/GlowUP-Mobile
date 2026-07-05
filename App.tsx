/**
 * GlowUP Mobile App
 *
 * @format
 */

import React, { useState } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Providers } from './src/app';
import { AppNavigator } from './src/navigation/AppNavigator';
import { SplashScreen } from './src/screens';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Providers>
        {isSplashVisible ? (
          <SplashScreen onFinish={() => setIsSplashVisible(false)} />
        ) : (
          <AppNavigator />
        )}
      </Providers>
    </SafeAreaProvider>
  );
}

export default App;
