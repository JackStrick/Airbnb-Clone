import {
	View,
	Text,
	Button,
	StyleSheet,
	SafeAreaView,
	Image,
	TextInput,
	TouchableOpacity,
	ImageBackground,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";
import * as ImagePicker from "expo-image-picker";
import { Avatar } from "@rneui/themed";

const Page = () => {
	const { isSignedIn, signOut } = useAuth();
	const { user } = useUser();
	const [firstName, setFirstName] = useState(user?.firstName);
	const [lastName, setLastName] = useState(user?.lastName);
	const [email, setEmail] = useState(user?.emailAddresses[0].emailAddress);
	const [edit, setEdit] = useState(false);

	useEffect(() => {
		if (!user) return;

		setFirstName(user.firstName);
		setLastName(user.lastName);
		setEmail(user.emailAddresses[0].emailAddress);
	}, [user]);

	const onSaveUser = async () => {
		//Update user info
		try {
			if (!firstName || !lastName) return;
			await user?.update({
				firstName,
				lastName,
			});
		} catch (error) {
			console.error(error);
		} finally {
			setEdit(false);
		}
	};

	const onCaptureImage = async () => {
		// Save user image
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			quality: 0.75,
			base64: true,
		});

		if (!result.canceled) {
			const base64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
			user?.setProfileImage({
				file: base64,
			});
		}
	};

	return (
		<SafeAreaView style={defaultStyles.container}>
			<View style={styles.headerContainer}>
				<Text style={styles.header}>Profile</Text>
				<Ionicons name="notifications-outline" size={26} />
			</View>

			{user && (
				<View style={styles.card}>
					{edit ? (
						<TouchableOpacity
							onPress={onCaptureImage}
							style={{
								borderRadius: 50,
								height: 100,
								width: 100,
								backgroundColor: Colors.grey,
								opacity: 0.5,
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Avatar
								size={100}
								rounded
								source={{ uri: user?.imageUrl }}
								containerStyle={{
									backgroundColor: Colors.grey,
								}}
							>
								<Avatar.Accessory
									name="create-outline"
									type="ionicon"
									size={90}
									color={Colors.dark}
									style={{
										backgroundColor: "rgba(0, 0, 0, 0.01)",
										alignItems: "center",
										justifyContent: "center",
									}}
									onPress={onCaptureImage}
								/>
							</Avatar>
						</TouchableOpacity>
					) : (
						<Image
							source={{ uri: user?.imageUrl }}
							alt={
								firstName && lastName
									? firstName[0] + lastName[0]
									: "Image"
							}
							style={styles.avatar}
						/>
					)}

					<View style={{ flexDirection: "row", gap: 6 }}>
						{edit ? (
							// Editing
							<View style={styles.editRow}>
								<TextInput
									placeholder="First Name"
									value={firstName || ""}
									onChangeText={setFirstName}
									style={[
										defaultStyles.inputField,
										{ width: 100 },
									]}
								/>
								<TextInput
									placeholder="Last Name"
									value={lastName || ""}
									onChangeText={setLastName}
									style={[
										defaultStyles.inputField,
										{ width: 100 },
									]}
								/>
								<TouchableOpacity onPress={onSaveUser}>
									<Ionicons
										name="checkmark-outline"
										size={24}
										color={Colors.dark}
									/>
								</TouchableOpacity>
							</View>
						) : (
							// Not Editing
							<View style={styles.editRow}>
								<Text
									style={{
										fontFamily: "mon-b",
										fontSize: 22,
									}}
								>
									{firstName} {lastName}
								</Text>

								<TouchableOpacity onPress={() => setEdit(true)}>
									<Ionicons
										name="create-outline"
										size={24}
										color={Colors.dark}
									/>
								</TouchableOpacity>
							</View>
						)}
					</View>
					<Text>{email}</Text>
					<Text>Since {user?.createdAt?.toLocaleDateString()}</Text>
				</View>
			)}

			{isSignedIn && (
				<Button
					title="Log out"
					onPress={() => signOut()}
					color={Colors.dark}
				/>
			)}

			{!isSignedIn && (
				<Link href={"/(modals)/login"} asChild>
					<Button title="Log In" color={Colors.dark} />
				</Link>
			)}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	headerContainer: {
		flexDirection: "row",
		padding: 24,
		justifyContent: "space-between",
	},
	header: {
		fontFamily: "mon-sb",
		fontSize: 24,
	},
	card: {
		backgroundColor: "#fff",
		padding: 24,
		borderRadius: 16,
		marginHorizontal: 24,
		marginTop: 24,
		elevation: 2,
		shadowColor: "#000",
		shadowOpacity: 0.2,
		shadowRadius: 6,
		shadowOffset: {
			width: 1,
			height: 2,
		},
		alignItems: "center",
		gap: 14,
		marginBottom: 24,
	},
	avatar: {
		width: 100,
		height: 100,
		borderRadius: 50,
		backgroundColor: Colors.grey,
	},
	avatarEdit: {
		width: 100,
		height: 100,
		borderRadius: 50,
		backgroundColor: Colors.grey,
		opacity: 0.75,
	},
	editRow: {
		height: 50,
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
	},
});

export default Page;
