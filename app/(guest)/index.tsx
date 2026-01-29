import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function GuestIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/guest/job-offers');
  }, [router]);

  return null;
}
