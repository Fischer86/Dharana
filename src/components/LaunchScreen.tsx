
import { useEffect } from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

type Props = {
  onFinish: () => void;
};

const SIZE = 140;
const UNIT = SIZE / 100;
const EASE = Easing.bezier(0.22, 0.8, 0.24, 1);

// Anneau avec une ouverture décentrée, fidèle au SVG original.
const RING =
  'M10,50 a40,40 0 1,0 80,0 a40,40 0 1,0 -80,0Z ' +
  'M26,55 a24,24 0 1,0 48,0 a24,24 0 1,0 -48,0Z';

export function LaunchScreen({ onFinish }: Props) {
  const isDark = useColorScheme() === 'dark';
  const reduceMotion = useReducedMotion();

  const background = isDark ? '#000000' : '#F4F1EA';
  const ink = isDark ? '#F4F1EA' : '#0B0B0A';

  const ringOpacity = useSharedValue(0);
  const ringScale = useSharedValue(1.35);

  const dotOpacity = useSharedValue(0);
  const dotScale = useSharedValue(0.6);
  const dotY = useSharedValue(-5 * UNIT);

  const overlayOpacity = useSharedValue(1);

  useEffect(() => {
    const duration = reduceMotion ? 500 : 3700;
    const fadeDuration = reduceMotion ? 150 : 500;

    if (reduceMotion) {
      ringOpacity.value = 1;
      ringScale.value = 1;
      dotOpacity.value = 1;
      dotScale.value = 1;
      dotY.value = 0;
    } else {
      // 0–18% : le point apparaît.
      dotOpacity.value = withDelay(
        400,
        withTiming(1, { duration: 500, easing: EASE }),
      );

      dotScale.value = withDelay(
        400,
        withTiming(1, { duration: 500, easing: EASE }),
      );

      // 18–42% : l'anneau apparaît et se stabilise.
      ringOpacity.value = withDelay(
        900,
        withTiming(1, { duration: 700, easing: EASE }),
      );

      ringScale.value = withDelay(
        900,
        withTiming(1, { duration: 1200, easing: EASE }),
      );

      // 42–58% : le point rejoint sa position finale.
      dotY.value = withDelay(
        2100,
        withTiming(0, { duration: 800, easing: EASE }),
      );
    }

    // 64–74% : fondu de sortie du voile.
    overlayOpacity.value = withDelay(
      duration - fadeDuration,
      withTiming(0, {
        duration: fadeDuration,
        easing: EASE,
      }),
    );

    const timeout = setTimeout(
      onFinish,
      duration + 50,
    );

    return () => clearTimeout(timeout);
  }, [
    onFinish,
    reduceMotion,
    ringOpacity,
    ringScale,
    dotOpacity,
    dotScale,
    dotY,
    overlayOpacity,
  ]);

  const ringStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value,
    transform: [{ scale: ringScale.value }],
  }));

  const dotStyle = useAnimatedStyle(() => ({
    opacity: dotOpacity.value,
    transform: [
      { translateY: dotY.value },
      { scale: dotScale.value },
    ],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFillObject,
        styles.container,
        { backgroundColor: background },
        overlayStyle,
      ]}
    >
      <View style={styles.mark}>
        <Animated.View
          style={[StyleSheet.absoluteFillObject, ringStyle]}
        >
          <Svg
            width={SIZE}
            height={SIZE}
            viewBox="0 0 100 100"
          >
            <Path
              d={RING}
              fill={ink}
              fillRule="evenodd"
            />
          </Svg>
        </Animated.View>

        <Animated.View
          style={[
            styles.dot,
            {
              left: 42 * UNIT,
              top: 47 * UNIT,
              width: 16 * UNIT,
              height: 16 * UNIT,
              borderRadius: 8 * UNIT,
              backgroundColor: ink,
            },
            dotStyle,
          ]}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mark: {
    width: SIZE,
    height: SIZE,
  },
  dot: {
    position: 'absolute',
  },
});
