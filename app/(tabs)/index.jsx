import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { useState, useEffect } from 'react';
import { useRegion } from '@/hooks/RegionContext';
import { serverLink } from '@/config';

const App = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const { selectedRegion } = useRegion();

    useEffect(() => {
        const params = new URLSearchParams({
            table: 'groups',
        });

        fetch(`${serverLink}/api?${params.toString()}`)
        .then(response => {
            if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            setGroups(data);
            setLoading(false);
        })
        .catch(err => {
            setError(err.message);
            setLoading(false);
        });
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Текущая область: {selectedRegion}</Text>
            <FlatList
                data={groups}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                <Link 
                    href={item.page_path}
                    style={styles.item}
                >
                    <Image 
                        source={{ uri: `${serverLink}/images${encodeURIComponent(item.image_path)}` }} 
                        style={styles.image} 
                    />
                    <Text style={styles.name}>{item.name}</Text>
                </Link>
                )}
            />
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