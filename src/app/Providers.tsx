import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './AuthProvider';
import { ThemeProvider } from './ThemeProvider';
import { LanguageProvider } from '../i18n/LanguageContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <NavigationContainer>{children}</NavigationContainer>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
