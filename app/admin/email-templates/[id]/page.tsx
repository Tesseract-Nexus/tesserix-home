import { redirect } from "next/navigation";

export default async function EmailTemplateDetailRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/admin/apps/mark8ly/email-templates/${id}`);
}
