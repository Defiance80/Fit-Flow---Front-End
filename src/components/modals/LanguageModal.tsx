'use client'
import React, { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { IoCaretDownSharp } from "react-icons/io5";
import { useTranslation } from '@/hooks/useTranslation';
import {
    languagesSelector,
    currentLanguageSelector,
    setLanguages,
    setCurrentLanguage,
    setCurrentTranslations,
    setIsRTL,
    setLanguageLastFetch
} from '@/redux/reducers/languageSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getLanguage } from '@/utils/api/language/getLanguages';
import { extractErrorMessage } from '@/utils/helpers';
import toast from 'react-hot-toast';
import CustomImageTag from '../commonComp/customImage/CustomImageTag';

const LanguageModal: React.FC = () => {

    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();

    // Redux selectors - now using simplified selectors
    const languages = useSelector(languagesSelector);
    const currentLanguage = useSelector(currentLanguageSelector);

    // Local state for loading
    const [isLoadingLanguage, setIsLoadingLanguage] = useState(false);

    // Fetch languages function - following fetchAddedCourses pattern
    const fetchLanguagesData = async () => {
        setIsLoadingLanguage(true);

        try {
            // Fetch all languages with empty code to get all languages + default translations
            const response = await getLanguage({
                system_type: "web",
                code: "" // Empty code to get all languages + default translations
            });

            if (response) {
                // Check if API returned an error (error: string | null in response)
                if (!response.error) {
                    if (response.data?.languages) {
                        // Set all languages in Redux
                        dispatch(setLanguages(response.data.languages));

                        // Set default language if current language is not set
                        if (!currentLanguage) {
                            const defaultLanguage = response.data.languages.find(lang => lang.is_default);
                            if (defaultLanguage) {
                                dispatch(setCurrentLanguage(defaultLanguage.code));
                                dispatch(setCurrentTranslations(defaultLanguage.translations_web));
                                dispatch(setIsRTL(defaultLanguage.is_rtl));
                            }
                        }

                        // Set last fetch timestamp
                        dispatch(setLanguageLastFetch(Date.now()));
                    }
                } else {
                    console.log("API error:", response.error);
                    toast.error(response.error || "Failed to fetch languages");
                }
            } else {
                console.log("response is null in component", response);
            }
        } catch (error) {
            extractErrorMessage(error);
            console.error('❌ Failed to fetch languages:', error);
        } finally {
            setIsLoadingLanguage(false);
        }
    };

    // Fetch all languages when component mounts
    useEffect(() => {
        if (languages.length === 0) {
            fetchLanguagesData();
        }
    }, [languages.length]);

    // Handle language change - following simplified pattern
    const handleLanguageChange = async (languageCode: string) => {
        if (languageCode !== currentLanguage) {
            setIsLoadingLanguage(true);

            try {
                // Save to localStorage for persistence
                localStorage.setItem('selectedLanguage', languageCode);

                // Fetch specific language translations
                const response = await getLanguage({
                    system_type: "web",
                    code: languageCode // Pass specific language code
                });

                if (response && !response.error) {
                    // Get the specific language data (should be only one language in response)
                    const languageData = response.data?.languages?.[0];

                    if (languageData && languageData.code === languageCode) {
                        // Update Redux state with new language data
                        dispatch(setCurrentLanguage(languageCode));
                        dispatch(setCurrentTranslations(languageData.translations_web));
                        dispatch(setIsRTL(languageData.is_rtl));
                        dispatch(setLanguageLastFetch(Date.now()));
                    } else {
                        toast.error('Language not found in response');
                    }
                } else {
                    toast.error(response?.error || 'Failed to fetch language');
                }
            } catch (error) {
                extractErrorMessage(error);
                console.error('❌ Failed to change language:', error);
            } finally {
                setIsLoadingLanguage(false);
                // Close modal
                setIsOpen(false);
            }
        }
    };

    // Get current language display info
    const getCurrentLanguageInfo = () => {
        const currentLang = languages.find(lang => lang.code === currentLanguage);
        return {
            name: currentLang?.name || 'English',
            code: currentLanguage || 'EN',
            flag: currentLang?.image || '' // Using default flag since API doesn't provide flag
        };
    };

    const currentLangInfo = getCurrentLanguageInfo();

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div className='flexCenter gap-1 border borderColor rounded-[8px] p-3 cursor-pointer'>
                    <div className='flexCenter gap-2'>
                        <CustomImageTag
                            src={currentLangInfo.flag}
                            alt='language-flag'
                            className='w-[24px] h-[24px] rounded-full'
                        />
                        <span>{currentLangInfo.code.toUpperCase()}</span>
                    </div>
                    <span><IoCaretDownSharp /></span>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[572px] p-0">
                <DialogHeader className='p-6 pb-0'>
                    <DialogTitle>{t("select_language")}</DialogTitle>
                </DialogHeader>

                <div className='border-t borderColor p-6 grid grid-cols-2 sm:grid-cols-3 gap-6'>
                    {isLoadingLanguage && languages.length === 0 ? (
                        <div className="col-span-full text-center py-8 text-gray-500">
                            {t("loading_languages")}
                        </div>
                    ) : languages.length > 0 ? (
                        languages.map((language) => (
                            <div
                                className={`flexCenter justify-start gap-1 border borderColor rounded-[8px] cursor-pointer p-4 transition-all duration-200 ${currentLanguage === language.code
                                    ? 'border-2 primaryBorder bg-primaryColor/5'
                                    : 'hover:border-primaryColor/50'
                                    } ${isLoadingLanguage ? 'opacity-50 cursor-not-allowed' : ''}`}
                                key={language.code}
                                onClick={() => !isLoadingLanguage && handleLanguageChange(language.code)}
                            >
                                <div className='flexCenter gap-2'>
                                    <CustomImageTag
                                        src={language.image}
                                        alt={`${language.name} flag`}
                                        className='w-[24px] h-[24px] rounded-full'
                                    />
                                    <span className={currentLanguage === language.code ? 'font-semibold' : ''}>
                                        {language.name}
                                        {isLoadingLanguage && currentLanguage === language.code && (
                                            <span className="ml-2 text-xs text-gray-500">{t("loading")}</span>
                                        )}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-8 text-gray-500">
                            {t("no_languages_available")}
                        </div>
                    )}
                </div>

            </DialogContent>
        </Dialog>
    )
}

export default LanguageModal