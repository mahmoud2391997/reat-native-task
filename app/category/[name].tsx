import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image, RefreshControl } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
}

export default function CategoryScreen() {
  const params = useLocalSearchParams<{ name: string }>();
  const category = decodeURIComponent((params.name || '').toString());
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`https://dummyjson.com/products/category/${encodeURIComponent(category)}?limit=20`);
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Failed to load products (${res.status}): ${body}`);
      }
      const data = await res.json();
      setProducts(data.products || []);
    } catch (e: any) {
      setError(e?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (category) load();
  }, [category]);

  useEffect(() => {
    navigation.setOptions?.({ title: category || 'Category' });
  }, [navigation, category]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [category]);

  if (!category) {
    return (
      <View style={styles.center}><Text style={{ color: 'red' }}>Invalid category.</Text></View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}><ActivityIndicator size="large" /></View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}><Text style={{ color: 'red' }}>{error}</Text></View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={{ padding: 16 }}
      data={products}
      keyExtractor={(item) => String(item.id)}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image source={{ uri: item.thumbnail }} style={styles.thumb} />
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.price}>${item.price}</Text>
          </View>
        </View>
      )}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      ListHeaderComponent={
        <View style={{ paddingBottom: 8 }}>
          <Text style={styles.header}>{category}</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    gap: 12,
    alignItems: 'center',
  },
  thumb: { width: 64, height: 64, borderRadius: 8, backgroundColor: '#f2f2f2' },
  title: { fontSize: 16, fontWeight: '600' },
  price: { marginTop: 4, color: '#666' },
  header: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
});
