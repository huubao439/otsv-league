import { notFound } from "next/navigation";
import { AdminWorkspace } from "@/components/admin/admin-workspace";
import { PageHeading } from "@/components/league/page-heading";
import { teams } from "@/data/mock";
import { isAdminSession } from "@/lib/admin-auth";

export default function AdminPage() {
  // Gate the route itself, not just the navbar link, so typing /admin while
  // logged out renders nothing. See src/lib/admin-auth.ts.
  if (!isAdminSession()) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-5.5 px-4 py-9 pb-18 sm:px-6 lg:px-8 animate-fade-up">
      <PageHeading eyebrow="Admin · league management" title="Overall" accent="tab" />
      <AdminWorkspace teams={teams} />
    </div>
  );
}
