import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../data/constants';

type Props = {
  family: string;
  desc?: string;
};

export function SectionHeader({ family, desc }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{family} FAMILY</Text>
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
