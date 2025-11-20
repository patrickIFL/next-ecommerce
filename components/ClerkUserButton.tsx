import { UserButton } from '@clerk/nextjs'
import { ShoppingBag, ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation';

function ClerkUserButton() {
  const router = useRouter();

  return (
    <UserButton>
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
