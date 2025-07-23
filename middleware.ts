import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  request.headers.set("x-pathname", request.nextUrl.pathname);

  return NextResponse.next({
    request,
  });
}
