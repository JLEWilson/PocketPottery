import { View, Text, TouchableOpacity } from 'react-native'
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { StyleSheet } from 'react-native'
import { useTheme } from '@react-navigation/native'
import type { ClaysListProps } from './ClaysList'
import { GlazesListProps } from './GlazesList'

export type RootTabParamList = {
  PotteryItemsList: undefined
  ClaysList: ClaysListProps
  GlazesList: GlazesListProps
}
export type RootStackParamList = {
  Tabs: undefined
  PotteryItemView: { id: string }
}

export default function MyTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel.toString()
            : options.title !== undefined
              ? options.title
              : route.name

        const isFocused = state.index === index

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          })

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params)
          }
        }

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          })
        }

        const IconComponent =
          options.tabBarIcon &&
          options.tabBarIcon({
            focused: isFocused,
            color: isFocused ? colors.text : colors.background,
            size: 24,
          })

        return (
          <View key={`NavButtonWrapper: ${index}`}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              key={`NavButton: ${index}`}
              style={[styles.button]}
            >
              {IconComponent}
              <Text
                key={`NavButtonText: ${index}`}
                style={{
                  color: isFocused ? colors.text : colors.background,
                  marginTop: -3,
                  fontFamily: 'text',
                  textAlign: 'center',
                  fontSize: 12
                }}
              >
                {label}
              </Text>
            </TouchableOpacity>
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 5,
    height: 50,
    justifyContent: 'space-evenly',
  },
  button: {
    flex: 1,
    marginVertical: 4,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
