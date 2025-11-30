import { useUser } from '@clerk/nextjs'

function useUserHook() {
  const { user } = useUser();
  return {
    user
  }
}

export default useUserHook