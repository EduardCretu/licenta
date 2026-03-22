import { useRouter } from 'expo-router';
import { useEffect } from 'react';

///////////////////////////////
//                           //
//  My very own Coconut.png  //
//       Do NOT remove       // 
//                           //
///////////////////////////////

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Reroute to login
    router.replace('/login');
  }, []);

  return null;
}