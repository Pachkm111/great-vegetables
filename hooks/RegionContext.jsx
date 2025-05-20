import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { REGION_NAMES } from '@/constants/RegionNames'

const RegionContext = createContext();

export const RegionProvider = ({ children }) => {
    const [selectedRegion, setSelectedRegion] = useState(REGION_NAMES[0]); // Регион по умолчанию

        // Загружаем сохранённую область при загрузке компонента
        useEffect(() => {
            const loadRegion = async () => {
                const savedRegion = await AsyncStorage.getItem('selectedRegion');
                    if (savedRegion) {
                        setSelectedRegion(savedRegion);
                    }
                };
            loadRegion();
        }, []);

    return (
        <RegionContext.Provider value={{ selectedRegion, setSelectedRegion }}>
            {children}
        </RegionContext.Provider>
    );
};

export const useRegion = () => useContext(RegionContext);