'use client'
import React from 'react';
import { RxCube } from "react-icons/rx";
import { WhyChooseUsType } from '@/utils/api/user/getFeatureSection';
import CustomImageTag from '@/components/commonComp/customImage/CustomImageTag';
import { useTranslation } from '@/hooks/useTranslation';
import Link from 'next/link';
interface WhyChooseUsProps {
    whyChooseUsData: WhyChooseUsType;
}
const WhyChooseUs = ({ whyChooseUsData }: WhyChooseUsProps) => {

    const { t } = useTranslation();
    const features = whyChooseUsData.points;

    if (!whyChooseUsData) return null;

    return (
        <section className="container commonMT commonMB">
            <div className="grid lg:grid-cols-2 gap-y-8 lg:gap-20">
                {/* Content Section */}
                <div className="order-2 lg:order-1 space-y-6">
                    <div className="flexCenter gap-3 bg-[#F2F5F7] p-2 rounded-full text-sm font-normal w-max">
                        <span className='border border-[#D8E0E6] w-6'></span>
                        <span>
                            {t("why_choose_us")}
                        </span>
                        <span className='border border-[#D8E0E6] w-6'></span>
                    </div>

                    <h4 className="sectionTitle lg:w-[74%]">
                        {whyChooseUsData.title}
                    </h4>

                    <p className="">
                        {whyChooseUsData.description}
                    </p>

                    <div className="space-y-4">
                        {features?.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm sm:text-base">
                                <RxCube className="primaryColor font-semibold text-lg" />
                                <span className="">{feature}</span>
                            </div>
                        ))}
                    </div>

                    {whyChooseUsData.button_link ? (
                        <Link
                            href={whyChooseUsData.button_link}
                            target="_blank"
                            className="commonBtn !w-full md:!w-max"
                        >
                            {whyChooseUsData.button_text || t("join_for_free")}
                        </Link>
                    ) : (
                        <button className="commonBtn !w-full md:!w-max">
                            {whyChooseUsData.button_text || t("join_for_free")}
                        </button>
                    )}


                </div>

                {/* Image Section */}
                <div className="order-1 lg:order-2 flexCenter">
                    <div className="">
                        <CustomImageTag
                            src={whyChooseUsData.image}
                            alt="why-choose-us-img"
                            className="rounded-[4px] w-auto h-[250px] md:h-[350px] xl:h-[450px] object-cover"
                        />

                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;