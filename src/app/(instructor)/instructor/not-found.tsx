"use client";
import Layout from "@/components/instructor/Layout/Layout";
import Link from "next/link";
import React from "react";
export default function NotFound() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-2xl">Page Not Found</p>
        <Link
          href="/instructor/dashboard"
          className="bg-[var(--primary-color)] text-white px-4 py-2 rounded-md"
        >
          Go to Home
        </Link>
      </div>
    </Layout>
  );
}
