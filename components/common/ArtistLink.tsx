import React from 'react';
import { Text, StyleProp, TextStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { getArtistByName } from '../../data/artists';

/**
 * ArtistLink — renders a musician's name. If the name resolves to a real artist
 * in the registry, it becomes a tappable link (accent color + underline) that
 * opens that artist's profile. Generic credits (Traditional / Anonymous / Various)
 * and anyone not yet in the registry render as plain, non-tappable text.
 *
 * Designed to drop in inline — it renders a single <Text>, so it nests cleanly
 * inside a larger <Text> (e.g. a "composer · performer · year" meta line) and
 * inherits the surrounding type styling unless `style` overrides it.
 */
export function ArtistLink({
  name,
  accent,
  style,
}: {
  name: string;
  accent: string;
  style?: StyleProp<TextStyle>;
}) {
  const router = useRouter();
  const artist = getArtistByName(name);

  if (!artist) {
    return <Text style={style}>{name}</Text>;
  }

  return (
    <Text
      style={[style, { color: accent, textDecorationLine: 'underline' }]}
      onPress={() => router.push(('/artist/' + artist.id) as any)}
      suppressHighlighting
    >
      {name}
    </Text>
  );
}
