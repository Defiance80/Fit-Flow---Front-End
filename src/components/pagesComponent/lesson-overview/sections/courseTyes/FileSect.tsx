'use client'
import React from 'react'
import { useSelector } from 'react-redux'
import { selectedCurriculumItemSelector } from '@/redux/reducers/helpersReducer'

const FileSect = () => {

    const selectedCurriculumItem = useSelector(selectedCurriculumItemSelector);

    return (
        <div className=''>
            <iframe
                src={selectedCurriculumItem?.file || ''}
                className='w-full min-h-[356px] sm:min-h-[486px] md:min-h-[686px] overflow-y-auto customScrollbar'
            />

        </div>
    )
}

export default FileSect
