import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, TextInput, Modal, Pressable
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, useRef, useMemo } from 'react';
import { Animated } from 'react-native';
import { MAKAMS } from '../../../data/makams';
import { useLanguage } from '../../../context/LanguageContext';
import { SONGS } from '../../../data/songs';
import { USULS } from '../../../data/usuls';
import { SPACING, ColorScheme } from '../../../data/constants';
import { useTheme } from '../../../context/ThemeContext';
import { LibraryCard, SectionHeader } from '../../../components/library';
import { familyShade, FAMILY_BASE } from '../../../data/familyColors';
import { Chrome } from '../../../components/chrome';

const SEYIR_OPTIONS = ['All', 'Ascending', 'Descending', 'Undulating'];
const FAMILY_OPTIONS = ['All', 'Rast', 'Ussak', 'Hicaz', 'Saba', 'Segah', 'Kurd', 'Buselik', 'Cargah', 'Nihavend'];

// Visual time-of-day filter: a tiny sun/moon arc across the day.
const TIME_OPTIONS: { value: string; icon: any; color: string }[] = [
  { value: 'Dawn',      icon: 'partly-sunny-outline', color: '#E0A85A' },
  { value: 'Morning',   icon: 'sunny-outline',        color: '#E0B85A' },
  { value: 'Afternoon', icon: 'sunny-outline',        color: '#D89A4A' },
  { value: 'Evening',   icon: 'partly-sunny-outline', color: '#C77A55' },
  { value: 'Night',     icon: 'moon-outline',         color: '#7B8FCF' },
];

export default function ExploreScreen() {
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const searchBarAnim = useRef(new Animated.Value(1)).current;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const currentY = event.nativeEvent.contentOffset.y;
        const diff = currentY - lastScrollY.current;
        if (diff > 5 && currentY > 60) {
          // Scrolling down — hide search
          Animated.timing(searchBarAnim, { toValue: 0, duration: 120, useNativeDriver: false }).start();
        } else if (diff < -5) {
          // Scrolling up — show search
          Animated.timing(searchBarAnim, { toValue: 1, duration: 120, useNativeDriver: false }).start();
        }
        lastScrollY.current = currentY;
      },
    }
  );
  const { t, language } = useLanguage();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const COLORS = colors;
  const moodMap: Record<string, string> = language === 'tr' ? {
    'Joyful': 'Neşeli', 'Serene': 'Sakin', 'Balanced': 'Dengeli',
    'Calm': 'Sakin', 'Melancholic': 'Melankolik', 'Longing': 'Özlem',
    'Resigned': 'Kabullenmiş', 'Intense': 'Yoğun', 'Dramatic': 'Dramatik',
    'Heroic': 'Kahraman', 'Spiritual': 'Manevi', 'Mystical': 'Mistik',
    'Devotional': 'Dini', 'Grief': 'Yas', 'Weeping': 'Ağlayan',
    'Exotic': 'Egzotik', 'Rugged': 'Sert', 'Introspective': 'İçe Dönük',
    'Tender': 'Nazik', 'Intimate': 'Samimi', 'Nostalgic': 'Nostaljik',
    'Warm': 'Sıcak', 'Bright': 'Parlak', 'Clear': 'Net',
    'Noble': 'Asil', 'Ancient': 'Kadim', 'Strong': 'Güçlü',
    'Direct': 'Doğrudan', 'Elegant': 'Zarif', 'Wandering': 'Gezgin',
    'Free': 'Özgür', 'Passionate': 'Tutkulu', 'Restless': 'Huzursuz',
    'Searching': 'Arayan', 'Grand': 'Görkemli', 'Majestic': 'Heybetli',
    'Solemn': 'Ciddi', 'Deep': 'Derin', 'Anguish': 'Acı',
    'Formal': 'Resmi', 'Confident': 'Kendinden Emin',
  } : {};
  const [query, setQuery] = useState('');
  const [seyirFilter, setSeyirFilter] = useState('All');
  const [moodFilter, setMoodFilter] = useState<string[]>([]);
  const [timeSigFilter, setTimeSigFilter] = useState<string[]>([]);
  const [timeFilter, setTimeFilter] = useState('All');
  const [sheetOpen, setSheetOpen] = useState(false);

  const activeFilterCount = (seyirFilter !== 'All' ? 1 : 0) + moodFilter.length + timeSigFilter.length + (timeFilter !== 'All' ? 1 : 0);

  const toggleTimeSig = (ts: string) => {
    setTimeSigFilter(prev => prev.includes(ts) ? prev.filter(t => t !== ts) : [...prev, ts]);
  };
  const toggleMood = (mood: string) => {
    setMoodFilter(prev => prev.includes(mood) ? prev.filter(m => m !== mood) : [...prev, mood]);
  };

  const SYNONYMS: Record<string, string[]> = {
    happy: ["joyful", "bright", "clear"],
    sad: ["melancholic", "grief", "weeping", "longing", "resigned"],
    dark: ["solemn", "introspective", "rugged", "grief"],
    love: ["longing", "tender", "intimate", "yearning"],
    angry: ["intense", "dramatic", "heroic"],
    peaceful: ["serene", "calm", "balanced", "elegant"],
    spiritual: ["mystical", "devotional", "transcendent", "elevated"],
    crying: ["grief", "weeping", "melancholic"],
    strong: ["strong", "masculine", "direct", "noble", "heroic"],
    exotic: ["exotic", "dramatic", "intense"],
    mysterious: ["mystical", "devotional", "elevated"],
    prayer: ["devotional", "mystical", "transcendent"],
    dance: ["bright", "joyful", "uncomplicated"],
  };

  const expandQuery = (q: string): string[] => {
    const terms = [q];
    Object.entries(SYNONYMS).forEach(([key, values]) => {
      if (key.includes(q) || q.includes(key)) terms.push(...values);
    });
    return terms;
  };

  const filtered = MAKAMS.filter((m) => {
    const q = query.toLowerCase().trim();
    const terms = expandQuery(q);
    const matchesQuery = q === '' ||
      m.name.toLowerCase().includes(q) ||
      m.mood.some((mood) => terms.some(t => mood.toLowerCase().includes(t))) ||
      m.description.toLowerCase().includes(q) ||
      m.timeOfDay.toLowerCase().includes(q) ||
      m.season.toLowerCase().includes(q) ||
      (m.notablePieces || []).some(p => p.title.toLowerCase().includes(q)) ||
      m.listening.sarki.title.toLowerCase().includes(q) ||
      m.listening.taksim.title.toLowerCase().includes(q) ||
      (m.commonUsuls || []).some(u => u.toLowerCase().includes(q)) ||
      m.family.toLowerCase().includes(q) ||
      SONGS.some(s => s.makamId === m.id && s.title.toLowerCase().includes(q));
    const matchesSeyir = seyirFilter === 'All' || m.seyir.toLowerCase() === seyirFilter.toLowerCase();
    const MOOD_CLUSTERS: Record<string, string[]> = {
      'Joyful': ['joyful', 'bright', 'clear', 'hopeful', 'uncomplicated', 'serene', 'uplifting'],
      'Melancholic': ['melancholic', 'grief', 'weeping', 'resigned', 'profound sadness', 'anguish', 'sorrowful'],
      'Intense': ['intense', 'dramatic', 'passionate', 'restless', 'searching', 'rugged', 'heroic', 'strong', 'earnest'],
      'Spiritual': ['spiritual', 'mystical', 'devotional', 'transcendent', 'elevated', 'spiritual depth', 'sacred'],
      'Exotic': ['exotic', 'ancient', 'grand', 'majestic', 'rich', 'deeply emotional'],
      'Calm': ['calm', 'balanced', 'elegant', 'warm', 'tender', 'serene', 'dignified', 'formal', 'confident'],
      'Longing': ['longing', 'yearning', 'nostalgic', 'intimate', 'wandering', 'free', 'introspective'],
      'Dramatic': ['dramatic', 'dark', 'solemn', 'deep', 'noble', 'masculine', 'direct', 'resolved'],
    };
    const matchesMood = moodFilter.length === 0 || moodFilter.some(f => {
      const cluster = MOOD_CLUSTERS[f] || [f.toLowerCase()];
      return m.mood.some(mm => cluster.some(c => mm.toLowerCase().includes(c)));
    });
    const matchesTime = timeFilter === 'All' || m.timeOfDay.toLowerCase() === timeFilter.toLowerCase();
    const matchesTimeSig = timeSigFilter.length === 0 || timeSigFilter.some(ts => {
      const matchingUsuls = USULS.filter(u => u.timeSignature === ts).map(u => u.name);
      return (m.commonUsuls || []).some(cu => matchingUsuls.some(mu => cu.includes(mu.split(' ')[0])));
    });
    return matchesQuery && matchesSeyir && matchesMood && matchesTimeSig && matchesTime;
  });

  const clearFilters = () => {
    setSeyirFilter('All');
    setMoodFilter([]);
    setTimeSigFilter([]);
    setTimeFilter('All');
  };

  // Family ordering — accessibility first for western audiences
  const FAMILY_ORDER = ['Rast', 'Uşşak', 'Nihavend', 'Hicaz', 'Saba', 'Neva', 'Hüseyni', 'Buselik', 'Kurd', 'Cargah', 'Segah', 'Hicazkar'];
  const FAMILY_DESC: Record<string, string> = {
    'Rast':       t('familyRast'),
    'Uşşak':      t('familyUssak'),
    'Nihavend':   t('familyNihavend'),
    'Hicaz':      t('familyHicaz'),
    'Saba':       t('familySaba'),
    'Neva':       t('familyNeva'),
    'Hüseyni':    t('familyHuseyni'),
    'Buselik':    t('familyBuselik'),
    'Kurd':       t('familyKurd'),
    'Cargah':     t('familyCargah'),
    'Segah':      t('familySegah'),
    'Hicazkar':   t('familyHicazkar'),
  };
  const START_HERE = ['rast', 'ussak', 'hicaz'];

  // Group filtered makams by family when not searching
  const isSearching = query.trim() !== '' || seyirFilter !== 'All' || moodFilter.length > 0 || timeSigFilter.length > 0 || timeFilter !== 'All';
  
  const groupedMakams = () => {
    if (isSearching) return [{ family: null, makams: filtered }];
    const groups: { family: string | null; desc?: string; makams: typeof filtered }[] = [];
    const seen = new Set<string>();
    // Add in family order first
    FAMILY_ORDER.forEach(fam => {
      const ms = filtered.filter(m => m.family === fam || 
        (fam === 'Hicazkar' && ['Hicazkar', 'Kurdilihicazkar', 'Uzzal'].includes(m.family)));
      if (ms.length > 0) {
        groups.push({ family: fam, desc: FAMILY_DESC[fam], makams: ms });
        ms.forEach(m => seen.add(m.id));
      }
    });
    // Add any remaining
    const rest = filtered.filter(m => !seen.has(m.id));
    if (rest.length > 0) groups.push({ family: 'Other', makams: rest });
    return groups;
  };

  return (
    <SafeAreaView style={styles.container}>

      <Chrome traditionName="Turkish Makam" accent={COLORS.accent} />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.heading}>The Makams</Text>
          </View>
        </View>
        <Text style={styles.subheading}>{t('homeSubtitle')}</Text>
      </View>

      {/* SEARCH + FILTER */}
      <Animated.View style={[styles.searchRow, {
        opacity: searchBarAnim,
        maxHeight: searchBarAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 60] }),
        overflow: 'hidden',
      }]}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={16} color={COLORS.textTertiary} style={{ marginRight: 6 }} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('searchPlaceholder')}
            placeholderTextColor={COLORS.textTertiary}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            autoCapitalize="none"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={16} color={COLORS.accent} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[styles.filterButton, activeFilterCount > 0 && styles.filterButtonActive]}
          onPress={() => setSheetOpen(true)}
        >
          <Ionicons
            name="options-outline"
            size={18}
            color={activeFilterCount > 0 ? COLORS.background : COLORS.textSecondary}
          />
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>

      {/* ACTIVE FILTER PILLS */}
      {activeFilterCount > 0 && (
        <View style={styles.activePillRow}>
          {seyirFilter !== 'All' && (
            <TouchableOpacity style={styles.activePill} onPress={() => setSeyirFilter('All')}>
              <Text style={styles.activePillText}>{seyirFilter}</Text>
              <Ionicons name="close" size={11} color={COLORS.accent} style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          )}
          {timeFilter !== 'All' && (
            <TouchableOpacity style={styles.activePill} onPress={() => setTimeFilter('All')}>
              <Text style={styles.activePillText}>{timeFilter}</Text>
              <Ionicons name="close" size={11} color={COLORS.accent} style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          )}

        </View>
      )}

      {/* LIST */}
      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false} onScroll={handleScroll} scrollEventThrottle={16}>
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No makams found</Text>
            <Text style={styles.emptySubtext}>Try a different search or filter</Text>
          </View>
        ) : (
          groupedMakams().map((group, gi) => (
            <View key={gi}>
              {group.family && (
                <SectionHeader family={group.family} desc={group.desc} color={FAMILY_BASE[group.family] || undefined} />
              )}
              {group.makams.map((makam, mi) => (
                <LibraryCard
                  key={makam.id}
                  color={familyShade(group.family, mi, group.makams.length)}
                  name={makam.name}
                  pronunciation={makam.pronunciation}
                  description={makam.description}
                  mood={makam.mood}
                  moodMap={moodMap}
                  timeOfDay={makam.timeOfDay}
                  onPress={() => router.push(('/turkish-makam/makam/' + makam.id) as any)}
                />
              ))}
            </View>
          ))
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FILTER SHEET */}
      <Modal
        visible={sheetOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setSheetOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setSheetOpen(false)} />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />

          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Filter</Text>
            {activeFilterCount > 0 && (
              <TouchableOpacity onPress={clearFilters}>
                <Text style={styles.clearText}>Clear all</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* MOOD */}
          <Text style={styles.filterLabel}>MOOD</Text>
          <View style={styles.chipRow}>
            {[t('joyful'), t('melancholic'), t('intense'), t('spiritual'), t('exotic'), t('calm'), t('longing'), t('dramatic')].map(m => (
              <TouchableOpacity
                key={m}
                style={[styles.chip, moodFilter.includes(m) && styles.chipActive]}
                onPress={() => toggleMood(m)}
              >
                <Text style={[styles.chipText, moodFilter.includes(m) && styles.chipTextActive]}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>



          {/* TIME OF DAY — visual sun/moon arc */}
          <Text style={styles.filterLabel}>TIME OF DAY</Text>
          <View style={styles.timeRow}>
            {TIME_OPTIONS.map(opt => {
              const active = timeFilter === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.timeChip, active && { borderColor: opt.color, backgroundColor: opt.color + '22' }]}
                  onPress={() => setTimeFilter(active ? 'All' : opt.value)}
                >
                  <Ionicons name={opt.icon} size={18} color={active ? opt.color : COLORS.textTertiary} />
                  <Text style={[styles.timeChipText, active && { color: opt.color }]}>{opt.value}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* TIME SIGNATURE */}
          <Text style={styles.filterLabel}>RHYTHM</Text>
          <View style={styles.chipRow}>
            {USULS.map(u => (
              <TouchableOpacity
                key={u.id}
                style={[styles.chip, timeSigFilter.includes(u.timeSignature) && styles.chipActive]}
                onPress={() => toggleTimeSig(u.timeSignature)}
              >
                <Text style={[styles.chipText, timeSigFilter.includes(u.timeSignature) && styles.chipTextActive]}>
                  {u.grouping} ({u.timeSignature})
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.applyButton} onPress={() => setSheetOpen(false)}>
            <Text style={styles.applyButtonText}>Show {filtered.length} makam{filtered.length !== 1 ? 's' : ''}</Text>
          </TouchableOpacity>
                </View>
      </Modal>

    </SafeAreaView>
  );
}

const makeStyles = (COLORS: ColorScheme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg, paddingBottom: SPACING.sm },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  eyebrow: { fontSize: 12, color: COLORS.accent, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 },
  heading: { fontSize: 40, fontWeight: '200', color: COLORS.textPrimary, letterSpacing: -1 },
  subheading: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19, marginTop: 4 },
  settingsButton: { padding: 4, marginTop: 6 },
  searchRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: SPACING.lg, marginTop: SPACING.sm, marginBottom: SPACING.md, gap: SPACING.sm },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: SPACING.md },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.textPrimary, paddingVertical: 12 },
  filterButton: { width: 44, height: 44, borderRadius: 12, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  filterButtonActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  filterBadge: { position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: 8, backgroundColor: COLORS.error, alignItems: 'center', justifyContent: 'center' },
  filterBadgeText: { fontSize: 9, color: '#fff', fontWeight: '700' },
  activePillRow: { flexDirection: 'row', paddingHorizontal: SPACING.lg, gap: SPACING.sm, marginBottom: SPACING.sm, flexWrap: 'wrap' },
  activePill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, borderWidth: 1, borderColor: COLORS.accent + '55', backgroundColor: COLORS.accentMuted },
  activePillText: { fontSize: 12, color: COLORS.accent, fontWeight: '500' },
  grid: { paddingHorizontal: SPACING.lg },
  card: { backgroundColor: COLORS.surface, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden', flexDirection: 'row', marginBottom: SPACING.md },
  colorStrip: { width: 4 },
  cardBody: { flex: 1, padding: SPACING.md, gap: SPACING.sm },
  cardTop: { flexDirection: 'row', alignItems: 'baseline', gap: SPACING.sm },
  makamName: { fontSize: 22, fontWeight: '300', color: COLORS.textPrimary, letterSpacing: -0.5 },
  makamPronunciation: { fontSize: 12, color: COLORS.textTertiary, fontStyle: 'italic' },
  makamDesc: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  moodRow: { flexDirection: 'row', gap: 6 },
  moodTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, backgroundColor: COLORS.surfaceRaised, borderWidth: 1, borderColor: COLORS.border },
  moodText: { fontSize: 11, color: COLORS.textSecondary },
  seyirBadge: { fontSize: 12, textTransform: 'capitalize', fontWeight: '500' },
  familyHeader: {
    paddingHorizontal: 4,
    paddingTop: 24,
    paddingBottom: 8,
    marginBottom: 12,
  },
  familyName: {
    fontSize: 11,
    fontWeight: '400',
    color: COLORS.textTertiary,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  familyDesc: {
    fontSize: 12,
    color: COLORS.textTertiary,
    marginTop: 3,
    fontStyle: 'italic',
  },
  startHereBadge: {
    backgroundColor: COLORS.accent + '18',
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  startHereText: {
    fontSize: 9,
    color: COLORS.accent,
    fontWeight: '500',
    letterSpacing: 0.3,
    opacity: 0.8,
  },
  timeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.lg },
  timeChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.background },
  timeChipText: { fontSize: 13, color: COLORS.textSecondary },
  filterLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textTertiary,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
    marginTop: 20,
    marginBottom: 10,
  },
  applyButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.background,
  },
  empty: { alignItems: 'center', paddingTop: 60, gap: SPACING.sm },
  emptyText: { fontSize: 16, color: COLORS.textSecondary },
  emptySubtext: { fontSize: 13, color: COLORS.textTertiary },
  backdrop: { flex: 1, backgroundColor: '#00000088' },
  sheet: { backgroundColor: COLORS.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: SPACING.lg, paddingBottom: 48, borderWidth: 1, borderColor: COLORS.border },
  sheetHandle: { width: 36, height: 4, borderRadius: 999, backgroundColor: COLORS.border, alignSelf: 'center', marginBottom: SPACING.lg },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  sheetTitle: { fontSize: 18, fontWeight: '500', color: COLORS.textPrimary },
  clearText: { fontSize: 14, color: COLORS.accent },
  filterGroupLabel: { fontSize: 11, color: COLORS.textTertiary, letterSpacing: 2, marginBottom: SPACING.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.lg },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.background },
  chipActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  chipText: { fontSize: 13, color: COLORS.textSecondary },
  chipTextActive: { color: COLORS.background, fontWeight: '600' },
  doneButton: { backgroundColor: COLORS.accent, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: SPACING.sm },
  doneButtonText: { fontSize: 16, fontWeight: '600', color: COLORS.background },
});