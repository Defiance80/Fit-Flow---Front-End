'use client'
import React from 'react'
import CustomImageTag from "../commonComp/customImage/CustomImageTag";
import maintenanceModeImage from "@/assets/images/states-imgs/maintanance-mode.svg";
import { useTranslation } from '@/hooks/useTranslation';
import EmptyStatesContent from './EmptyStatesContent';

const MaintenanceMode = () => {
    const { t } = useTranslation();
    return (
        <div className='flexColCenter h-screen'>
            <CustomImageTag src={maintenanceModeImage} alt="Maintenance Mode" className="emptyStatesImg" />
            <EmptyStatesContent title={t("maintenance_mode")} description={t("maintenance_mode_desc")} />
        </div>
    )
}

export default MaintenanceMode
