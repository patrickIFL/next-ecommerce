function ProductPageTitle({ title }: { title: string }) {
  return (
    <div className="flex flex-col pt-12">
      <p className="text-2xl font-medium">{title}</p>
      <div className="w-16 h-0.5 bg-primary rounded-full" />
    </div>
  );
}

export default ProductPageTitle;
