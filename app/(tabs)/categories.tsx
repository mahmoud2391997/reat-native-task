import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

type Category = string | { slug: string; name: string; url: string };

export default function CategoriesScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const { data, error, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch('https://dummyjson.com/products/categories');
      if (!res.ok) throw new Error(`Failed to load categories (${res.status})`);
      const data = await res.json();
      return (Array.isArray(data) ? data : []) as Category[];
    },
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  if (isLoading) {
    return (
      <View style={styles.center}> 
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>{(error as Error).message}</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={{ padding: 16 }}
      data={data || []}
      keyExtractor={(item) => (typeof item === 'string' ? item : item.slug)}
      refreshControl={<RefreshControl refreshing={refreshing || isFetching} onRefresh={onRefresh} />} 
      renderItem={({ item }) => {
        const slug = typeof item === 'string' ? item : item.slug;
        const name = typeof item === 'string' ? item : item.name;
        return (
          <Link
            href={{ pathname: '/category/[name]', params: { name: slug } }}
            asChild
          >
            <TouchableOpacity style={styles.item}>
              <Text style={styles.name}>{name}</Text>
            </TouchableOpacity>
          </Link>
        );
      }}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  item: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  name: { fontSize: 16, fontWeight: '600' },
});
