import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Switch, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../data/constants';

type RowProps = {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
};

function SettingsRow({ icon, label, value, onPress, showChevron = true }: RowProps) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} disabled={!onPress} activeOpacity={0.7}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon as any} size={18} color={COLORS.accent} style={styles.rowIcon} />
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <View style={styles.rowRight}>
        {value ? <Text style={styles.rowValue}>{value}</Text> : null}
        {showChevron && onPress ? <Ionicons name="chevron-forward" size={16} color={COLORS.textTertiary} /> : null}
      </View>
    </TouchableOpacity>
  );
}

type ToggleRowProps = {
  icon: string;
  label: string;
  sublabel?: string;
  value: boolean;
  onToggle: (v: boolean) => void;
};

function ToggleRow({ icon, label, sublabel, value, onToggle }: ToggleRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon as any} size={18} color={COLORS.accent} style={styles.rowIcon} />
        <View>
          <Text style={styles.rowLabel}>{label}</Text>
          {sublabel ? <Text style={styles.rowSublabel}>{sublabel}</Text> : null}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: COLORS.border, true: COLORS.accent }}
        thumbColor={COLORS.background}
      />
    </View>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

function Divider() {
  return <View style={styles.divider} />;
}

export default function SettingsScreen() {
  const router = useRouter();
  const [autoplay, setAutoplay] = useState(false);
  const [showWestern, setShowWestern] = useState(true);
  const [showCents, setShowCents] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Settings</Text>

        <SectionHeader title="LEARNING" />
        <View style={styles.group}>
          <ToggleRow
            icon="musical-note-outline"
            label="Show Western Analogies"
            sublabel="Display Western scale comparisons on makam pages"
            value={showWestern}
            onToggle={setShowWestern}
          />
          <Divider />
          <ToggleRow
            icon="pulse-outline"
            label="Show Cent Deviations"
            sublabel="Display microtonal measurements on scale degrees"
            value={showCents}
            onToggle={setShowCents}
          />
          <Divider />
          <ToggleRow
            icon="play-circle-outline"
            label="Autoplay Taksim"
            sublabel="Start taksim video when opening a makam"
            value={autoplay}
            onToggle={setAutoplay}
          />
        </View>

        <SectionHeader title="ABOUT" />
        <View style={styles.group}>
          <SettingsRow
            icon="globe-outline"
            label="Turkish Music Foundation"
            value="tmdk.msu.edu.tr"
            onPress={() => Linking.openURL('https://tmdk.msu.edu.tr')}
          />
          <Divider />
          <SettingsRow
            icon="logo-github"
            label="Source Code"
            value="github.com"
            onPress={() => Linking.openURL('https://github.com/mehmetaydin3/makam')}
          />
        </View>

        <SectionHeader title="APP" />
        <View style={styles.group}>
          <SettingsRow
            icon="star-outline"
            label="Rate the App"
            onPress={() => { }}
          />
          <Divider />
          <SettingsRow
            icon="chatbubble-outline"
            label="Send Feedback"
            onPress={() => Linking.openURL('mailto:mehmetaydin3@gmail.com?subject=Makam App Feedback')}
          />
        </View>

        <View style={styles.versionRow}>
          <Text style={styles.versionText}>Makam · v0.1.0</Text>
          <Text style={styles.versionSubtext}>Built with love for Turkish classical music</Text>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.sm },
  backButton: { alignSelf: 'flex-start' },
  backText: { color: COLORS.accent, fontSize: 15 },
  scroll: { paddingHorizontal: SPACING.lg },
  title: { fontSize: 40, fontWeight: '200', color: COLORS.textPrimary, letterSpacing: -1, marginBottom: SPACING.xl },
  sectionHeader: { fontSize: 11, color: COLORS.textTertiary, letterSpacing: 2, textTransform: 'uppercase', marginBottom: SPACING.sm, marginTop: SPACING.lg },
  group: { backgroundColor: COLORS.surface, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingVertical: 14 },
  rowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: SPACING.md },
  rowIcon: { width: 24, textAlign: 'center' },
  rowLabel: { fontSize: 15, color: COLORS.textPrimary },
  rowSublabel: { fontSize: 12, color: COLORS.textTertiary, marginTop: 2, maxWidth: 240 },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  rowValue: { fontSize: 13, color: COLORS.textTertiary },
  divider: { height: 1, backgroundColor: COLORS.border, marginLeft: SPACING.md + 24 + SPACING.md },
  versionRow: { alignItems: 'center', marginTop: SPACING.xxl, gap: 4 },
  versionText: { fontSize: 13, color: COLORS.textTertiary },
  versionSubtext: { fontSize: 12, color: COLORS.textTertiary, fontStyle: 'italic' },
});
