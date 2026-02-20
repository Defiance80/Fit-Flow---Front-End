'use client'
import React, { useEffect, useRef, useState } from 'react'
import { FiPlusCircle, FiUploadCloud } from 'react-icons/fi'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { submitAssignment } from '@/utils/api/user/lesson-overview/assignment/assignmentSubmit';
import { setIsCurriculumItemCompleted } from '@/redux/reducers/helpersReducer';
import { editAssignmentSubmission } from '@/utils/api/user/lesson-overview/assignment/editAssignment';
import { useTranslation } from '@/hooks/useTranslation';

interface AddAssignmentModalProps {
    submissionId?: number;
    assignmentId?: number;
    onAssignmentSubmitted?: () => void; // Callback to refresh data after submission
    isEdit?: boolean;
    existingTitle?: string;
    openFromParent?: boolean; // allow parent to open modal
    onCloseModal?: () => void;
    allowedFileTypes?: string[];
}

// validation schema using zod
// For new submissions: assignment_id, comment, and files are required
// For edit submissions: only comment and files are required (assignment_id comes from existing submission)
const assignmentFormSchema = (isEdit: boolean) => z.object({
    assignment_id: isEdit ? z.number().optional() : z.number().min(1, "Assignment ID is required"),
    comment: z.string().min(1, "Assignment title is required").max(1000, "Comment must be less than 1000 characters"),
    files: z.array(z.instanceof(File)).min(1, "At least one file is required"),
});

// type for form errors
type FormErrors = {
    assignment_id?: string;
    comment?: string;
    files?: string;
};

const AddAssignmentModal: React.FC<AddAssignmentModalProps> = ({
    submissionId,
    assignmentId,
    onAssignmentSubmitted,
    isEdit = false,
    existingTitle,
    openFromParent = false,
    onCloseModal,
    allowedFileTypes,
}) => {

    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [assignmentTitle, setAssignmentTitle] = useState(existingTitle || '');


    const { t } = useTranslation();

    // reset the input type file 
    const fileInputRef = useRef<HTMLInputElement>(null);


    // open modal when the parent tiggers it
    useEffect(() => {
        if (openFromParent) {
            setIsOpen(true);
        }
    }, [openFromParent]);

    // reset all fields when modal closes
    useEffect(() => {
        if (!isOpen) {
            setAssignmentTitle(existingTitle || '');
            setFile(null);
            setErrors({});
            setIsDragging(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    }, [isOpen, existingTitle]);

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isDragging) {
            setIsDragging(true);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    // For comment input
    const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAssignmentTitle(e.target.value);

        // Clear comment error instantly when user types
        if (errors.comment) {
            setErrors(prev => ({ ...prev, comment: undefined }));
        }
    };

    // For file input
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);

            // Clear file error when a file is selected
            if (errors.files) {
                setErrors(prev => ({ ...prev, files: undefined }));
            }
        }
    };

    const getAcceptType = () => {
        if (allowedFileTypes?.includes("image")) return "image/*";
        if (allowedFileTypes?.includes("audio")) return "audio/*";
        if (allowedFileTypes?.includes("video")) return "video/*";
        if (allowedFileTypes?.includes("document")) return ".pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .txt";
        return "";
    };

    // Validate form using Zod
    // Different validation rules for new submissions vs editing existing submissions
    const validateForm = () => {
        const dataToValidate = {
            assignment_id: assignmentId,
            comment: assignmentTitle,
            files: file ? [file] : [],
        };

        try {
            // Use different schema based on edit mode
            assignmentFormSchema(isEdit).parse(dataToValidate);
            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors: FormErrors = {};
                error.errors.forEach(err => {
                    const field = err.path[0] as keyof FormErrors;
                    newErrors[field] = err.message;
                });
                setErrors(newErrors);
            }
            toast.error("Please fix the validation errors before submitting");
            return false;
        }
    };

    const handleUpload = async () => {
        if (!validateForm()) {
            return
        }

        setIsLoading(true)

        try {
            let response;
            // If editing (re-submitting a rejected assignment), use edit API
            // Otherwise, use the submit API for new submissions
            if (isEdit && submissionId) {
                // Call edit API when submission status is rejected and user wants to re-submit
                response = await editAssignmentSubmission({
                    id: submissionId,
                    files: [file!],
                    comment: assignmentTitle,
                });
            } else {
                // Call submit API for new assignment submissions
                response = await submitAssignment({
                    assignment_id: assignmentId || 0,
                    files: [file!],
                    comment: assignmentTitle,
                });
            }

            if (response?.error) {
                // remove this if you wnat to show the modal after the error
                toast.error(response.message || "Failed to submit assignment")
                setIsOpen(false)
                setAssignmentTitle('')
                setFile(null)
                setErrors({})
                if (fileInputRef.current) fileInputRef.current.value = "";
                return
            }

            toast.success(response?.message || "Assignment submitted successfully")
            dispatch(setIsCurriculumItemCompleted({ completed: true }));
            setIsOpen(false)
            setAssignmentTitle('')
            setFile(null)
            setErrors({})

            // Call the callback to refresh assignment data
            if (onAssignmentSubmitted) {
                onAssignmentSubmitted();
            }

        } catch (error) {
            console.error("Error in handleUpload:", error)
            toast.error("Failed to submit assignment")
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open && onCloseModal) {
                onCloseModal(); // tell parent modal is closed
            }
        }}>
            {!openFromParent && (
                <DialogTrigger asChild>
                    <button className="border borderColor rounded-md py-2 px-4 flex items-center gap-2 mx-auto" onClick={() => setIsOpen(true)}>
                        <FiPlusCircle size={14} />
                        <span className="text-sm">{t("add_assignment")}</span>
                    </button>
                </DialogTrigger>
            )}
            <DialogContent className="bg-white rounded-md p-0 max-w-md w-full">
                <DialogHeader className='hidden'>
                    <DialogTitle>{isEdit ? "Edit Assignment" : "Upload Assignment"}</DialogTitle>
                </DialogHeader>
                <div className="p-5 relative">
                    {/* Title and close button */}
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium">{isEdit ? "Edit Assignment" : "Upload Assignment"}</h2>
                    </div>

                    {/* Form content */}
                    <div className="py-5">
                        <div className="mb-5">
                            <label className="block mb-2 text-sm font-medium">{t("assignment_title")}</label>
                            <input
                                type="text"
                                placeholder="Enter Text..."
                                value={assignmentTitle}
                                onChange={handleCommentChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
                            />
                            {errors.comment && <p className="text-sm text-red-500 mt-1">{errors.comment}</p>}
                        </div>

                        {/* File upload area */}
                        <div
                            className={`border-2 border-dashed ${isDragging ? 'borderPrimary bg-blue-50' : 'border-gray-300'
                                } rounded-md p-6 flex flex-col items-center justify-center cursor-pointer`}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            <div className="mb-3 p-3 bg-gray-100 rounded-full">
                                <FiUploadCloud className="text-gray-500 text-2xl" />
                            </div>

                            {file ? (
                                <p className="text-sm text-center mb-2">{file.name}</p>
                            ) : (
                                <p className="text-sm text-center mb-2">{t("choose_a_file_or_drag_and_drop_it_here")}</p>
                            )}

                            <p className="text-sm text-gray-500 mb-3">or</p>

                            <label className="cursor-pointer">
                                <span className="px-4 py-2 border borderPrimary rounded-md text-sm primaryColor hover:bg-gray-50">
                                    {t("choose_file")}
                                </span>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleFileChange}
                                    accept={getAcceptType()}
                                />
                            </label>
                        </div>
                        {errors.files && <p className="text-sm text-red-500 mt-2">{errors.files}</p>}
                    </div>

                    {/* Upload button */}
                    <button
                        onClick={handleUpload}
                        disabled={isLoading}
                        className="commonBtn w-full"
                    >
                        {isLoading ? "Uploading..." : "Upload"}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AddAssignmentModal
