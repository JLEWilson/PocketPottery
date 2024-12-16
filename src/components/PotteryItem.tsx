import React from 'react'
import {
	Pressable,
	ImageBackground,
	StyleSheet,
	Text,
	View,
} from 'react-native'
import type { PotteryItem } from '../models'
import { useTheme } from '@react-navigation/native';

export const PotteryItemComponent: React.FC<{
  potteryItem: PotteryItem;
}> = ({ potteryItem }) => {
	const {colors} = useTheme()

	return (
		<View style={[styles.cardContainer]}>
			<View  style={[styles.innerContainer, {backgroundColor: colors.primary, borderColor: colors.border}]}>
				{potteryItem.displayPicturePath.length > 1? 
					<ImageBackground 
						source={{ uri: potteryItem.displayPicturePath}} 
						style={[styles.textContainer]}
						resizeMode='cover'
						borderRadius={50}
						>
						<Text
							style={[styles.projectTitle, {color: colors.text}]}>
							{potteryItem.projectTitle}
						</Text>
					</ImageBackground>
					:
					<View 
					style={styles.textContainer}
					>
						<Text
							style={styles.projectTitle}>
							{potteryItem.projectTitle}
						</Text>
					</View>
				}
			</View>
		</View>
	)
}
const styles = StyleSheet.create({
	cardContainer: {
		width: '45%',
		alignItems: 'center',
		aspectRatio: 1,
		marginBottom: 20
	},
	innerContainer: {
		borderWidth: 1,
		padding: 5,
		width: 100,
		height: 100,
		borderRadius: 50
	},
	textContainer: {
		flex: 1,
		padding: 5,
		justifyContent: 'space-around',
		alignItems: 'center'
	},
	imageContainer: {
		borderRadius: 50
	},
	projectTitle: {
		fontSize: 15,
		fontWeight: 'bold',
		textAlign: 'center'
	}
})