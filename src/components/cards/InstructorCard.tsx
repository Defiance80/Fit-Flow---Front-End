'use client'
import Link from 'next/link';
import React, { useState } from 'react';
import { FaPlay, FaRegStar } from 'react-icons/fa';
import { FaRegCirclePlay } from "react-icons/fa6";
import CustomImageTag from '../commonComp/customImage/CustomImageTag';
import { useTranslation } from '@/hooks/useTranslation';
import RichTextContent from '../commonComp/RichText';
import { useSelector } from 'react-redux';
import { currentLanguageSelector } from '@/redux/reducers/languageSlice';

interface InstructorCardProps {
    name: string;
    title: string;
    description: string;
    rating: number;
    reviewCount: number;
    coursesCount: number;
    previewVideo: string;
    profileUrl: string;
    slug: string;
}

const InstructorCard: React.FC<InstructorCardProps> = ({
    name,
    title,
    description,
    rating,
    reviewCount,
    coursesCount,
    previewVideo,
    profileUrl,
    slug,
}) => {

    const { t } = useTranslation();

    const currentLanguageCode = useSelector(currentLanguageSelector)
    // State for video playback
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);

    // Function to handle video play
    const handleVideoPlay = () => {
        if (previewVideo) {
            setIsVideoPlaying(true);
        }
    }

    // Function to handle video pause - go back to video thumbnail
    const handleVideoPause = () => {
        setIsVideoPlaying(false);
    }
    return (
        <div className="bg-[#F2F5F7] overflow-hidden p-4 rounded-2xl flex flex-col gap-4 border borderColor">
            {/* Video thumbnail */}
            <div className="relative aspect-video rounded-2xl h-[196px] overflow-hidden">
                {isVideoPlaying && previewVideo ? (
                    // Show video when playing
                    <video
                        src={previewVideo || ''}
                        autoPlay
                        controls
                        className="w-full h-full object-cover rounded-2xl"
                        onClick={handleVideoPause}
                    >
                        {t("your_browser_does_not_support_the_video_tag")}
                    </video>
                ) : (
                    // Show video as background with play button overlay
                    <div className="relative w-full h-full bg-gray-400">
                        {/* Video as background/thumbnail */}
                        <video
                            src={previewVideo || ''}
                            className="w-full h-full object-cover rounded-2xl"
                            muted
                            preload="metadata"
                        >
                        </video>
                        {/* Play button overlay */}
                        <div className="absolute inset-0 flex items-center justify-center cursor-pointer" onClick={handleVideoPlay}>
                            <div className="bg-white rounded-full p-3 opacity-90">
                                <FaPlay className="primaryColor text-2xl" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Instructor info */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-[40px] h-[40px] overflow-hidden border border-black p-[2px] rounded-[8px]">
                        <CustomImageTag
                            src={profileUrl}
                            alt={name}
                            className="w-full h-full object-cover rounded-[8px]"
                        />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800">{name}</h3>
                        <p className="text-sm text-gray-600">{title}</p>
                    </div>
                </div>

                <div className="text-gray-700 line-clamp-2">
                    <RichTextContent content={description} />
                </div>

                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-1">
                        <FaRegStar className="" size={18} />
                        <span className="font-semibold">{rating}</span>
                        <span className="text-gray-500 text-sm">({reviewCount} {t("reviews")})</span>
                    </div>

                    <div className="flex items-center gap-1">
                        <FaRegCirclePlay size={18} />
                        <span className='text-gray-500 text-sm'> <span className='font-semibold text-black text-base'>{coursesCount}</span> {t("courses_available")}</span>
                    </div>
                </div>

                <Link
                    title='View Profile'
                    href={`${slug}?lang=${currentLanguageCode}`}
                    className="block w-full bg-black text-white text-center py-2 rounded-[4px]"
                >
                    {t("view_profile")}
                </Link>
            </div>
        </div>
    );
};

export default InstructorCard;
