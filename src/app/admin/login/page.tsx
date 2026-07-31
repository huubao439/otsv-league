import { LoginForm } from "@/components/admin/login-form";
import { PageHeading } from "@/components/league/page-heading";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4 py-9 pb-18 sm:px-6 lg:px-8 animate-fade-up">
      <PageHeading eyebrow="Restricted area" title="Admin" accent="sign in" />
      <LoginForm from={from && from.startsWith("/admin") ? from : "/admin"} />
    </div>
  );
}
