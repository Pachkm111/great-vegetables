import { View, Text, Image, FlatList, StyleSheet, Button } from 'react-native';
import { Link } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import { useRegion } from '@/hooks/RegionContext';
import { serverLink } from '@/config';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const App = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { selectedRegion } = useRegion();
    const colorScheme = useColorScheme();

     const fetchData = useCallback(() => {
        setLoading(true);
        setError(null);
        
        console.log('✔ (tabs) index.jsx - useEffect()');
        const params = new URLSearchParams({
            table: 'groups',
        });

        fetch(`${serverLink}/api?${params.toString()}`, {
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            console.log('✔ (tabs) index.jsx - fetch()');
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('✔ (tabs) index.jsx - response.json()');
            setGroups(data);
            setLoading(false);
            console.log('✔ (tabs) index.jsx - setGroups()');
        })
        .catch(err => {
            console.log('(tabs) index.jsx - Ошибка: ' + err.message);
            setError(err.message);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Текущая область: {selectedRegion}</Text>

            {loading && <Text>Загрузка...</Text>}

            {error && (
                <View style={{ marginTop: 16 }}>
                    <Text style={{ color: 'red' }}>{error}</Text>
                    <Button color={Colors[colorScheme ?? 'light'].tint} title="Повторить" onPress={fetchData} />
                </View>
            )}

            {!loading && !error && (
                <FlatList
                    data={groups}
                    keyExtractor={(item) => item.name}
                    renderItem={({ item }) => (
                    <Link href={item.page_path} style={styles.item}>
                        <Image 
                            source={{ uri: `${serverLink}/images${encodeURIComponent(item.image_path)}` }} 
                            style={styles.image} 
                        />
                        <Text style={styles.name}>{item.name}</Text>
                    </Link>
                    )}
                />
            )}
        </View>
    )
}

export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
    item: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        marginBottom: 15,
    },
    image: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 18,
        marginBottom: 20,
    },
});