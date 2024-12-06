import React from 'react'
import {
	Button,
	StyleSheet,
	Text,
	View,
} from 'react-native'
import type { PotteryItem } from '../models'

export const PotteryItemComponent: React.FC<{
  potteryItem: PotteryItem;
}> = ({ potteryItem }) => {
	return (
		<View style={styles.cardContainer}>
			<View style={styles.textContainer}>
				<Text
					style={styles.sectionTitle}>
					{potteryItem.projectTitle}
				</Text>
			</View>
		</View>
	)
}
const styles = StyleSheet.create({
	cardContainer: {
		marginTop: 10,
		paddingHorizontal: 24,
		backgroundColor: 'deepskyblue',
		marginLeft: 20,
		marginRight: 20,
		borderRadius: 10,
		borderColor: 'black',
		borderWidth: 1,
	},
	textContainer: {
		justifyContent: 'center',
		flexDirection: 'row',
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: '400',
	}
})