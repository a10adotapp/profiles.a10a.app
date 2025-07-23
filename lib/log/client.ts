export async function clientInfo({
  action,
  data,
}: {
  action: string;
  data: Record<string, unknown>;
}) {
  console.info({
    action,
    data,
  });

  fetch("/api/log/info", {
    method: "POST",
    body: JSON.stringify({
      action,
      data,
    }),
  });
}
