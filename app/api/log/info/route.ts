export async function POST(request: Request) {
  console.info(await request.json());

  return Response.json({
    message: "ok",
  });
}
