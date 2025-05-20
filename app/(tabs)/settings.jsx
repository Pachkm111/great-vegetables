import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Modal, FlatList, TouchableOpacity, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useRegion } from '@/hooks/RegionContext';
import { REGION_NAMES } from '@/constants/RegionNames'

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const Settings = () => {
    const {selectedRegion, setSelectedRegion} = useRegion();
    // const [selectedRegion, setSelectedRegion] = useState(REGION_NAMES[0]);
    
    const [modalVisible, setModalVisible] = useState(false);

    const colorScheme = useColorScheme();

    // Сохраняем выбранную область
    const saveRegion = async (region) => {
        await AsyncStorage.setItem('selectedRegion', region);
        setSelectedRegion(region);
        setModalVisible(false);
    };

    return (
        <>
            <View style={styles.container}>
                <Text style={styles.title}>Текущая область: {selectedRegion}</Text>
                <Button title="Сменить область" color={Colors[colorScheme ?? 'light'].tint} onPress={() => setModalVisible(true)} />

                <Modal visible={modalVisible} animationType="slide" transparent={true}>
                    <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Выберите область:</Text>
                        <FlatList
                        data={REGION_NAMES}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                            style={[
                                styles.regionItem,
                                item === selectedRegion && styles.selectedRegion,
                            ]}
                            onPress={() => saveRegion(item)}
                            >
                            <Text style={styles.regionText}>{item}</Text>
                            </TouchableOpacity>
                        )}
                        />
                        <Button title="Закрыть" color={Colors[colorScheme ?? 'light'].tint} onPress={() => setModalVisible(false)} />
                    </View>
                    </View>
                </Modal>
            </View>
            <View style={styles.container}>
                <Text style={styles.title}>Информация взята с сайта <TouchableOpacity onPress={() => Linking.openURL('https://stroy-podskazka.ru/knowledge/')}>
                    <Text style={styles.link}>stroy-podskazka.ru</Text>
                </TouchableOpacity></Text>
            </View>
        </>
    );
};

export default Settings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 10,
        textAlign: 'center',
    },
    regionItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    selectedRegion: {
        backgroundColor: '#dceffb',
    },
    regionText: {
        fontSize: 16,
    },
    link: {
        textDecorationLine: 'underline',
    }
});