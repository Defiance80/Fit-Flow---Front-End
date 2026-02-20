"use client";

import React, { useState, useEffect } from "react";
import { z } from "zod";
import { BecomeInstructorDataType, CustomFormField } from "@/types/instructorTypes/instructorTypes";
import { BiCloudUpload } from "react-icons/bi";
import { IoIosCloseCircle } from "react-icons/io";
import { useDropzone } from 'react-dropzone';
import dynamic from 'next/dynamic';
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { becomeInstructorDataSelector, setBecomeInstructorData, setSocialMedia, setCustomFieldData } from "@/redux/instructorReducers/becomeInstructor";
import { useTranslation } from "@/hooks/useTranslation";
import { translate } from "@/utils/helpers";

// Dynamically import ReactQuill with SSR disabled to prevent "document is not defined" error
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

// Define Zod schema for become instructor validation
const becomeInstructorSchema = z.object({
  qualification: z.any().optional(),
  experience: z.any().optional(),
  skills: z.any().optional(),
  bankName: z.string().min(1, translate("bank_name_required")),
  bankHolderName: z.string().min(1, translate("bank_holder_name_required")),
  bankAccNum: z.string().min(1, translate(("bank_account_number_required"))),
  bankIfscCode: z.string().min(1, translate("bank_ifsc_code_required")),
  idProof: z.any().refine((val) => val !== null, translate("id_proof_required")),
  previewVideo: z.any().refine((val) => val !== null, translate("preview_video_required")),
  aboutMe: z.string().min(1, translate("about_me_section_required")),
  teamName: z.string().optional(),
  teamLogo: z.any().optional(),
});

// Define team-specific schema
const teamInstructorSchema = becomeInstructorSchema.extend({
  teamName: z.string().min(1, translate("team_name_required")),
  teamLogo: z.any().refine((val) => val !== null, translate("team_logo_required")),
});

// Define a type for form errors
type FormErrors = Partial<Record<keyof BecomeInstructorDataType, string>>;

interface FileUploadProps {
  label: string;
  required?: boolean;
  description?: string;
  currentFile?: File | null;
  onFileSelected: (file: File | null) => void;
  error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  required,
  currentFile,
  onFileSelected,
  error,
}) => {
  const [fileDataUrl, setFileDataUrl] = useState<string | null>(null);
  const { t } = useTranslation();
  // Update file preview when currentFile changes
  useEffect(() => {
    if (currentFile && currentFile.type?.includes('image')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileDataUrl(reader.result as string);
      };
      reader.readAsDataURL(currentFile);
    } else {
      setFileDataUrl(null);
    }
  }, [currentFile]);

  // Generate ID for the input field
  const inputId = `file-upload-${label.toLowerCase().replace(/\s+/g, "-")}`;

  // Determine if this is a video upload field
  const isVideoUpload = label.toLowerCase()?.includes('video');

  // Setup react-dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: isVideoUpload
      ? {
        'video/mp4': ['.mp4'],
        'video/webm': ['.webm'],
        'video/quicktime': ['.mov'],
        'video/x-msvideo': ['.avi'],
        'video/mpeg': ['.mpeg', '.mpg']
      }
      : {
        'image/png': ['.png'],
        'image/jpeg': ['.jpg', '.jpeg'],
        'application/pdf': ['.pdf']
      },
    onDrop: acceptedFiles => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const uploadedFile = acceptedFiles[0];

        // Check file size for videos (10MB limit)
        if (isVideoUpload && uploadedFile.size > 10 * 1024 * 1024) {
          toast.error(t("video_file_exceeds_the_maximum_size_of_10mb"));
          return;
        }

        onFileSelected(uploadedFile);

        // Create preview for images
        if (uploadedFile.type?.includes('image')) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setFileDataUrl(reader.result as string);
          };
          reader.readAsDataURL(uploadedFile);
        } else {
          setFileDataUrl(null);
        }
      }
    },
    multiple: false
  });

  // Handle file removal
  const handleFileRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFileDataUrl(null);
    onFileSelected(null);
  };

  return (
    <div className="mb-6">
      <label className={`block text-sm font-medium text-black mb-1 ${required && 'requireField'}`}>
        {label}
      </label>
      <div
        {...getRootProps()}
        className={`mt-1 flex justify-center items-center px-6 py-8 border-2 border-dashed rounded-lg sectionBg dark:bg-gray-800 transition-colors ${isDragActive
          ? "border-indigo-500 bg-indigo-50 dark:border-indigo-400"
          : "border-gray-300 dark:border-gray-600"
          }`}
      >
        <input {...getInputProps()} id={inputId} name={inputId} required={required} />

        {currentFile ? (
          <div className="space-y-3 text-center w-full">
            <p className="text-sm font-medium text-green-600 dark:text-green-400">
              {t("file_selected")}: {currentFile.name}
            </p>

            {fileDataUrl && currentFile.type?.includes('image') && (
              <div className="mt-2 max-w-xs mx-auto flexCenter">
                <img
                  src={fileDataUrl}
                  alt="Preview"
                  className="max-h-40 object-contain"
                />
              </div>
            )}

            {currentFile.type === "application/pdf" && (
              <div className="mt-2">
                <p className="text-gray-600 dark:text-gray-400">{t("pdf_file_selected")}</p>
              </div>
            )}

            {currentFile.type?.includes('video') && (
              <div className="mt-2">
                <p className="text-green-600 font-medium">{t("video_file_selected")}</p>
                <p className="text-sm text-gray-500">
                  {(currentFile.size / (1024 * 1024)).toFixed(2)} MB · {currentFile.type.split('/')[1].toUpperCase()}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={handleFileRemove}
              className="commonBtn !bg-transparent primaryColor border !primaryBorder hover:!bg-transparent flex items-center justify-center gap-2 mx-auto"
            >
              {t("remove_file")}
              <IoIosCloseCircle className="ml-1" size={20} />
            </button>
          </div>
        ) : (
          <div className="space-y-5 text-center">
            <div className="flexCenter">
              <div className="flexCenter w-14 h-14 bg-white rounded-[8px]">
                <BiCloudUpload size={40} color="#000" />
              </div>
            </div>
            <div className="mb-2 text-black dark:text-gray-300">
              {isDragActive
                ? t("drop_your_file_here")
                : isVideoUpload
                  ? t("choose_a_video_file_or_drag_and_drop_it_here")
                  : t("choose_a_file_or_drag_and_drop_it_here")}
            </div>
            <button
              type="button"
              // onClick={(e) => e.stopPropagation()}
              className="commonBtn !bg-transparent primaryColor border !primaryBorder hover:!bg-transparent my-2"
            >
              {t("Choose file")}
            </button>
            {isVideoUpload && (
              <p className="text-xs text-gray-500">
                {t("supported_formats")}
              </p>
            )}
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

interface InputFieldProps {
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  name: string;
  error?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  type = "text",
  required,
  value,
  onChange,
  name,
  error,
}) => (
  <div className="mb-4">
    <label
      htmlFor={name}
      className={`block text-sm font-medium text-black ${required ? 'requireField' : ''}`}
    >
      {label}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`mt-1 block w-full px-3 py-2 bg-white text-black border rounded-md focus:outline-none focus:primaryBorder sm:text-sm ${error ? "border-red-500" : "border-gray-300"}`}
    />
    {error && (
      <p className="text-red-500 text-sm mt-1">{error}</p>
    )}
  </div>
);

interface Step2FormProps {
  customFields: CustomFormField[];
  instructorType: string | undefined;
  isValidate?: boolean;
  setIsStep2FormValid?: (isValid: boolean) => void;
}

export default function Step2Form({
  customFields,
  instructorType,
  isValidate,
  setIsStep2FormValid,
}: Step2FormProps) {

  const dispatch = useDispatch();

  // Get data from Redux store
  const becomeInstructorData = useSelector(becomeInstructorDataSelector);

  // Form errors state
  const [errors, setErrors] = useState<FormErrors>({});

  const { t } = useTranslation();
  // Validate form using Zod
  const validateForm = () => {
    try {
      // Prepare data for validation
      const validationData = {
        ...becomeInstructorData,
      };

      // Use appropriate schema based on instructor type
      const schema = instructorType === 'team' ? teamInstructorSchema : becomeInstructorSchema;

      // Validate form data with Zod schema
      schema.parse(validationData);

      // Clear all errors if validation passes
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Convert Zod errors to our error format
        const newErrors: FormErrors = {};
        error.errors.forEach((err) => {
          if (err.path && err.path.length > 0) {
            const fieldName = err.path[0] as keyof FormErrors;
            // Use the custom error message from Zod schema
            newErrors[fieldName] = err.message;
          }
        });

        setErrors(newErrors);
        toast.error(t("please_fix_the_validation_errors_before_continuing"));
      }
      return false;
    }
  };

  // Handle custom fields input change - Update Redux store
  const handleCustomFieldChange = (
    fieldId: number,
    value: string | File | null
  ) => {
    dispatch(setCustomFieldData({ fieldId, value }));
  };

  // Handle custom file upload - Update Redux store
  const handleCustomFileUpload = (fieldId: number, file: File | null) => {
    // Check file size if it's a video file (10MB limit)
    if (file && file.type?.includes('video') && file.size > 10 * 1024 * 1024) {
      toast.error("Video file exceeds the maximum size of 10MB");
      return;
    }

    // Update Redux store with custom field data
    handleCustomFieldChange(fieldId, file);
  };

  // Render custom form field based on type
  const renderCustomField = (field: CustomFormField) => {
    switch (field.type) {
      case 'text':
        // Check if field name suggests it should be a file upload
        if (field?.name?.toLowerCase()?.includes('photo') ||
          field?.name?.toLowerCase()?.includes('image') ||
          field?.name?.toLowerCase()?.includes('picture') ||
          field?.name?.toLowerCase()?.includes('video') ||
          field?.name?.toLowerCase()?.includes('document') ||
          field?.name?.toLowerCase()?.includes('file')) {
          // Render as file upload if the name suggests a file
          return (
            <FileUpload
              key={field?.id || Math.random()}
              label={field?.name || ''}
              required={field?.is_required === 1}
              description={`Upload your ${field?.name || ''}`}
              currentFile={becomeInstructorData?.customFieldsData?.[field?.id || 0] as File | null}
              onFileSelected={(file) => handleCustomFileUpload(field?.id || 0, file)}
            />
          );
        } else {
          // Render as text input
          return (
            <InputField
              key={field?.id || Math.random()}
              label={field?.name || ''}
              name={`custom-${field?.id || ''}`}
              placeholder={`Enter your ${field?.name || ''}`}
              required={field?.is_required === 1}
              value={becomeInstructorData?.customFieldsData?.[field?.id || 0] as string || ''}
              onChange={(e) => handleCustomFieldChange(field?.id || 0, e.target.value)}
            />
          );
        }

      case 'textarea':
        // Render as textarea for longer text input
        return (
          <div className="mb-4" key={field?.id || Math.random()}>
            <label
              htmlFor={`custom-textarea-${field?.id || ''}`}
              className={`block text-sm font-medium text-black mb-2 ${field?.is_required === 1 && 'requireField'}`}
            >
              {field?.name || ''}
            </label>
            <textarea
              id={`custom-textarea-${field?.id || ''}`}
              name={`custom-textarea-${field?.id || ''}`}
              value={becomeInstructorData?.customFieldsData?.[field?.id || 0] as string || ''}
              onChange={(e) => handleCustomFieldChange(field?.id || 0, e.target.value)}
              placeholder={`Enter your ${field?.name || ''}`}
              required={field?.is_required === 1}
              rows={4}
              className="mt-1 block w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-md focus:outline-none focus:primaryBorder sm:text-sm"
            />
          </div>
        );

      case 'number':
        // Render as number input
        return (
          <InputField
            key={field?.id || Math.random()}
            label={field?.name || ''}
            name={`custom-${field?.id || ''}`}
            placeholder={`Enter your ${field?.name || ''}`}
            type="number"
            required={field?.is_required === 1}
            value={becomeInstructorData?.customFieldsData?.[field?.id || 0] as string || ''}
            onChange={(e) => handleCustomFieldChange(field?.id || 0, e.target.value)}
          />
        );

      case 'email':
        // Render as email input
        return (
          <InputField
            key={field?.id || Math.random()}
            label={field?.name || ''}
            name={`custom-${field?.id || ''}`}
            placeholder={`Enter your ${field?.name || ''}`}
            type="email"
            required={field?.is_required === 1}
            value={becomeInstructorData?.customFieldsData?.[field?.id || 0] as string || ''}
            onChange={(e) => handleCustomFieldChange(field?.id || 0, e.target.value)}
          />
        );

      case 'date':
        // Render as date input
        return (
          <InputField
            key={field?.id || Math.random()}
            label={field?.name || ''}
            name={`custom-${field?.id || ''}`}
            placeholder={`Select your ${field?.name || ''}`}
            type="date"
            required={field?.is_required === 1}
            value={becomeInstructorData?.customFieldsData?.[field?.id || 0] as string || ''}
            onChange={(e) => handleCustomFieldChange(field?.id || 0, e.target.value)}
          />
        );

      case 'radio':
        // Render as radio button group
        return (
          <div className="mb-4" key={field?.id || Math.random()}>
            <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${field?.is_required === 1 && 'requireField'}`}>
              {field?.name || ''}
            </label>
            <div className="flex space-x-4 max-[374px]:flex-col max-[374px]:gap-2">
              {field.options && field.options.map((option) => (
                <label key={option.id} className="inline-flex items-center">
                  <input
                    type="radio"
                    name={`custom-radio-${field?.id || ''}`}
                    value={option.option}
                    checked={becomeInstructorData?.customFieldsData?.[field?.id || 0] === option.option}
                    onChange={() => handleCustomFieldChange(field?.id || 0, option.option)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    required={field?.is_required === 1}
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {option.option}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'dropdown':
      case 'select':
        // Render as dropdown/select element
        return (
          <div className="mb-4" key={field?.id || Math.random()}>
            <label
              htmlFor={`custom-select-${field?.id || ''}`}
              className={`block text-sm font-medium text-black mb-2 ${field?.is_required === 1 && 'requireField'}`}
            >
              {field?.name || ''}
            </label>
            <select
              id={`custom-select-${field?.id || ''}`}
              name={`custom-select-${field?.id || ''}`}
              value={becomeInstructorData?.customFieldsData?.[field?.id || 0] as string || ''}
              onChange={(e) => handleCustomFieldChange(field?.id || 0, e.target.value)}
              required={field?.is_required === 1}
              className="mt-1 block w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-md focus:outline-none focus:primaryBorder sm:text-sm"
            >
              <option value="">Select {field?.name || 'an option'}</option>
              {field.options && field.options.map((option) => (
                <option key={option.id} value={option.option}>
                  {option.option}
                </option>
              ))}
            </select>
          </div>
        );

      case 'checkbox':
        // Render as checkbox group (supports multiple selections)
        // Store multiple checkbox values as comma-separated string
        const checkboxValue = becomeInstructorData?.customFieldsData?.[field?.id || 0] as string || '';
        // Parse comma-separated string to array for checking selected state
        const selectedCheckboxes = checkboxValue
          ? checkboxValue.split(',').map(val => val.trim()).filter(val => val !== '')
          : [];

        const handleCheckboxChange = (optionValue: string, isChecked: boolean) => {
          let newValue: string;
          if (isChecked) {
            // Add the option to selected values
            newValue = checkboxValue
              ? `${checkboxValue},${optionValue}`
              : optionValue;
          } else {
            // Remove the option from selected values
            newValue = selectedCheckboxes
              .filter((val) => val !== optionValue)
              .join(',');
          }
          handleCustomFieldChange(field?.id || 0, newValue);
        };

        return (
          <div className="mb-4" key={field?.id || Math.random()}>
            <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${field?.is_required === 1 && 'requireField'}`}>
              {field?.name || ''}
            </label>
            <div className="flex flex-col space-y-2">
              {field.options && field.options.map((option) => (
                <label key={option.id} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name={`custom-checkbox-${field?.id || ''}-${option.id}`}
                    value={option.option}
                    checked={selectedCheckboxes.includes(option.option)}
                    onChange={(e) => handleCheckboxChange(option.option, e.target.checked)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 rounded"
                    required={field?.is_required === 1 && selectedCheckboxes.length === 0}
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {option.option}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'file':
        // Render as explicit file upload field
        return (
          <FileUpload
            key={field?.id || Math.random()}
            label={field?.name || ''}
            required={field?.is_required === 1}
            description={`Upload your ${field?.name || ''}`}
            currentFile={becomeInstructorData?.customFieldsData?.[field?.id || 0] as File | null}
            onFileSelected={(file) => handleCustomFileUpload(field?.id || 0, file)}
          />
        );

      default:
        // Fallback: render as text input for unknown types
        return (
          <InputField
            key={field?.id || Math.random()}
            label={field?.name || ''}
            name={`custom-${field?.id || ''}`}
            placeholder={`Enter your ${field?.name || ''}`}
            required={field?.is_required === 1}
            value={becomeInstructorData?.customFieldsData?.[field?.id || 0] as string || ''}
            onChange={(e) => handleCustomFieldChange(field?.id || 0, e.target.value)}
          />
        );
    }
  };

  // new code from here
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    dispatch(setBecomeInstructorData({ [name]: value }));

    // Clear error for this field when user types
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleAboutMeChange = (content: string) => {
    dispatch(setBecomeInstructorData({ aboutMe: content }));

    // Clear error when user types in About Me
    if (errors.aboutMe) {
      setErrors({ ...errors, aboutMe: "" });
    }
  };

  // Handle file uploads - Update Redux store with file data
  const handleIdProofUpload = (file: File | null) => {
    dispatch(setBecomeInstructorData({ idProof: file }));

    // Clear error when file is uploaded
    if (errors.idProof) {
      setErrors({ ...errors, idProof: "" });
    }
  };

  const handlePreviewVideoUpload = (file: File | null) => {
    dispatch(setBecomeInstructorData({ previewVideo: file }));

    // Clear error when file is uploaded
    if (errors.previewVideo) {
      setErrors({ ...errors, previewVideo: "" });
    }
  };

  const handleTeamLogoUpload = (file: File | null) => {
    dispatch(setBecomeInstructorData({ teamLogo: file }));

    // Clear error when file is uploaded
    if (errors.teamLogo) {
      setErrors({ ...errors, teamLogo: "" });
    }
  };

  const handleSocialsMediaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    dispatch(setSocialMedia({ key: name as keyof BecomeInstructorDataType['socialMedia'], value }));
  };

  useEffect(() => {
    if (isValidate) {
      const isValid = validateForm();
      setIsStep2FormValid?.(isValid);
    }
  }, [isValidate]);

  return (
    <div  >
      <div className="bg-white border border-gray-200 rounded-lg space-y-6">
        <div>
          <h3 className="text-lg sectionBg font-medium leading-6 text-gray-900 dark:text-white p-4">
            {t("personal_information")}
          </h3>
          <hr className="border-gray-300" />
          <div className="p-4">
            <InputField
              label={t("qualifications")}
              name="qualification"
              placeholder="e.g. Degree name"
              value={becomeInstructorData.qualification}
              onChange={handleInputChange}
              error={errors.qualification}
            />
            <InputField
              label={t("years_of_experience")}
              name="experience"
              placeholder="e.g. 3"
              type="number"
              value={becomeInstructorData.experience}
              onChange={handleInputChange}
              error={errors.experience}
            />
            <InputField
              label={t("skills")}
              name="skills"
              placeholder="e.g. JavaScript, React, Web Development"
              value={becomeInstructorData.skills}
              onChange={handleInputChange}
              error={errors.skills}
            />
            <InputField
              label={t("bank_name")}
              name="bankName"
              placeholder={t("enter_your_bank_name")}
              value={becomeInstructorData.bankName}
              required
              onChange={handleInputChange}
              error={errors.bankName}
            />
            <InputField
              label={t("bank_holder_name")}
              name="bankHolderName"
              placeholder={t("enter_your_bank_holder_name")}
              value={becomeInstructorData.bankHolderName}
              required
              onChange={handleInputChange}
              error={errors.bankHolderName}
            />
            <InputField
              label={t("bank_account_number")}
              name="bankAccNum"
              placeholder={t("enter_your_bank_account_number")}
              value={becomeInstructorData.bankAccNum}
              required
              onChange={handleInputChange}
              error={errors.bankAccNum}
            />
            <InputField
              label={t("bank_ifsc_code")}
              name="bankIfscCode"
              placeholder={t("enter_your_bank_ifsc_code")}
              value={becomeInstructorData.bankIfscCode}
              required
              onChange={handleInputChange}
              error={errors.bankIfscCode}
            />
            {/* ID Proof Upload */}
            <FileUpload
              label={t('id_proof')}
              required
              description={t("please_upload_a_valid_id_proof_document")}
              currentFile={becomeInstructorData.idProof}
              onFileSelected={handleIdProofUpload}
              error={errors.idProof}
            />

            {/* Preview Video Upload */}
            <FileUpload
              label={t("preview_video")}
              required
              description={t("upload_a_short_introduction_video_max_10mb")}
              currentFile={becomeInstructorData.previewVideo}
              onFileSelected={handlePreviewVideoUpload}
              error={errors.previewVideo}
            />
          </div>
        </div>

        {/* Team section (conditional) */}
        {instructorType === 'team' && (
          <div>
            <h3 className="text-lg sectionBg font-medium leading-6 text-gray-900 dark:text-white p-4">
              {t("team_information")}
            </h3>
            <hr className="border-gray-300" />
            <div className="p-4">
              <InputField
                label={t("team_name")}
                name="teamName"
                placeholder={t("enter_your_team_name")}
                required
                value={becomeInstructorData.teamName || ''}
                onChange={handleInputChange}
                error={errors.teamName}
              />
              {/* Team Logo Upload */}
              <FileUpload
                label={t("team_logo")}
                required
                description={t("upload_your_team_logo")}
                currentFile={becomeInstructorData.teamLogo}
                onFileSelected={handleTeamLogoUpload}
                error={errors.teamLogo}
              />
            </div>
          </div>
        )}

        {/* About Me Section */}
        <div>
          <h3 className="text-lg sectionBg font-medium leading-6 text-gray-900 dark:text-white p-4">
            {t("about_me")}
          </h3>
          <hr className="border-gray-300" />
          <div className="p-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 requireField">
              {t("tell_us_about_yourself")}
            </label>
            <div className="prose prose-sm max-w-none sectionBg">
              <ReactQuill className="text-black" value={becomeInstructorData.aboutMe} onChange={handleAboutMeChange} />
            </div>
            {errors.aboutMe && (
              <p className="text-red-500 text-sm mt-1">{errors.aboutMe}</p>
            )}
          </div>
        </div>

        {/* Social Media Links */}
        <div>
          <h3 className="text-lg sectionBg font-medium leading-6 text-gray-900 dark:text-white p-4">
            {t("social_media_links")}
          </h3>
          <hr className="border-gray-300" />
          <div className="p-4">
            <InputField
              label={t("facebook")}
              name="facebook"
              placeholder="https://facebook.com/username"
              value={becomeInstructorData?.socialMedia?.facebook}
              onChange={handleSocialsMediaChange}
            />
            <InputField
              label={t("linkedin")}
              name="linkedin"
              placeholder="https://linkedin.com/in/username"
              value={becomeInstructorData?.socialMedia?.linkedin}
              onChange={handleSocialsMediaChange}
            />
            <InputField
              label={t("twitter")}
              name="twitter"
              placeholder="https://twitter.com/username"
              value={becomeInstructorData?.socialMedia?.twitter}
              onChange={handleSocialsMediaChange}
            />
            <InputField
              label={t("instagram")}
              name="instagram"
              placeholder="https://instagram.com/username"
              value={becomeInstructorData?.socialMedia?.instagram}
              onChange={handleSocialsMediaChange}
            />
            <InputField
              label={t("youtube")}
              name="youtube"
              placeholder="https://youtube.com/channel/channelid"
              value={becomeInstructorData?.socialMedia?.youtube}
              onChange={handleSocialsMediaChange}
            />
          </div>
        </div>

        {/* Custom Fields */}
        {customFields && customFields.length > 0 && (
          <div>
            <h3 className="text-lg sectionBg font-medium leading-6 text-gray-900 dark:text-white p-4">
              {t("additional_information")}
            </h3>
            <hr className="border-gray-300" />
            <div className="p-4">
              {customFields.map((field) => renderCustomField(field))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
