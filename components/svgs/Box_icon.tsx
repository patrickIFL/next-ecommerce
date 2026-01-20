import { Package, PackageOpen } from "lucide-react";

const primary = "var(--primary)";

function Box_icon({ isOpen }: { isOpen: boolean }) {
  return (
    <div
      className={`${
        isOpen ? "bg-primary/20" : "bg-primary/10"
      } transition cursor-pointer group min-w-[73px] min-h-[73px] max-h-[73px] border border-primary/90 rounded-md flex items-center justify-center`}
    >
      {isOpen ? (
        <PackageOpen
          size={40}
          strokeWidth={1}
          color={primary}
        />
      ) : (
        <Package
          size={40}
          strokeWidth={1}
          color={primary}
        />
      )}
    </div>
  );
}

export default Box_icon;
