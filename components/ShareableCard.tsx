import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useRef, useState } from 'react';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../data/constants';
import { Makam } from '../data/makams';

type CardTemplate = 'mood' | 'western' | 'scale';

function MoodCard({ makam }: { makam: Makam }) {
  return (
    <View style={[styles.card, { backgroundColor: '#0C0C0E' }]}>
      <View style={[styles.colorBar, { backgroundColor: makam.color }]} />
      <View style={styles.cardInner}>
        <Text style={styles.eyebrow}>TURKISH MAKAM</Text>
        <Text style={[styles.makamName, { color: '#FFFFFF' }]}>{makam.name}</Text>
        <Text style={styles.pronunciation}>/{makam.pronunciation}/</Text>
        <View style={[styles.divider, { backgroundColor: makam.color }]} />
        <View style={styles.moodRow}>
          {makam.mood.slice(0, 4).map(m => (
            <Text key={m} style={styles.moodWord}>{m}</Text>
          ))}
        </View>
        <Text style={styles.phrase}>"{makam.characteristicPhrase}"</Text>
        <View style={styles.footerCta}>
          <Text style={styles.ctaText}>Explore this makam</Text>
          <Text style={styles.ctaLink}>makam.app</Text>
        </View>
      </View>
    </View>
  );
}

function WesternCard({ makam }: { makam: Makam }) {
  return (
    <View style={[styles.card, { backgroundColor: '#0C0C0E', borderWidth: 1, borderColor: makam.color + '44' }]}>
      <View style={styles.cardInner}>
        <Text style={styles.eyebrow}>FOR WESTERN EARS</Text>
        <Text style={[styles.makamName, { color: makam.color }]}>{makam.name}</Text>
        <View style={[styles.divider, { backgroundColor: makam.color }]} />
        <Text style={styles.westernText}>"{makam.westernAnalogy}"</Text>
        <View style={styles.footerCta}>
          <Text style={styles.ctaText}>Explore this makam</Text>
          <Text style={styles.ctaLink}>makam.app</Text>
        </View>
      </View>
    </View>
  );
}

function ScaleCard({ makam }: { makam: Makam }) {
  return (
    <View style={[styles.card, { backgroundColor: '#0C0C0E' }]}>
      <View style={styles.cardInner}>
        <Text style={styles.eyebrow}>{makam.family.toUpperCase()} FAMILY · {makam.seyir.toUpperCase()}</Text>
        <Text style={[styles.makamName, { color: makam.color }]}>{makam.name}</Text>
        <View style={[styles.divider, { backgroundColor: makam.color }]} />
        <View style={styles.scaleRow}>
          {makam.scale.map((d, i) => (
            <View key={i} style={[
              styles.scaleDeg,
              { borderColor: d.isCharacteristic ? makam.color : '#2A2A2A' },
              d.isCharacteristic && { backgroundColor: makam.color + '18' }
            ]}>
              <Text style={[styles.scaleDegText, { color: d.isCharacteristic ? makam.color : '#888' }]}>
                {d.name.replace(' Koma', '')}
              </Text>
              <Text style={styles.scaleDegWestern}>{d.westernNearest}</Text>
            </View>
          ))}
        </View>
        <View style={styles.footerCta}>
          <Text style={styles.ctaText}>Explore this makam</Text>
          <Text style={styles.ctaLink}>makam.app</Text>
        </View>
      </View>
    </View>
  );
}

export default function ShareableCard({ makam, visible, onClose }: { makam: Makam; visible: boolean; onClose: () => void }) {
  const [template, setTemplate] = useState<CardTemplate>('mood');
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

  const templates: { id: CardTemplate; label: string }[] = [
    { id: 'mood', label: 'Mood' },
    { id: 'western', label: 'Western' },
    { id: 'scale', label: 'Scale' },
  ];

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

        <View style={styles.templateRow}>
          {templates.map(t => (
            <TouchableOpacity
              key={t.id}
              style={[styles.templateBtn, template === t.id && { borderColor: makam.color, backgroundColor: makam.color + '18' }]}
              onPress={() => setTemplate(t.id)}
            >
              <Text style={[styles.templateBtnText, template === t.id && { color: makam.color }]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.cardWrapper}>
          <View ref={cardRef} collapsable={false}>
            {template === 'mood' && <MoodCard makam={makam} />}
            {template === 'western' && <WesternCard makam={makam} />}
            {template === 'scale' && <ScaleCard makam={makam} />}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.shareBtn, { backgroundColor: makam.color }]}
          onPress={handleShare}
          disabled={sharing}
        >
          <Ionicons name="share-outline" size={18} color="#000" />
          <Text style={styles.shareBtnText}>{sharing ? 'Sharing...' : 'Share this card'}</Text>
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
  templateRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
  templateBtn: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#2A2A2A' },
  templateBtnText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },
  cardWrapper: { alignItems: 'center', marginBottom: SPACING.lg },
  card: { width: 300, borderRadius: 20, overflow: 'hidden' },
  colorBar: { height: 4, width: '100%' },
  cardInner: { padding: 24, gap: 10 },
  eyebrow: { fontSize: 9, color: '#555', letterSpacing: 2, textTransform: 'uppercase' },
  makamName: { fontSize: 44, fontWeight: '200', letterSpacing: -2, lineHeight: 48 },
  pronunciation: { fontSize: 13, color: '#555', fontStyle: 'italic', marginTop: -6 },
  divider: { width: 28, height: 1.5, borderRadius: 1, marginVertical: 2 },
  moodRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  moodWord: { fontSize: 15, color: '#888', fontWeight: '300' },
  phrase: { fontSize: 12, color: '#555', lineHeight: 18, fontStyle: 'italic' },
  footerCta: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#1A1A1A' },
  ctaText: { fontSize: 11, color: '#555', letterSpacing: 0.5 },
  ctaLink: { fontSize: 12, color: '#888', fontWeight: '600', letterSpacing: 0.5, marginTop: 2 },
  westernText: { fontSize: 14, color: '#999', lineHeight: 22, fontStyle: 'italic' },
  scaleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  scaleDeg: { paddingHorizontal: 8, paddingVertical: 6, borderRadius: 8, borderWidth: 1, alignItems: 'center' },
  scaleDegText: { fontSize: 12, fontWeight: '600' },
  scaleDegWestern: { fontSize: 9, color: '#444', marginTop: 1 },
  shareBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 14 },
  shareBtnText: { fontSize: 16, fontWeight: '600', color: '#000' },
});
