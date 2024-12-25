import React from 'react'
import { Pressable, ImageBackground, StyleSheet, Text, View } from 'react-native'
import type { PotteryItem } from '../models'
import { useTheme } from '@react-navigation/native'
import AnimatedPressable from './AnimatedPressable'
import TextStroke from './TextStroke'

export const PotteryItemComponent: React.FC<{
  potteryItem: PotteryItem
  handlePress: (id: string) => void
}> = ({ potteryItem, handlePress }) => {
  const { colors } = useTheme()
  return (
    <View style={[styles.cardContainer]}>
      <AnimatedPressable
        onPress={() => handlePress(potteryItem.potteryItemId)}
        style={[
          styles.innerContainer,
          { backgroundColor: colors.primary, borderColor: colors.border },
        ]}
      >
        {potteryItem.displayPicturePath.length > 1 ? (
          <ImageBackground
            source={{ uri: potteryItem.displayPicturePath }}
            style={[styles.textContainer]}
            resizeMode="cover"
            borderRadius={50}
          >
            <TextStroke color={colors.background} stroke={1.2}>
              <Text
                style={{
                  fontSize: 15,
                  textAlign: 'center',
                  color: colors.text,
                  fontFamily: 'textBold',
                }}
              >
                {potteryItem.projectTitle}
              </Text>
            </TextStroke>
          </ImageBackground>
        ) : (
          <View style={styles.textContainer}>
            <Text
              style={{
                fontSize: 15,
                textAlign: 'center',
                color: colors.text,
                fontFamily: 'textBold',
              }}
            >
              {potteryItem.projectTitle}
            </Text>
          </View>
        )}
      </AnimatedPressable>
    </View>
  )
}
const styles = StyleSheet.create({
  cardContainer: {
    width: '45%',
    alignItems: 'center',
    aspectRatio: 1,
    marginBottom: 20,
  },
  innerContainer: {
    borderWidth: 1,
    padding: 5,
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  textContainer: {
    flex: 1,
    padding: 5,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  imageContainer: {
    borderRadius: 50,
  },
  projectTitle: {
    fontSize: 15,
    textAlign: 'center',
  },
})
