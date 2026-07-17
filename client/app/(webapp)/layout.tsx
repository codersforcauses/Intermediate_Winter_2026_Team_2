import LeftSidebar from "@/components/layout/LeftSidebar";

export default function WebAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <LeftSidebar />
      <main className="flex-1 w-full">{children}</main>
    </div>
  );
}

