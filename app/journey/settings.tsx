import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Linking, Alert, Modal, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../../data/constants';
import { useLanguage } from '../../context/LanguageContext';
import { resetTraditionProgress } from '../../data/progress';
import { resetEverything } from '../../lib/lastTradition';

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
  const { language, setLanguage, t, noteNames, setNoteNames } = useLanguage();
  const [showWestern, setShowWestern] = useState(true);
  const [showCents, setShowCents] = useState(true);
  const [resetSheetOpen, setResetSheetOpen] = useState(false);

  const RESET_TARGETS = [
    { id: 'turkish-makam', name: 'Turkish Makam', accent: '#C8975A' },
    { id: 'modal-jazz', name: 'Modal Jazz', accent: '#7B8FFF' },
  ];

  const confirmResetTradition = (id: string, name: string) => {
    setResetSheetOpen(false);
    Alert.alert(
      `Reset ${name} progress?`,
      `This clears your explored ${name === 'Turkish Makam' ? 'makams' : 'modes'} and completed lessons in ${name}. Your other tradition is untouched. This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => resetTraditionProgress(id) },
      ],
    );
  };

  const confirmResetBoth = () => {
    setResetSheetOpen(false);
    Alert.alert(
      'Reset all progress?',
      'This clears explored makams/modes and completed lessons across both traditions. You stay in the app and keep your settings. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset both',
          style: 'destructive',
          onPress: async () => {
            await resetTraditionProgress('turkish-makam');
            await resetTraditionProgress('modal-jazz');
          },
        },
      ],
    );
  };

  const confirmResetEverything = () => {
    Alert.alert(
      'Reset everything?',
      'This permanently clears all progress AND returns the app to its first-launch state — including your tradition choice and the welcome screens. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset everything',
          style: 'destructive',
          onPress: async () => { await resetEverything(); router.replace('/' as any); },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t('settings')}</Text>

        <SectionHeader title={t('learning')} />
        <View style={styles.group}>
          <ToggleRow
            icon="musical-note-outline"
            label={t('showWesternAnalogies')}
            sublabel={t('showWesternSublabel')}
            value={showWestern}
            onToggle={setShowWestern}
          />
          <Divider />
          <ToggleRow
            icon="pulse-outline"
            label={t('showCentDeviations')}
            sublabel={t('showCentSublabel')}
            value={showCents}
            onToggle={setShowCents}
          />
          <Divider />
          <View style={[styles.row, { flexDirection: 'column', alignItems: 'flex-start', gap: 12 }]}>
            <View style={styles.rowLeft}>
              <Ionicons name="musical-notes-outline" size={18} color={COLORS.accent} style={styles.rowIcon} />
              <View>
                <Text style={styles.rowLabel}>Note Names</Text>
                <Text style={styles.rowSublabel}>Scale degree display format</Text>
              </View>
            </View>
            <View style={[styles.languageSelector, { marginLeft: 34 }]}>
              <TouchableOpacity
                style={[styles.langOption, noteNames === 'solfege' && styles.langOptionActive]}
                onPress={() => setNoteNames('solfege')}
              >
                <Text style={[styles.langText, noteNames === 'solfege' && styles.langTextActive]}>Solfège</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.langOption, noteNames === 'letter' && styles.langOptionActive]}
                onPress={() => setNoteNames('letter')}
              >
                <Text style={[styles.langText, noteNames === 'letter' && styles.langTextActive]}>Letter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <SectionHeader title="SUPPORT" />
        <View style={styles.group}>
          <SettingsRow
            icon="heart-outline"
            label="Support Development"
            value="ko-fi.com"
            onPress={() => Linking.openURL('https://ko-fi.com/mehmetaydin')}
          />
        </View>

        <SectionHeader title={t('app')} />
        <View style={styles.group}>
          <SettingsRow
            icon="star-outline"
            label={t('rateApp')}
            onPress={() => Linking.openURL('https://apps.apple.com/app/id6772785333?action=write-review')}
          />
          <Divider />
          <SettingsRow
            icon="chatbubble-outline"
            label={t('sendFeedback')}
            onPress={() => Linking.openURL('mailto:hello@themodality.app?subject=The Modality Feedback')}
          />
        </View>

        <SectionHeader title="CREDITS & ACKNOWLEDGMENTS" />
        <View style={styles.group}>
          <View style={styles.creditBlock}>
            <Text style={styles.creditHeading}>Audio Samples</Text>
            <Text style={styles.creditBody}>
              Usul (rhythmic cycle) recordings by Barış Bozkurt, recorded for the CompMusic research project at Universitat Pompeu Fabra. Used with explicit permission and attribution under Creative Commons.
            </Text>
          </View>
          <Divider />
          <SettingsRow
            icon="musical-notes-outline"
            label="Barış Bozkurt on Freesound"
            onPress={() => Linking.openURL('https://freesound.org/people/barisbozkurt/')}
          />
          <Divider />
          <View style={styles.creditBlock}>
            <Text style={styles.creditBody}>
              Ney phrase reference recording by yurci, used under Creative Commons Attribution license.
            </Text>
          </View>
          <Divider />
          <SettingsRow
            icon="musical-note-outline"
            label="yurci on Freesound"
            onPress={() => Linking.openURL('https://freesound.org/people/yurci/')}
          />
          <Divider />
          <View style={styles.creditBlock}>
            <Text style={styles.creditHeading}>Reference Performances</Text>
            <Text style={styles.creditBody}>
              Curated YouTube embeds of master performances are linked from lesson and detail screens. All rights remain with the original performers and uploaders.
            </Text>
          </View>
          <Divider />
          <View style={styles.creditBlock}>
            <Text style={styles.creditBody}>
              The Modality is grateful to the CompMusic project and the musicians who have made authentic Turkish music research accessible to the world.
            </Text>
          </View>
        </View>

        <SectionHeader title="YOUR DATA" />
        <View style={styles.group}>
          <SettingsRow
            icon="refresh-outline"
            label="Reset progress"
            onPress={() => setResetSheetOpen(true)}
          />
          <Divider />
          <TouchableOpacity style={styles.row} onPress={confirmResetEverything} activeOpacity={0.7}>
            <View style={styles.rowLeft}>
              <Ionicons name="trash-outline" size={18} color={COLORS.error} style={styles.rowIcon} />
              <View>
                <Text style={[styles.rowLabel, { color: COLORS.error }]}>Reset everything</Text>
                <Text style={styles.rowSublabel}>Erase all data and restart the app</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.versionRow}>
          <Text style={styles.versionText}>The Modality · v2.0.0</Text>
          <Text style={styles.versionSubtext}>Built with love for the world's modal traditions</Text>
          <Text style={styles.versionSubtext}>hello@themodality.app</Text>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      <Modal visible={resetSheetOpen} transparent animationType="fade" onRequestClose={() => setResetSheetOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setResetSheetOpen(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetLabel}>Reset progress for</Text>
            {RESET_TARGETS.map((t) => (
              <TouchableOpacity key={t.id} style={styles.sheetRow} activeOpacity={0.7} onPress={() => confirmResetTradition(t.id, t.name)}>
                <View style={[styles.sheetDiamond, { backgroundColor: t.accent }]} />
                <Text style={styles.sheetRowText}>{t.name}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.sheetRow} activeOpacity={0.7} onPress={confirmResetBoth}>
              <Ionicons name="albums-outline" size={16} color={COLORS.textSecondary} style={{ width: 16 }} />
              <Text style={styles.sheetRowText}>Both traditions</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sheetCancel} activeOpacity={0.7} onPress={() => setResetSheetOpen(false)}>
              <Text style={styles.sheetCancelText}>Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
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
  creditBlock: { paddingHorizontal: SPACING.md, paddingVertical: 14 },
  creditHeading: { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 6, letterSpacing: 0.3 },
  creditBody: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19 },
  languageSelector: {
    flexDirection: 'row',
    gap: 6,
  },
  langOption: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: 'transparent',
  },
  langOptionActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  langText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  langTextActive: {
    color: COLORS.background,
    fontWeight: '600',
  },
  divider: { height: 1, backgroundColor: COLORS.border, marginLeft: SPACING.md + 24 + SPACING.md },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: COLORS.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: SPACING.lg, paddingTop: SPACING.sm, paddingBottom: SPACING.xxl, borderTopWidth: 1, borderColor: COLORS.border },
  sheetHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: COLORS.border, alignSelf: 'center', marginBottom: SPACING.lg },
  sheetLabel: { fontSize: 11, color: COLORS.textTertiary, letterSpacing: 2, textTransform: 'uppercase', marginBottom: SPACING.md },
  sheetRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingVertical: SPACING.md, paddingHorizontal: SPACING.sm },
  sheetDiamond: { width: 12, height: 12, borderRadius: 3, transform: [{ rotate: '45deg' }] },
  sheetRowText: { fontSize: 16, color: COLORS.textPrimary },
  sheetCancel: { alignItems: 'center', paddingVertical: SPACING.md, marginTop: SPACING.sm, borderTopWidth: 1, borderColor: COLORS.border },
  sheetCancelText: { fontSize: 15, color: COLORS.textSecondary },
  versionRow: { alignItems: 'center', marginTop: SPACING.xxl, gap: 4 },
  versionText: { fontSize: 13, color: COLORS.textTertiary },
  versionSubtext: { fontSize: 12, color: COLORS.textTertiary, fontStyle: 'italic' },
});
