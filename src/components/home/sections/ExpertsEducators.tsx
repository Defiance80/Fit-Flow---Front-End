"use client";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination"; // Import pagination styles
// import required modules
import { Navigation, Pagination } from "swiper/modules"; // Import Pagination module
import { ArrowLeft, ArrowRight, Star } from "lucide-react"; // Assuming lucide-react for icons
import { BsPlayCircle } from "react-icons/bs";
import { LuGraduationCap } from "react-icons/lu";
import Image from "next/image";

// Define a type for Tutor data for better type safety
type Tutor = {
  id: number;
  name: string;
  specialization: string;
  rating: number;
  reviews: number;
  coursesAvailable: number;
  enrolledStudents: number;
  imageUrl?: string; // Optional image URL
};

// Dummy data for tutors - replace with actual data later
const tutors: Tutor[] = [
  {
    id: 1,
    name: "Michael Brown",
    specialization: "Data Scientist Specialist",
    rating: 4.1,
    reviews: 2151,
    coursesAvailable: 8,
    enrolledStudents: 999,
  },
  {
    id: 2,
    name: "Sarah Jones",
    specialization: "Frontend Developer Expert",
    rating: 4.5,
    reviews: 1840,
    coursesAvailable: 12,
    enrolledStudents: 1250,
  },
  {
    id: 3,
    name: "David Lee",
    specialization: "AI & Machine Learning",
    rating: 4.8,
    reviews: 3012,
    coursesAvailable: 10,
    enrolledStudents: 1500,
  },
  {
    id: 4,
    name: "Emily White",
    specialization: "UX/UI Design Lead",
    rating: 4.3,
    reviews: 1505,
    coursesAvailable: 6,
    enrolledStudents: 850,
  },
  {
    id: 5,
    name: "Chris Green",
    specialization: "Cybersecurity Analyst",
    rating: 4.6,
    reviews: 2500,
    coursesAvailable: 9,
    enrolledStudents: 1100,
  },
];

// Tutor Card Component
// This component represents a single card in the carousel.
// It takes tutor data as props and displays it.
const TutorCard = ({ tutor }: { tutor: Tutor }) => (
  <div className="bg-white rounded-[10px] overflow-hidden p-3 flex flex-col h-full text-gray-900">
    {" "}
    {/* Set text color for card */}
    {/* Top section with image and info */}
    <div className="flex items-center space-x-4">
      {/* Image Placeholder */}
      <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
        {tutor.imageUrl && (
          <Image
            layout="fill"
            src={tutor.imageUrl}
            alt={tutor.name}
            className="w-full h-full object-cover rounded-lg"
          />
        )}
      </div>
      {/* Tutor Info */}
      <div className="flex-grow overflow-hidden">
        <h3 className="text-md font-semibold truncate">{tutor.name}</h3>{" "}
        {/* Removed text-gray-900 as parent has it */}
        <p className="text-sm text-gray-600 truncate">{tutor.specialization}</p>
        {/* Rating */}
        <div className="flex items-center mt-1 space-x-1">
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          <span className="text-sm font-medium text-gray-700">
            {tutor.rating.toFixed(1)}
          </span>
          <span className="text-sm text-gray-500">
            ({tutor.reviews} Reviews)
          </span>
        </div>
      </div>
    </div>
    {/* Separator */}
    <hr className="border-gray-200 my-3" />
    {/* Bottom section with stats */}
    <div className="flex flex-col sm:flex-row justify-between items-start xs:items-center gap-2 xs:gap-0 text-sm text-gray-600 mt-auto">
      {" "}
      {/* Added flex-col for small screens, with gap */}
      {/* Courses Available */}
      <div className="flex items-center space-x-1.5">
        <BsPlayCircle className="w-4 h-4 primaryColor flex-shrink-0" />
        <span className="text-xs sm:text-sm">
          {tutor.coursesAvailable} Courses Available
        </span>
      </div>
      {/* Enrolled Students */}
      <div className="flex items-center space-x-1.5">
        <LuGraduationCap className="w-4 h-4 primaryColor flex-shrink-0" />
        <span className="text-xs sm:text-sm">
          {tutor.enrolledStudents} Enrolled Students
        </span>
      </div>
    </div>
  </div>
);

export default function ExpertsEducators() {
  return (
    // Main container with purple background and padding
    <section className="primaryBg py-12 sm:py-16 text-white relative">
      <div className="container px-4 sm:px-6">
        {/* Top section: Label, Title, Description, Button */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-8 sm:mb-10">
          {/* Left side content */}
          <div className="md:w-2/3 mb-6 md:mb-0">
            {/* Expert Educators Pill */}
            {/* Expert Educators Pill - Updated background to white with opacity for better contrast on primary background */}
            <span className="inline-block bg-white/20 rounded-full px-4 py-1 text-sm font-medium mb-3">
              — Expert Educators —
            </span>
            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-bold mb-3">
              Learn from Industry Experts and Elevate Your Skills
            </h2>
            {/* Description */}
            <p className="text-indigo-200 text-base sm:text-lg">
              Learn from the best in the field! Our platform connects you with
              highly qualified instructors who bring knowledge, experience, and
              passion to every lesson.
            </p>
          </div>
          {/* Right side button */}
          <div className="flex-shrink-0">
            <button className="border border-white rounded-md px-5 sm:px-6 py-2 text-sm font-medium hover:bg-white hover:primaryColor transition duration-150 ease-in-out flex items-center space-x-2">
              <span>View All Tutors</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Swiper Carousel */}
        {/* We add padding-bottom to make space for navigation buttons if they were outside */}
        {/* Increased horizontal padding for navigation buttons */}
        <div className="relative">
          {" "}
          {/* Added padding here */}
          <Swiper
            // Add Pagination to the modules
            modules={[Navigation, Pagination]}
            spaceBetween={15} // Space between slides
            slidesPerView={1.2} // Default slides per view
            navigation={{
              // Custom navigation buttons
              nextEl: ".swiper-button-next-custom",
              prevEl: ".swiper-button-prev-custom",
            }}
            breakpoints={{
              // Responsive breakpoints
              640: {
                // sm
                slidesPerView: 2,
              },
              768: {
                // md
                slidesPerView: 2,
              },
              1024: {
                // lg
                slidesPerView: 3,
              },
              1280: {
                // xl
                slidesPerView: 4,
              },
            }}
            // Pagination configuration
            pagination={{
              el: ".swiper-pagination-custom",
              clickable: true,
            }}
            className=" !static" // Add padding-bottom for pagination bullets on mobile, adjust for desktop. !static is kept.
          >
            {/* Map through tutor data to create slides */}
            {tutors.map((tutor) => (
              <SwiperSlide key={tutor.id} className="h-auto pb-1">
                {" "}
                {/* Added padding-bottom to slide */}
                {/* Render the TutorCard component for each tutor */}
                {/* Added h-full to SwiperSlide and TutorCard parent div to ensure cards have same height */}
                <TutorCard tutor={tutor} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      {/* Custom Navigation Buttons - hidden on small screens (md and below), visible on larger screens */}
      <button className="swiper-button-prev-custom absolute left-4 md:left-[5%] bottom-[25%] transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md primaryColor hover:bg-gray-100 transition duration-150 ease-in-out hidden md:block">
        <ArrowLeft className="w-6 h-6" />
      </button>
      <button className="swiper-button-next-custom absolute right-4 md:right-[5%] bottom-[25%] transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md primaryColor hover:bg-gray-100 transition duration-150 ease-in-out hidden md:block">
        <ArrowRight className="w-6 h-6" />
      </button>
    </section>
  );
}
