'use client'
import React from 'react'
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { ActionCardType } from '@/utils/api/instructor/earnings/getEarnings';
import { FaArrowRight } from 'react-icons/fa6';
import { useTranslation } from '@/hooks/useTranslation';
import { getCurrencySymbol } from '@/utils/helpers';
import icon1 from '@/assets/images/instructorPanel/earnings/availableWithdrawal.svg';
import icon2 from '@/assets/images/instructorPanel/earnings/totalWithdrawal.svg';
import CustomImageTag from '@/components/commonComp/customImage/CustomImageTag';

interface WithdrawlsCardsProps {
    withdrawlsData: ActionCardType;
}

const WithdrawlsCards = ({ withdrawlsData }: WithdrawlsCardsProps) => {

    const { t } = useTranslation();
    const router = useRouter();

    return (
        <div className="flex flex-col md:flex-row lg:flex-col gap-3 md:gap-4">
            {/* Available to Withdraw Card */}
            <Card className="p-4 md:p-6 bg-black text-white w-full rounded-2xl">
                <div className="flex justify-between items-start mb-8 md:mb-12">
                    <div className="flex gap-2 items-center">
                        <div className="w-8 h-8 md:w-16 md:h-16 bg-white rounded-[8px] flexCenter">
                            <CustomImageTag src={icon1.src} alt="icon" className="w-7 h-7 md:w-8 md:h-8" />
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        className="bg-white text-black "
                        onClick={() =>
                            router.push("/instructor/earnings/withdraw-details")
                        }
                    >
                        {t("withdraw")} <FaArrowRight className="ml-1" />
                    </Button>
                </div>
                <div>
                    <p className="text-xs md:text-sm mb-1">{t("available_to_withdraw")}</p>
                    <p className="text-2xl md:text-3xl font-semibold">
                        {getCurrencySymbol()}{withdrawlsData?.available_to_withdraw.value || "0.00"}
                    </p>
                </div>
            </Card>

            {/* Total Withdrawal Card */}
            <Card className="p-4 md:p-6 w-full rounded-2xl">
                <div className="flex justify-between items-start mb-8 md:mb-12">
                    <div className="flex gap-2 items-center">
                    <div className="w-8 h-8 md:w-16 md:h-16 bg-black rounded-[8px] flexCenter">
                            <CustomImageTag src={icon2.src} alt="icon" className="w-7 h-7 md:w-8 md:h-8" />
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        className="bg-black text-white"
                        onClick={() =>
                            router.push("/instructor/earnings/withdraw-details")
                        }
                    >
                        {t("view_history")} <FaArrowRight className="ml-1" />
                    </Button>
                </div>
                <div>
                    <p className="text-xs md:text-sm text-muted-foreground mb-1">
                        {t("total_withdrawal")}
                    </p>
                    <p className="text-2xl md:text-3xl font-semibold">
                        {getCurrencySymbol()}{withdrawlsData?.total_withdrawal.value || "0.00"}
                    </p>
                </div>
            </Card>
        </div>
    )
}

export default WithdrawlsCards