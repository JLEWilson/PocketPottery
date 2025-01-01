import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, } from 'react-native'
import { useTheme } from '@react-navigation/native'
import Ionicons from '@expo/vector-icons/Ionicons'

type CollapsibleSectionProps = {
  showText: string
  hideText: string
  onExpand: () => void
  onCollapse: () => void
  children: React.ReactNode
}

const CollapsibleSection = ({
  showText,
  hideText,
  onExpand,
  onCollapse,
  children,
}: CollapsibleSectionProps) => {
  const { colors } = useTheme()
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleDetails = () => {
    setIsExpanded(!isExpanded)
    isExpanded ? onCollapse() : onExpand()
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleDetails} style={styles.toggleButton}>
        <View style={{ borderWidth: 1, borderColor: colors.text, height: 0, flex: 1 }} />
        <View style={{ flexDirection: 'row', flex: 3, justifyContent: 'center' }}>
          <Text style={[styles.toggleButtonText, { color: colors.text, fontFamily: 'heading', marginHorizontal: 5}]}>
            {isExpanded ? hideText : showText}
          </Text>
          {isExpanded ? (
            <Ionicons name="caret-up-outline" size={20} color={colors.text} />
          ) : (
            <Ionicons name="caret-down-outline" size={20} color={colors.text} />
          )}
        </View>
        <View style={{ borderWidth: 1, borderColor: colors.text, height: 0, flex: 1 }} />
      </TouchableOpacity>
      {isExpanded && (
        <View
          style={[
            styles.scrollArea,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
        >
          <ScrollView
            contentContainerStyle={{ backgroundColor: colors.background }}
          >
            {children}
          </ScrollView>
        </View>
      )}
    </View>
  )
}

export default CollapsibleSection

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toggleButton: {
    padding: 10,
    alignItems: 'center',
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  toggleButtonText: {
    fontSize: 14,
  },
  scrollArea: {
    marginHorizontal: 10,
    flex: 1,
    flexDirection: 'row',
  },
})
