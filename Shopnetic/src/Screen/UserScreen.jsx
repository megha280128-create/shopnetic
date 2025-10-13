import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserScreen = () => {
  const [facing, setFacing] = useState('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [editMode, setEditMode] = useState(false);
  const ref = useRef(null);

  // Load stored data when screen loads
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('userProfile');
        if (storedData) {
          const parsed = JSON.parse(storedData);
          setUserName(parsed.userName);
          setEmail(parsed.email);
          setPhone(parsed.phone);
          setProfilePic(parsed.profilePic);
        }
      } catch (err) {
        console.log('Error loading profile data:', err);
      }
    };
    loadData();
  }, []);

  const saveProfile = async () => {
    if (!userName || !email || !phone) {
      Alert.alert('Please fill all fields');
      return;
    }

    try {
      const userData = { userName, email, phone, profilePic };
      await AsyncStorage.setItem('userProfile', JSON.stringify(userData));
      Alert.alert('Profile Saved Successfully!');
      setEditMode(false);
    } catch (err) {
      console.log('Error saving profile data:', err);
    }
  };

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.permissionText}>
          We need your permission to access the camera.
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync();
    setProfilePic(photo?.uri);
    setShowCamera(false);
  };

  const handleShowCamera = () => setShowCamera(true);

  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing={facing} ref={ref}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={toggleCameraFacing}
            >
              <Text style={styles.buttonText}>Flip</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cameraButton} onPress={takePicture}>
              <Text style={styles.buttonText}>Snap</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

  if (!editMode) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>My Profile</Text>

        <TouchableOpacity onPress={handleShowCamera}>
          <Image
            source={
              profilePic
                ? { uri: profilePic }
                : require('../../assets/user.png')
            }
            style={styles.avatar}
          />
        </TouchableOpacity>

        <Text style={styles.name}>{userName || 'Your Name'}</Text>
        <Text style={styles.subText}>Tap Edit to update your info</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{email || 'Not added yet'}</Text>
          <Text style={styles.infoLabel}>Phone</Text>
          <Text style={styles.infoValue}>{phone || 'Not added yet'}</Text>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: '#2ecc71' }]}
          onPress={() => setEditMode(true)}
        >
          <Text style={styles.saveButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Edit Profile</Text>

        <TouchableOpacity onPress={handleShowCamera}>
          <Image
            source={
              profilePic
                ? { uri: profilePic }
                : require('../../assets/user.png')
            }
            style={styles.avatar}
          />
        </TouchableOpacity>

        <Text style={styles.subText}>Tap to change profile picture</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={userName}
            onChangeText={setUserName}
          />

          <Text style={styles.infoLabel}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Text style={styles.infoLabel}>Phone</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        <View style={{ flexDirection: 'row', marginTop: 30 }}>
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: '#3498db', flex: 1, marginRight: 8 }]}
            onPress={saveProfile}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: '#e74c3c', flex: 1 }]}
            onPress={() => setEditMode(false)}
          >
            <Text style={styles.saveButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default UserScreen;

// ----------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#3498db',
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
    color: '#222',
  },
  subText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 30,
  },
  infoContainer: {
    width: '100%',
    backgroundColor: '#f0f4f8',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  infoLabel: {
    fontSize: 14,
    color: '#555',
    marginTop: 10,
  },
  infoValue: {
    fontSize: 16,
    color: '#111',
    fontWeight: '500',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    fontSize: 16,
    paddingVertical: 6,
    color: '#111',
  },
  saveButton: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop:8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  permissionText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#444',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  permissionButton: {
    backgroundColor: '#0a84ff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#00000088',
    padding: 20,
  },
  cameraButton: {
    backgroundColor: '#ffffff22',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#fff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
