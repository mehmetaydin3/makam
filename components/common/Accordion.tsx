import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, RADIUS } from '../../data/constants';

/**
 * Accordion — a small, theme-aware, tap-to-expand section used to collapse the
 * prose on the mode/makam detail screens so they open on sound + visual rather
 * than text. Collapsed by default; tapping the header toggles the body.
 *
 * Palette-agnostic: the caller passes the resolved theme palette (either the
 * Makam `colors` or the jazz `jazzColors` shape — both share the base/text
 * tokens this component reads), so a single component serves both traditions.
 */

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export type AccordionColors = {
  surface: string;
  surfaceRaised: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
};

type Props = {
  title: string;
  /** Accent for the chevron + title tint when open. */
  accent: string;
  colors: AccordionColors;
  /** Start expanded. Defaults to open. */
  defaultOpen?: boolean;
  children: React.ReactNode;
};

export function Accordion({ title, accent, colors, defaultOpen = true, children }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((o) => !o);
  };

  return (
    <View style={styles.wrap}>
      <TouchableOpacity
        style={styles.header}
        onPress={toggle}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
      >
        <Text style={[styles.title, open && { color: accent }]} numberOfLines={1}>
          {title}
        </Text>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={open ? accent : colors.textTertiary}
        />
      </TouchableOpacity>
      {open ? <View style={styles.body}>{children}</View> : null}
    </View>
  );
}

const makeStyles = (c: AccordionColors) =>
  StyleSheet.create({
    wrap: {
      backgroundColor: c.surface,
      borderRadius: RADIUS.md,
      borderWidth: 1,
      borderColor: c.border,
      marginBottom: SPACING.sm,
      overflow: 'hidden',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.md - 2,
      gap: SPACING.sm,
    },
    title: {
      fontSize: 12,
      fontWeight: '600',
      color: c.textSecondary,
      letterSpacing: 1.5,
      textTransform: 'uppercase',
      flex: 1,
    },
    body: {
      paddingHorizontal: SPACING.md,
      paddingBottom: SPACING.md,
      paddingTop: 2,
    },
  });
