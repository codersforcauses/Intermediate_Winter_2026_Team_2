import LeftSidebar from "@/Sidebar/LeftSidebar";

export default function WebAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <LeftSidebar />
      <main>{children}</main>
    </div>
  );
}
