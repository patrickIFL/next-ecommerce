import { Metadata } from "next";

type Props = {
  params: Promise<{ cat: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cat } = await params;

  return {
    title: `Search ${cat} - NextCart`,
    description: "Find products quickly and easily here at NextCart.",
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
