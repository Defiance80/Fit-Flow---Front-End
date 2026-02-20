import React from 'react';
import { FaStar } from 'react-icons/fa';
import { useTranslation } from '@/hooks/useTranslation';
import CustomImageTag from '@/components/commonComp/customImage/CustomImageTag';
import RichTextContent from '@/components/commonComp/RichText';


interface InstructorProps {
    name: string | null;
    title: string;
    rating?: number;
    reviews?: number;
    profileImage?: string;
    aboutMe: string;
    skills: string | null;
}

const CourseInstructor: React.FC<InstructorProps> = ({
    name,
    title,
    rating,
    reviews,
    profileImage,
    aboutMe,
    skills,
}) => {
    const { t } = useTranslation();
    return (
        <div className="">
            {/* Header */}
            <div className="py-3">
                <h2 className="text-lg md:text-xl font-bold text-gray-800">{t("instructor")}</h2>
            </div>
            <div className='border borderColor rounded-2xl overflow-hidden bg-white'>
                {/* Instructor Info */}
                <div className="max-479:p-3 p-5 border-b borderColor flex items-center gap-4">
                    <div className="flex-shrink-0 border border-black p-[2px] rounded-full h-[90px] w-[90px] max-479:h-[60px] max-479:w-[60px]">
                        <CustomImageTag
                            src={profileImage}
                            alt={name || ""}
                            className="w-full h-full object-cover rounded-full"
                        />
                    </div>
                    <div>
                        <div className="flex items-center mb-1">
                            <div className="flex text-yellow-400 mr-2">
                                <FaStar />
                            </div>
                            <span className="font-medium text-gray-800">{rating}</span>
                            <span className="text-gray-500 text-sm ml-1">({reviews} {t("reviews")})</span>
                        </div>
                        <h3 className="font-medium text-lg">{name}</h3>
                        <p className="text-gray-600 text-sm">{title}</p>
                    </div>
                </div>

                {/* Profile Content */}
                <div className="p-5">
                    {/* Profession */}
                    <div className="mb-1">
                        <div className="text-gray-700">
                            <RichTextContent content={aboutMe} />
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="mb-5">
                        <h4 className="font-medium mb-2">{t("my_skills")}:</h4>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            {skills?.split(",").map((skill, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="inline-block w-1 h-1 rounded-full bg-gray-700 mt-2.5 mr-2"></span>
                                    <span>{skill.trim()}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseInstructor; 