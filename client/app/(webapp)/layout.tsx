import LeftSidebar from "@/components/layout/LeftSidebar";
import { getCurrentUser } from "@/lib/auth";

export default async function WebAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  const user = currentUser
    ? { name: currentUser.username, isGuest: false }
    : { name: "Guest", isGuest: true };

  return (
    <div className="flex">
      <LeftSidebar user={user} />
      <main className="flex-1 w-full">{children}</main>
    </div>
  );
}

