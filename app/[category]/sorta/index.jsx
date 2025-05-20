import { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import { Stack, Link, useLocalSearchParams  } from 'expo-router';
import { useRegion } from '@/hooks/RegionContext';
import { serverLink } from '@/config';

const CategoryPage = () => {
    const [group, setGroup] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const { category } = useLocalSearchParams();
    const { selectedRegion } = useRegion();
    
    useEffect(() => {
        let params;

        async function fetchData() {
            params = new URLSearchParams({
                table: 'groups',
                page_path: `/${category}/sorta/`,
            });
            const group = await fetch(`${serverLink}/api?${params.toString()}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                return data[0];
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
            setGroup(group);

            params = new URLSearchParams({
                table: 'vegetable-groups',
                group_id: group.id,
            });
            const groupVegetables = await fetch(`${serverLink}/api?${params.toString()}`)
            .then(response => {
                if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                return data;
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
            
            try {
                const fetches = groupVegetables.map((veg) => {
                    const params = new URLSearchParams({
                        table: 'vegetables',
                        id: veg.id,
                    });

                    return fetch(`${serverLink}/api?${params.toString()}`)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`Ошибка HTTP: ${response.status}`);
                        }
                        return response.json().then(data => data[0]);
                    });
                });

                const results = await Promise.all(fetches);
                setItems(results);
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
            <Stack.Screen options={{ title: loading ? 'Загрузка...' : group.name }} />
            <Text style={styles.title}>Текущая область: {selectedRegion}</Text>
            
            <FlatList
                data={items}
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
  
export default CategoryPage;
  
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