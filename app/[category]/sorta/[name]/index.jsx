import { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import { Stack, Link, useLocalSearchParams  } from 'expo-router';
import { serverLink } from '@/config';

const NamePage = () => {
    const [item, setItem] = useState(null);
    const [description, setDescription] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const { category, name } = useLocalSearchParams();
    
    useEffect(() => {
        async function fetchData() {
            const params = new URLSearchParams({
                table: 'vegetables',
                page_path: `/${category}/sorta/${name}/`,
            });

            try {
                const response = await fetch(`${serverLink}/api?${params.toString()}`);
                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }
                const data = await response.json();
                setItem(data[0]);

                const descResponse = await fetch(`${serverLink}/text${encodeURIComponent(data[0].desc_path)}`);
                if (!descResponse.ok) {
                    throw new Error(`HTTP error! Status: ${descResponse.status}`);
                }
                const descData = await descResponse.json();
                setDescription(descData);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    return (
        <View style={styles.container}>
            { item ? 
            <>
                <Stack.Screen options={{ title: item.name }} />
                <Image 
                    source={{ uri: `${serverLink}/images${encodeURIComponent(item.image_path)}` }} 
                    style={styles.image} 
                />
                <View style={styles.list}>
                    {description.map(([label, value], index) => (
                        <View key={index}>
                            <Text style={styles.listText}>
                                <Text style={styles.listHeader}>{'\u2022'} </Text>
                                <Text style={styles.listHeader}>{label}: </Text>
                                {value}
                            </Text>
                        </View>
                    ))}
                </View>
            </>
            : <Stack.Screen options={{ title: 'Загрузка...' }} />
            }
        </View>
    )
}
  
export default NamePage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    image: {
        width: 100,
        height: 100,
    },
    list: {
        fontSize: 16,
        marginTop: 10,
        overflow: 'auto',
        maxHeight: '-webkit-fill-available',
    },
    listHeader: {
        fontWeight: 'bold',
    },
    listText: {
        padding: 6,
    },
});