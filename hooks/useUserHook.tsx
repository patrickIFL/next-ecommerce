import useUserStore from '@/stores/useUserStore';
import { useUser } from '@clerk/nextjs'
import { useEffect } from 'react';

function useUserHook() {
  const { user } = useUser();
  const {isSeller, setIsSeller} = useUserStore();

  useEffect(() => {
    if (user) {
      const isSeller = user.publicMetadata.role === "seller";
      setIsSeller(isSeller);
    }
  }, [user, setIsSeller]);

  return {
    user,
    isSeller
  }
}

export default useUserHook