import Instructor from "@/components/pagesComponent/instructor/Instructor";
import React, { Suspense } from "react";
import { generateMetaInfo, getSchemaMarkup } from "@/utils/generateMetaInfo";
import { Metadata } from "next";
import JsonLd from "@/components/Schema/JsonLd";

interface InstructorsPageProps {
  searchParams?: Promise<{ lang?: string }>;
}

// Generate metadata for the instructor page
export async function generateMetadata({ searchParams }: InstructorsPageProps): Promise<Metadata> {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const languageFromQuery = resolvedSearchParams?.lang?.toLowerCase();
  return generateMetaInfo({ page: "instructor", language_code: languageFromQuery || "en" });
}

// Loading component for Suspense fallback
const InstructorLoading = () => {
  return (
    <div className="commonGap">
      <div className="container">
        <div className="animate-pulse">
          {/* Breadcrumb skeleton */}
          <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>

          {/* Grid skeleton */}
          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar skeleton */}
            <div className="col-span-12 lg:col-span-4 xl:col-span-3">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>

            {/* Content skeleton */}
            <div className="col-span-12 lg:col-span-8 xl:col-span-9">
              <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-gray-200 rounded-lg h-64"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const Page = async ({ searchParams }: InstructorsPageProps) => {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const languageFromQuery = resolvedSearchParams?.lang?.toLowerCase();
  // Fetch schema markup for SEO
  const schemaMarkup = await getSchemaMarkup({ page: "instructor", language_code: languageFromQuery || "en" });
  return (
    <div>
      <Suspense fallback={<InstructorLoading />}>
        <Instructor />
      </Suspense>
      {schemaMarkup && <JsonLd data={schemaMarkup} />}
    </div>
  )
}

export default Page
