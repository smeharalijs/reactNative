import { Camera, CameraType } from 'expo-camera';
import { useState, useEffect, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';

export default function UserCamera() {
    const cameraRef = useRef();

    const [hasCameraPermission, setHasCameraPermission] = useState();
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
    const [photo, setPhoto] = useState();
    const [type, setType] = useState(CameraType.back);

    useEffect(() => {
        userPermissions();
    }, []);

    const userPermissions = async () => {
        const cameraPermission = await Camera.requestCameraPermissionsAsync();
        const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
        setHasCameraPermission(cameraPermission.status === "granted");
        setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    }

    if (hasCameraPermission === undefined) {
        return <Text>Requesting Permissions...</Text>;
    } else if (!hasCameraPermission) {
        return <Text>Permission for camera not granted. Please change this in settings.</Text>;
    }

    function toggleCameraFacing() {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    }

    const takePicture = async () => {
        const options = {
            quality: 1,
            base64: true,
            exif: false
        };
        const newPhoto = await cameraRef.current.takePictureAsync(options);
        setPhoto(newPhoto);
    }

    if (photo) {
        const sharePic = () => {
            shareAsync(photo.uri).then(() => {
                setPhoto(undefined);
            });
        }

        const savePhoto = () => {
            MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
                setPhoto(undefined);
            });
        }

        return (
            <View style={styles.container}>
                <Image style={styles.preview} source={{ uri: "data:image/jpg;base64," + photo.base64 }} />
                <Button title='Share' onPress={sharePic}></Button>
                {hasMediaLibraryPermission ? <Button title='Save To Gallery' onPress={savePhoto}></Button> : undefined}
                <Button title='Discard' onPress={() => setPhoto(undefined)}></Button>
            </View>
        );
    }

    return (
        <Camera style={styles.container} type={type} ref={cameraRef}>
            <View style={styles.icons}>
                <TouchableOpacity>
                    <MaterialCommunityIcons style={styles.icon} name='flash' color="white" size={60} />
                </TouchableOpacity>
                <TouchableOpacity onPress={takePicture}></TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}></TouchableOpacity>
                <MaterialCommunityIcons style={styles.icon} name='record' color="white" size={60} />
                <MaterialCommunityIcons style={styles.icon} name='camera-flip' color="white" size={60} />
            </View>
        </Camera>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    icons: {
        position: 'absolute',
        bottom: 5,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
    },
    icon: {},
    preview: {
        alignSelf: 'stretch',
        flex: 1,
    }
});
