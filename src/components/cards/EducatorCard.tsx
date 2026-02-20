import { educatorCardDataTypes } from "@/types";
import { FaStar } from "react-icons/fa";
import { GoPlay } from "react-icons/go";
import { SlGraduation } from "react-icons/sl";
import CustomImageTag from "../commonComp/customImage/CustomImageTag";
import { useTranslation } from "@/hooks/useTranslation";
import Link from "next/link";

const EducatorCard: React.FC<educatorCardDataTypes> = ({
    name,
    title,
    average_rating,
    review_count,
    active_courses_count,
    student_enrolled_count,
    profile,
    slug
}) => {
    const { t } = useTranslation();
    return (
        <Link href={`/instructors/${slug}`} className="bg-white rounded-lg shadow-sm flex flex-col h-full relative overflow-hidden">
            <div className="flex items-center gap-4 mb-4 px-4 pt-4">
                <div className="border-2 borderColor p-1 rounded-[16px] overflow-hidden">
                    <CustomImageTag
                        src={profile}
                        alt={name}
                        className="w-[89px] h-[89px] object-cover rounded-[16px]"
                    />
                </div>
                <div className="flex flex-col gap-2 md:gap-4">
                    <div className="flex flex-col gap-1">
                        <h3 className="font-semibold">{name}</h3>
                        <p className="">{title}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                        <FaStar className="text-[#DB9305]" />
                        <span className="">{average_rating}</span>
                        <span className="">({review_count} {t("reviews")})</span>
                    </div>
                </div>
            </div>

            <div className="flex justify-between text-sm mt-auto gap-2 pt-2 md:pt-4 border-t borderColor p-4">
                <div className="flex items-center gap-1 border-r borderColor pr-4">
                    <GoPlay className="primaryColor" size={20} />
                    <span>{active_courses_count} {t("courses_available")}</span>
                </div>
                <div className="flex items-center gap-1">
                    <SlGraduation className="primaryColor" size={20} />
                    <span>{student_enrolled_count} {t("enrolled_students")}</span>
                </div>
            </div>
        </Link>
    );
};

export default EducatorCard