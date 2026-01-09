import { cn } from "@/lib/utils";

type ProductPageTitleProps = {
  title: string;
  className?: string;
};

function ProductPageTitle({ title, className }: ProductPageTitleProps) {
  return (
    <div className={cn("flex flex-col pt-12", className)}>
      <p className="text-2xl font-medium">{title}</p>
      <div className="w-16 h-0.5 bg-primary rounded-full" />
    </div>
  );
}

export default ProductPageTitle;
