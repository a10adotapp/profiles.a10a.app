export async function POST(request: Request) {
  console.error(await request.json());

  return Response.json({
    message: "ok",
  });
}
