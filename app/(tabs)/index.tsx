import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS, SPACING } from '../../data/constants';

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>Turkish Makam</Text>
        <Text style={styles.heading}>Explore</Text>
        <Text style={styles.body}>
          Select a makam and seyir to hear its characteristic movement.
        </Text>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Makam selector coming in Phase 4</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
  },
  eyebrow: {
    fontSize: 11,
    color: COLORS.accent,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
  },
  heading: {
    fontSize: 40,
    fontWeight: '300',
    color: COLORS.textPrimary,
    letterSpacing: -1,
    marginBottom: SPACING.md,
  },
  body: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 24,
    marginBottom: SPACING.xxl,
  },
  placeholder: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: COLORS.textTertiary,
    fontSize: 13,
  },
});
