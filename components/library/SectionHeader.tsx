import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../data/constants';

type Props = {
  family: string;
  desc?: string;
  color?: string;
};

export function SectionHeader({ family, desc, color }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.nameRow}>
        {color && <View style={[styles.dot, { backgroundColor: color }]} />}
        <Text style={[styles.name, color && { color }]}>{family} FAMILY</Text>
      </View>
      {desc && <Text style={styles.desc}>{desc}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 4,
    paddingTop: 24,
    paddingBottom: 8,
    marginBottom: 12,
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  dot: { width: 7, height: 7, borderRadius: 2, transform: [{ rotate: '45deg' }] },
  name: {
    fontSize: 11,
    fontWeight: '400',
    color: COLORS.textTertiary,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  desc: {
    fontSize: 12,
    color: COLORS.textTertiary,
    marginTop: 3,
    fontStyle: 'italic',
  },
});
