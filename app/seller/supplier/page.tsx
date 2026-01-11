import SellerPageTitle from "@/components/seller/SellerPageTitle";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

function SupplierPage() {
  return (
    <div className="px-6 py-6 min-h-screen w-full mt-16">
      <div className="flex gap-3">
      <SellerPageTitle title="Suppliers" />
      <Button variant={"outline"}><Plus /> Add</Button>
      </div>

      <div className="min-w-full mx-auto overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-accent bg-accent text-foreground">
              <th className="p-3">Supplier Name</th>
              <th className="p-3 text-center">Type</th>
              <th className="p-3 text-center">External ID</th>
            </tr>
          </thead>
          </table>

    </div>
    </div>
  );
}

export default SupplierPage;
