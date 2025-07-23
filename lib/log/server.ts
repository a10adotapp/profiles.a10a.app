export async function serverError({
  action,
  data,
}: {
  action: string;
  data: Record<string, unknown>;
}) {
  console.error({
    action,
    data,
  });
}
