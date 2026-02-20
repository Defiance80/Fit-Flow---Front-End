"use client";
import Link from "next/link";
import React from "react";
export default function NotFound() {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-2xl">Page Not Found</p>
        <Link
          href="/my-teams/course"
          className="bg-[var(--primary-color)] text-white px-4 py-2 rounded-md"
        >
          Go to Home
        </Link>
      </div>
    </>
  );
}
