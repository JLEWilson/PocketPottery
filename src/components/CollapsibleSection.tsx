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
          <Text style={[styles.toggleButtonText, { color: colors.text }]}>
            {isExpanded ? hideText : showText}
          </Text>
          {isExpanded ? (
            <Ionicons name="caret-up-outline" size={24} color={colors.text} />
          ) : (
            <Ionicons name="caret-down-outline" size={24} color={colors.text} />
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
    padding: 4,
  },
  toggleButton: {
    padding: 10,
    alignItems: 'center',
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  toggleButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  detailsText: {
    fontSize: 14,
    color: 'black',
  },
  scrollArea: {
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: 'black',
    flex: 1,
    flexDirection: 'row',
  },
})
