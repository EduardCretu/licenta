import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to auth login by default
    router.replace('/login');
  }, []);

  return null;
}