import useUserHook from '@/hooks/useUserHook';
import { UserButton } from '@clerk/nextjs';
import { Heart, LayoutDashboard, ShoppingBag, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';

function ClerkUserButton() {
  const router = useRouter();
  const { isSeller } = useUserHook();

  return (
    <UserButton key={isSeller ? "seller" : "user"}>
      {isSeller && (
        <UserButton.MenuItems>
          <UserButton.Action
            label="Seller Dashboard"
            labelIcon={<LayoutDashboard size={16} />}
            onClick={() => router.push("/seller")}
          />
        </UserButton.MenuItems>
      )}

      <UserButton.MenuItems>
        <UserButton.Action
          label="Cart"
          labelIcon={<ShoppingCart size={16}/>}
          onClick={() => router.push("/cart")}
        />
      </UserButton.MenuItems>

      <UserButton.MenuItems>
        <UserButton.Action
          label="My Wishlist"
          labelIcon={<Heart size={16} />}
          onClick={() => router.push("/")}
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
