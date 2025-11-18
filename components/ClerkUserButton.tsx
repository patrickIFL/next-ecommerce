import { useAppContext } from '@/context/AppContext'
import { UserButton } from '@clerk/nextjs'
import { ShoppingBag, ShoppingCart } from 'lucide-react'
import { shadcn } from "@clerk/themes";
import { useTheme } from "@/components/theme-provider";

function ClerkUserButton() {
  const { router } = useAppContext();
  const { isDark } = useTheme();

  return (
    <UserButton
      appearance={{
    baseTheme: shadcn, // use any base theme
  }}
    >
      <UserButton.MenuItems>
        <UserButton.Action
          label="Cart"
          labelIcon={<ShoppingCart size={16} />}
          onClick={() => router.push("/cart")}
        />
      </UserButton.MenuItems>

      <UserButton.MenuItems>
        <UserButton.Action
          label="My Orders"
          labelIcon={<ShoppingBag size={16} />}
          onClick={() => router.push("/my-orders")}
        />
      </UserButton.MenuItems>
    </UserButton>
  );
}

export default ClerkUserButton;
