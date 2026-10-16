import { View, Text, StyleSheet, useWindowDimensions, TouchableOpacity } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useEffect, useState } from 'react';

type TimerProps = {
    isDark?: boolean;
};

export default function Timer({ isDark = false }: TimerProps) {
    const initialTime = 25 * 60;
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [isRunning, setIsRunning] = useState(false);

    const { width, height } = useWindowDimensions();
    const safeWidth = width || 360;
    const safeHeight = height || 800;

    const size = Math.min(safeWidth * 0.65, safeHeight * 0.35, 300);
    const radius = size * 0.46;
    const strokeWidth = size * 0.025;
    const fontSize = size * 0.19;

    // --- Calculs pour le cercle SVG ---
    const circumference = 2 * Math.PI * radius;
    const progress = timeLeft / initialTime;
    const strokeDashoffset = circumference * (1 - progress);

    // --- Couleurs dynamiques selon le thème ---
    const textColor = isDark ? '#ffffff' : '#111111';
    const trackColor = isDark ? '#2a2a2a' : '#e5e5e5';
    const progressColor = isDark ? '#ffffff' : '#111111';

    // Couleurs dédiées aux boutons
    const primaryBtnBg = isDark ? '#ffffff' : '#111111';
    const primaryBtnText = isDark ? '#111111' : '#ffffff'; // Texte noir sur bouton blanc en Dark Mode (et inversement)
    const secondaryBtnBg = isDark ? '#2a2a2a' : '#e0e0e0';

    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            setTimeLeft((previousTime) => {
                if (previousTime <= 1) {
                    setIsRunning(false);
                    return 0;
                }
                return previousTime - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning]);

    const handleReset = () => {
        setIsRunning(false);
        setTimeLeft(initialTime);
    };

    return (
        <View style={styles.container}>
            <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
                <Svg width={size} height={size}>
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={trackColor}
                        strokeWidth={strokeWidth}
                        fill="none"
                    />
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={progressColor}
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        rotation="-90"
                        origin={`${size / 2}, ${size / 2}`}
                    />
                </Svg>

                <View style={styles.textContainer}>
                    <Text style={[styles.text, { fontSize, color: textColor }]}>
                        {Math.floor(timeLeft / 60)
                            .toString()
                            .padStart(2, '0')}
                        :
                        {(timeLeft % 60).toString().padStart(2, '0')}
                    </Text>
                </View>
            </View>

            <View style={styles.controls}>
                {/* Bouton Start / Pause */}
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: primaryBtnBg }]}
                    onPress={() => setIsRunning(!isRunning)}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.buttonText, { color: primaryBtnText }]}>
                        {isRunning ? 'Pause' : 'Start'}
                    </Text>
                </TouchableOpacity>

                {/* Bouton Reset */}
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: secondaryBtnBg }]}
                    onPress={handleReset}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.buttonText, { color: textColor }]}>
                        Reset
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    textContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontWeight: '300',
        fontVariant: ['tabular-nums'],
    },
    controls: {
        flexDirection: 'row',
        marginTop: 32,
        gap: 16,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 28,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});