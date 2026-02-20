import Image from 'next/image'
import React from 'react'
import img from '../../../../assets/images/courseCertificate.png'
import { useTranslation } from '@/hooks/useTranslation';  

const CourseCertificate = () => {
    const { t } = useTranslation();
    return (
        <div className="primaryBg text-white p-4 md:p-8 lg:p-12 between-1200-1399:p-4 rounded-2xl grid grid-cols-1 lg:grid-cols-2 relative gap-y-6 lg:gap-y-0 lg:h-[304px] lg:gap-6">
            <div className='flex flex-col gap-3 order-2 lg:order-1'>
                <h2 className="sectionTitle mb-2">{t("earn_your_certificate")}</h2>
                <p className="sectionPara opacity-[76%] mb-4 lg:w-[90%] 2xl:w-full">
                    {t("cirtificate_description")}
                </p>
                <button className="bg-white primaryColor font-semibold py-2 px-6 rounded-[4px] w-max">
                    {t("enroll_now")}
                </button>
            </div>
            <div className="flex justify-center order-1 lg:order-2">
                <div className="bg-white p-2 rounded-2xl shadow-[0px_14px_36px_3px_#ADB3B852] -mt-16 lg:absolute lg:top-0 lg:bottom-0 lg:h-max lg:w-max lg:m-auto">
                    <Image
                        src={img}
                        alt="course-certificate"
                        className="rounded-2xl lg:w-[420px] between-1200-1399:w-[320px] lg:h-[320px]"
                    />
                </div>
            </div>
        </div>
    )
}

export default CourseCertificate