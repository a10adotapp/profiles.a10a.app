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

export async function clientError({
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

  fetch("/api/log/error", {
    method: "POST",
    body: JSON.stringify({
      action,
      data,
    }),
  });
}
