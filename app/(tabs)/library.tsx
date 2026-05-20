import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MAKAMS } from '../../data/makams';

export default function LibraryScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Turkish Makam</Text>
        <Text style={styles.heading}>Library</Text>
        <Text style={styles.subheading}>{MAKAMS.length} makams</Text>
      </View>
      <FlatList
        data={MAKAMS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => router.push(`/makam/${item.id}`)}
          >
            <View style={[styles.colorDot, { backgroundColor: item.color }]} />
            <View style={styles.cardText}>
              <Text style={styles.makamName}>{item.name}</Text>
              <Text style={styles.makamMeta}>{item.family} Family · {item.seyir}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0E0E0F' },
  header: { paddingHorizontal: 24, paddingTop: 48, paddingBottom: 16 },
  eyebrow: { fontSize: 11, color: '#C8975A', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 },
  heading: { fontSize: 40, fontWeight: '300', color: '#F0EDE8', letterSpacing: -1 },
  subheading: { fontSize: 14, color: '#8A8680', marginTop: 4 },
  list: { paddingHorizontal: 24, paddingBottom: 48 },
  separator: { height: 1, backgroundColor: '#2A2A2E' },
  card: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, gap: 16 },
  colorDot: { width: 10, height: 10, borderRadius: 999 },
  cardText: { flex: 1 },
  makamName: { fontSize: 18, fontWeight: '400', color: '#F0EDE8', marginBottom: 2 },
  makamMeta: { fontSize: 12, color: '#8A8680', textTransform: 'capitalize' },
  chevron: { fontSize: 20, color: '#504E4A' },
});
