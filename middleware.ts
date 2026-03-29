import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === "admin";
    const isAdminPage = req.nextUrl.pathname.startsWith("/admin");

    // ถ้าพยายามเข้าหน้า admin แต่ไม่ใช่ admin ให้เด้งไปหน้าแรก
    if (isAdminPage && !isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      // ให้ middleware ทำงานก็ต่อเมื่อมีการ login แล้วเท่านั้น
      authorized: ({ token }) => !!token,
    },
  }
);

// กำหนดว่าให้ middleware ตรวจสอบเฉพาะ path ไหนบ้าง
export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};