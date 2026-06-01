import { Redirect } from 'expo-router';

/**
 * Root redirect — sends users to Turkish Makam until the tradition
 * picker (Phase 3d) is in place. Deep links via /turkish-makam/* still work.
 */
export default function Index() {
  return <Redirect href={"/turkish-makam" as any} />;
}
