
import { useCallback, useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { LaunchScreen } from '../components/LaunchScreen';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const [launchVisible, setLaunchVisible] = useState(true);

  useEffect(() => {
    async function prepareApp() {
      try {
        // Charge ici les polices, préférences et données
        // indispensables au premier affichage.
      } finally {
        setAppReady(true);
      }
    }

    prepareApp();
  }, []);

  const hideNativeSplash = useCallback(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  const finishLaunch = useCallback(() => {
    setLaunchVisible(false);
  }, []);

  if (!appReady) {
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />

      {launchVisible && (
        <LaunchScreen
          onFinish={finishLaunch}
        />
      )}
    </>
  );
}
