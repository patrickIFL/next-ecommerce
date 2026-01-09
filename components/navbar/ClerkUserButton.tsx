import useUserHook from '@/hooks/useUserHook';
import { UserButton } from '@clerk/nextjs';
import { Heart, LayoutDashboard, ShoppingBag, } from 'lucide-react';
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

      {/* <UserButton.MenuItems>
        <UserButton.Action
          label="Checkout"
          labelIcon={<Package2 size={16}/>}
          onClick={() => router.push("/checkout")}
        />
      </UserButton.MenuItems> */}

      <UserButton.MenuItems>
        <UserButton.Action
          label="My Wishlist"
          labelIcon={<Heart size={16} />}
          onClick={() => router.push("/wishlist/products")}
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
