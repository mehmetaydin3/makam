import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useRef, useState } from 'react';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../data/constants';
import { Makam } from '../data/makams';

function Card({ makam }: { makam: Makam }) {
  return (
    <View style={[styles.card, { backgroundColor: '#0C0C0E' }]}>
      <View style={[styles.colorBar, { backgroundColor: makam.color }]} />
      <View style={styles.cardInner}>
        <Text style={styles.eyebrow}>TURKISH MAKAM</Text>
        <Text style={[styles.makamName, { color: '#FFFFFF' }]}>{makam.name}</Text>
        <Text style={styles.pronunciation}>/{makam.pronunciation}/</Text>
        <View style={[styles.divider, { backgroundColor: makam.color }]} />
        <Text style={styles.description} numberOfLines={3}>{makam.description}</Text>
        <View style={styles.moodRow}>
          {makam.mood.slice(0, 3).map(m => (
            <View key={m} style={[styles.moodTag, { borderColor: makam.color + '44' }]}>
              <Text style={[styles.moodText, { color: makam.color }]}>{m}</Text>
            </View>
          ))}
        </View>
        <View style={styles.footer}>
          <View>
            <Text style={styles.ctaText}>MAKAM</Text>
            <Text style={styles.ctaSubtext}>Turkish classical music</Text>
          </View>
          <View style={[styles.dot, { backgroundColor: makam.color }]} />
        </View>
      </View>
    </View>
  );
}

export default function ShareableCard({ makam, visible, onClose }: { makam: Makam; visible: boolean; onClose: () => void }) {
  const [sharing, setSharing] = useState(false);
  const cardRef = useRef<View>(null);

  const handleShare = async () => {
    try {
      setSharing(true);
      const uri = await captureRef(cardRef, { format: 'png', quality: 1, result: 'tmpfile' });
      await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: `Share ${makam.name}` });
    } catch (e) {
      console.log('Share error:', e);
    } finally {
      setSharing(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Share {makam.name}</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={22} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.cardWrapper}>
          <View ref={cardRef} collapsable={false}>
            <Card makam={makam} />
          </View>
        </View>

        <Text style={styles.hint}>Share this card to introduce someone to {makam.name}</Text>

        <TouchableOpacity
          style={[styles.shareBtn, { backgroundColor: makam.color }]}
          onPress={handleShare}
          disabled={sharing}
        >
          <Ionicons name="share-outline" size={18} color="#000" />
          <Text style={styles.shareBtnText}>{sharing ? 'Sharing...' : 'Share'}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: { backgroundColor: '#0E0E0F', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: SPACING.lg, paddingBottom: 40 },
  handle: { width: 36, height: 4, backgroundColor: '#333', borderRadius: 2, alignSelf: 'center', marginBottom: SPACING.md },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  sheetTitle: { fontSize: 18, fontWeight: '500', color: COLORS.textPrimary },
  cardWrapper: { alignItems: 'center', marginBottom: SPACING.md },
  card: { width: 300, borderRadius: 20, overflow: 'hidden' },
  colorBar: { height: 4, width: '100%' },
  cardInner: { padding: 24, gap: 10 },
  eyebrow: { fontSize: 9, color: '#555', letterSpacing: 2, textTransform: 'uppercase' },
  makamName: { fontSize: 44, fontWeight: '200', letterSpacing: -2, lineHeight: 48 },
  pronunciation: { fontSize: 13, color: '#555', fontStyle: 'italic', marginTop: -6 },
  divider: { width: 28, height: 1.5, borderRadius: 1, marginVertical: 2 },
  description: { fontSize: 13, color: '#777', lineHeight: 20 },
  moodRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  moodTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  moodText: { fontSize: 11, fontWeight: '500' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#1A1A1A' },
  ctaText: { fontSize: 13, color: '#666', fontWeight: '300', letterSpacing: 3 },
  ctaSubtext: { fontSize: 10, color: '#444', letterSpacing: 1, marginTop: 2 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  hint: { fontSize: 12, color: COLORS.textTertiary, textAlign: 'center', marginBottom: SPACING.md },
  shareBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 14 },
  shareBtnText: { fontSize: 16, fontWeight: '600', color: '#000' },
});
