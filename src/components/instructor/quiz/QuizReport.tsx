"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BiSearchAlt } from "react-icons/bi";
import QuizTable from "./QuizTable";
// Import quiz reports API and types
import { getQuizReports, GetQuizReportsParams, QuizReportDataType } from "@/utils/api/instructor/quiz/getQuizResports";
import toast from "react-hot-toast";
import { extractErrorMessage } from "@/utils/helpers";
import CustomPagination from "@/components/instructor/commonCommponents/pagination/CustomPagination";
import { categoryDataSelector } from "@/redux/reducers/categorySlice";
import { CategoryDataType } from "@/types";
import QuizAttemptDetails from "./QuizAttemptDetails";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";

interface QuizReportProps {
  courseSlug?: string;
  teamSlug?: string;
}

const QuizReport: React.FC<QuizReportProps> = ({ courseSlug, teamSlug }) => {

  const { t } = useTranslation();

  const categories = useSelector(categoryDataSelector) as CategoryDataType[];

  const router = useRouter();

  // Local state for quiz reports data
  const [quizzies, setQuizzies] = useState<QuizReportDataType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filter and pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [totalReports, setTotalReports] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // State to track if we're viewing quiz attempts detail and which quiz is selected
  const [viewingAttempts, setViewingAttempts] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizReportDataType | null>(null);

  // Fetch quiz reports function (similar to fetchAddedCourses)
  const fetchReports = async (params?: {
    page?: number;
    per_page?: number;
    search?: string;
  }) => {
    setIsLoading(true);

    try {
      // Build API parameters based on current filters
      const apiParams: GetQuizReportsParams = {
        per_page: params?.per_page || rowsPerPage,
        page: params?.page || currentPage,
      };

      // Add search parameter if provided
      if (params?.search !== undefined) {
        apiParams.search = params.search;
      } else if (searchTerm.trim()) {
        apiParams.search = searchTerm.trim();
      }

      // Add course slug if provided
      if (courseSlug) {
        apiParams.slug = courseSlug;
      }
      if (teamSlug) {
        apiParams.team_user_slug = teamSlug;
      }

      // Add status filter
      if (categoryFilter) {
        apiParams.category_id = categoryFilter === "all" ? "" : categoryFilter;
      }

      // Fetch quiz reports with server-side filtering and pagination
      const response = await getQuizReports(apiParams);

      if (response) {
        // Check if API returned an error (error: true in response)
        if (!response.error) {
          if (response.data?.data) {
            setQuizzies(response.data.data);
          }
          // Set pagination data directly from response
          if (response.data) {
            setTotalReports(response.data.total);
            setTotalPages(response.data.last_page);
          } else {
            setTotalReports(0);
            setTotalPages(0);
          }
        } else {
          console.log("API error:", response.message);
          toast.error(response.message || "Failed to fetch quiz reports");
          setQuizzies([]);
          setTotalReports(0);
          setTotalPages(0);
        }
      } else {
        console.log("response is null in component", response);
        setQuizzies([]);
        setTotalReports(0);
        setTotalPages(0);
      }
    } catch (error) {
      extractErrorMessage(error);
      setQuizzies([]);
      setTotalReports(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler functions for filters and search (similar to CoursesTable)
  const handleSearchChange = (searchValue: string) => {
    setSearchTerm(searchValue);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchReports({ page });
  };

  const handleRowsPerPageChange = (perPage: number) => {
    setRowsPerPage(perPage);
    setCurrentPage(1); // Reset to first page when changing rows per page
    fetchReports({ per_page: perPage, page: 1 });
  };

  // Fetch reports on component mount
  useEffect(() => {
    if (!searchTerm.trim()) {
      fetchReports();
    }
  }, [searchTerm]);

  // Handle search input change with debouncing
  useEffect(() => {
    if (searchTerm.trim()) {
      const timer = setTimeout(() => {
        setCurrentPage(1);
        fetchReports({ search: searchTerm, page: 1 });
      }, 1500); // 1.5s delay
      return () => clearTimeout(timer);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (categoryFilter) {
      fetchReports();
    }
  }, [categoryFilter]);

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    handleSearchChange(event.target.value);
  };

  const handleRowsPerPageSelectChange = (value: string): void => {
    handleRowsPerPageChange(parseInt(value, 10));
  };

  // Handle view attempts button click
  const handleViewAttempts = (quiz: QuizReportDataType) => {
    if (courseSlug) {
      setSelectedQuiz(quiz);
      setViewingAttempts(true);
    }
    else {
      if (teamSlug) {
        router.push(`/my-teams/${teamSlug}/student-quiz-reports/${quiz.quiz_slug}`);
      }
      else {
        router.push(`/instructor/student-quiz-reports/${quiz.quiz_slug}`);
      }
    }
  };

  // Handle back button click from the attempts view
  const handleBackToQuizzes = () => {
    setViewingAttempts(false);
    setSelectedQuiz(null);
  };

  // Return the quiz attempt details view if a quiz is selected
  if (viewingAttempts && selectedQuiz) {
    return (
      <>
        <QuizAttemptDetails
          onBackClick={handleBackToQuizzes}
          courseSlug={courseSlug}
          quizSlug={selectedQuiz?.quiz_slug}
        />
      </>
    );
  }

  return (
    <div className={`w-full ${!courseSlug ? "bg-white rounded-2xl border borderColor" : ""}`}>
      {/* Header section with title, filter, and search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 gap-4 flex-wrap">
        <h1 className="text-md font-semibold">{t("all_quiz")}</h1>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-auto gap-2 flex-wrap">
          {/* Status filter dropdown */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[250px] md:w-[400px] h-10 border rounded-md sectionBg text-gray-500 focus:ring-0">
              <SelectValue placeholder={t("filter_by_category")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all_categories")}</SelectItem>
              {
                categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>{category.name}</SelectItem>
                ))
              }
            </SelectContent>
          </Select>

          {/* Search input */}
          <div className="flex w-full sm:w-auto">
            <Input
              type="text"
              placeholder={t("search_for_quiz")}
              value={searchTerm}
              onChange={handleSearchInputChange}
              className="rounded-r-none sectionBg focus-visible:ring-0 border-r-0 w-full sm:min-w-[300px] h-10"
            />
            <Button
              type="submit"
              variant="default"
              className="rounded-l-none bg-black text-white hover:bg-black/90 h-10 px-4 flex items-center whitespace-nowrap"
            >
              {t("search")} <BiSearchAlt className="ml-2" size={18} />
            </Button>
          </div>
        </div>
      </div>

      {/* Quiz table */}
      <QuizTable
        isLoading={isLoading}
        quizzes={quizzies}
        handleViewAttempts={handleViewAttempts}
      />

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4">
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            rowsPerPage={rowsPerPage}
            totalItems={totalReports}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageSelectChange}
            showResultText={true}
          />
        </div>
      )}
    </div>
  );
};

export default QuizReport;
