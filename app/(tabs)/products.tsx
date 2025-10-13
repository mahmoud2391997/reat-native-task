import React, { useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
}

export default function ProductsScreen() {
  const isSuperAdmin = useSelector((s: RootState) => s.auth.isSuperAdmin);
  const qc = useQueryClient();

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['products', { limit: 20 }],
    queryFn: async () => {
      const res = await fetch('https://dummyjson.com/products?limit=20');
      if (!res.ok) throw new Error(`Failed to load products (${res.status})`);
      const body = await res.json();
      return (body.products || []) as Product[];
    },
  });

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`https://dummyjson.com/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      return id;
    },
    onMutate: async (id: number) => {
      await qc.cancelQueries({ queryKey: ['products'] });
      const prev = qc.getQueryData<Product[]>(['products', { limit: 20 }]);
      if (prev) {
        qc.setQueryData<Product[]>(['products', { limit: 20 }], prev.filter(p => p.id !== id));
      }
      return { prev } as { prev?: Product[] };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(['products', { limit: 20 }], ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
    },
  });

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

  const products = data || [];

  return (
    <FlatList
      contentContainerStyle={{ padding: 16 }}
      data={products}
      keyExtractor={(item) => String(item.id)}
      refreshControl={<RefreshControl refreshing={isFetching} onRefresh={onRefresh} />}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image source={{ uri: item.thumbnail }} style={styles.thumb} />
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.price}>${item.price}</Text>
          </View>
          {isSuperAdmin ? (
            <TouchableOpacity onPress={() => deleteMutation.mutate(item.id)} style={styles.deleteBtn}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>Delete</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      )}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
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
  deleteBtn: { backgroundColor: '#d00', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
});
