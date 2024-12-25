import React from 'react'
import { Pressable, Animated, StyleSheet, PressableProps, StyleProp, ViewStyle } from 'react-native'

// Define props for the AnimatedPressable
interface AnimatedPressableProps extends PressableProps {
  style?: StyleProp<ViewStyle> // Accepts style for the wrapper
  children?: React.ReactNode // Accepts any React child elements
}

const AnimatedPressable: React.FC<AnimatedPressableProps> = ({
  children,
  style,
  onPress,
  ...props
}) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current
  const opacityValue = React.useRef(new Animated.Value(1)).current

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(scaleValue, {
        toValue: 0.9, // Shrink effect
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: 0.8, // Fade effect
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const handlePressOut = () => {
    Animated.parallel([
      Animated.timing(scaleValue, {
        toValue: 1, // Return to original size
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: 1, // Return to full opacity
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start()
  }

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={onPress} {...props}>
      <Animated.View style={[{ transform: [{ scale: scaleValue }], opacity: opacityValue }, style]}>
        {children}
      </Animated.View>
    </Pressable>
  )
}

export default AnimatedPressable
