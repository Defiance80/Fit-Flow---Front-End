"use client";
import React, { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  BiPlus,
  BiEditAlt,
  BiSolidTrash,
  BiFile,
} from "react-icons/bi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaPaperclip } from "react-icons/fa6";
import { CurriculumTabDataType, LectureTabDataType, ResourcesTabDataType } from "@/types/instructorTypes/instructorTypes";
import AddResourceModal from "../modals/AddResourceModal";
import { useDispatch, useSelector } from "react-redux";
import { curriculamDataSelector, lectureDataSelector, setIsCurriculumCreated, setLectureData } from "@/redux/instructorReducers/createCourseReducers/curriculamSlice";
import { createCurriculumWithData, CurriculumCreationFormData } from "@/utils/api/instructor/createCourseApis/create-course/createCurriculum";
import { updateLectureWithData, LectureUpdateFormData } from "@/utils/api/instructor/editCourse/editLecture";
import toast from "react-hot-toast";
import { isEditCurriculumSelector, lectureTypeIdSelector, setIsEditCurriculum } from "@/redux/reducers/helpersReducer";
import { TabType } from "../ContentTabs";
import { useTranslation } from "@/hooks/useTranslation";
import FormSubmitLoader from "@/components/Loaders/FormSubmitLoader";

const hours = Array.from({ length: 10 }, (_, i) => ({
  value: i.toString(),
  label: i === 1 ? `${i} hour` : `${i} hours`,
}));

const minutes = Array.from({ length: 60 }, (_, i) => ({
  value: i.toString(),
  label: i === 1 ? `${i} minute` : `${i} minutes`,
}));

const seconds = Array.from({ length: 60 }, (_, i) => ({
  value: i.toString(),
  label: i === 1 ? `${i} second` : `${i} seconds`,
}));

// Define Zod schema for lecture form validation
// This schema validates all required fields and lecture type specific requirements
const lectureFormSchema = z.object({
  lectureTitle: z.string().min(1, "Lecture title is required").max(100, "Title must be less than 100 characters"),
  lectureDescription: z.string().optional(),
  lectureType: z.string().min(1, "Please select a lecture type"),
  lectureHours: z.string().optional(),
  lectureMinutes: z.string().optional(),
  lectureSeconds: z.string().optional(),
  lectureFreePreview: z.string().optional(),
  lectureFile: z.any().optional(),
  lectureUrl: z.string().optional(),
  lectureYoutubeUrl: z.string().optional(),
  resources: z.array(z.any()).optional(),
}).refine((data) => {
  // Validate lecture type specific requirements
  // Each lecture type has different required fields
  if (data.lectureType === "video" && !data.lectureFile) {
    return false;
  }
  if (data.lectureType === "youtube" && (!data.lectureYoutubeUrl || data.lectureYoutubeUrl.trim() === "")) {
    return false;
  }
  if (data.lectureType === "document" && !data.lectureFile) {
    return false;
  }
  return true;
}, {
  message: "Please provide the required content for the selected lecture type",
  path: ["lectureType"]
});

// Define a type for form errors
type FormErrors = Partial<Record<keyof LectureTabDataType, string>>;

// File input component for lecture form
const LectureFileInput: React.FC<{
  lectureType: string;
  selectedFile: File | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}> = ({ lectureType, selectedFile, handleFileChange, error }) => {
  // Dynamically set accepted file types
  const getAcceptType = () => {
    if (lectureType === "file") return "video/*";
    if (lectureType === "document") return ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt";
    return "";
  };
  const { t } = useTranslation();
  return (
    <div className="space-y-2">
      <Label htmlFor="lectureFileInput" className="text-sm font-medium">
        {t("upload_file")} <span className="text-red-500">*</span>
      </Label>
      <label htmlFor="lectureFileInput" className={`block bg-[#F8F8F9] rounded-[8px] p-6 text-center cursor-pointer hover:bg-gray-100 transition-colors ${error ? "border-red-500" : ""}`}>
        <input
          id="lectureFileInput"
          type="file"
          onChange={handleFileChange}
          className="hidden"
          accept={getAcceptType()}
        />
        <p className="text-gray-600">
          {selectedFile ? (
            <>
              {t("selected")}: {" "}
              <span className="text-[var(--primary-color)] font-medium">
                {selectedFile.name}
              </span>
            </>
          ) : (
            <>
              {t("drag_and_drop_your_file_here_or_click_to")} {" "}
              <span className="text-[var(--primary-color)]">{t("browse")}</span>.
            </>
          )}
        </p>
      </label>
      {selectedFile && (
        <p className="text-xs text-gray-500">
          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
        </p>
      )}
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};

export default function LectureForm({ setActiveTab }: { setActiveTab: (tab: TabType) => void }) {

  const dispatch = useDispatch();
  const lectureData = useSelector(lectureDataSelector) as LectureTabDataType;
  const curriculamData = useSelector(curriculamDataSelector) as CurriculumTabDataType;
  const { chapterId } = curriculamData;
  const lectureTypeId = useSelector(lectureTypeIdSelector);

  const isEditCurriculum = useSelector(isEditCurriculumSelector);
  const isLectureEdit = isEditCurriculum === 'lecture';

  const [addResourceModalOpen, setAddResourceModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form errors state
  const [errors, setErrors] = useState<FormErrors>({});
  const { t } = useTranslation();

  const [editResource, setEditResource] = useState({
    isEditResource: false,
    resource: null as ResourcesTabDataType | null,
  })

  // Validate form using Zod
  // This function validates the form data against the Zod schema and sets error states
  const validateForm = () => {
    try {
      // Validate form data with Zod schema
      lectureFormSchema.parse(lectureData);

      // Clear all errors if validation passes
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Convert Zod errors to our error format for display in UI
        const newErrors: FormErrors = {};
        error.errors.forEach((err) => {
          if (err.path) {
            const fieldName = err.path[0] as keyof FormErrors;
            newErrors[fieldName] = err.message;
          }
        });

        setErrors(newErrors);
        toast.error("Please fix the validation errors before submitting");
      }
      return false;
    }
  };

  // Handle file change and update lectureData
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    dispatch(setLectureData({ ...lectureData, lectureFile: file }));

    // Clear file-related errors when file is selected
    if (file && errors.lectureFile) {
      setErrors({ ...errors, lectureFile: "" });
    }
  };

  // Handle input change and clear errors
  // This function updates the form data and clears any existing errors for the field
  const handleInputChange = (field: keyof LectureTabDataType, value: string | number | File | null) => {
    dispatch(setLectureData({ ...lectureData, [field]: value }));

    // Clear error for this field when user types to provide immediate feedback
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const courseTypes = [
    { value: "file", label: "Video" },
    { value: "youtube_url", label: "Youtube" },
    { value: "document", label: "Document" }
  ];

  const handleDeleteResource = (title: string) => {
    dispatch(setLectureData({ ...lectureData, resources: lectureData.resources.filter((resource) => resource.resource_title !== title) }));
  };

  const submitLectureData = async () => {
    // Validate form using Zod
    if (!validateForm()) {
      return;
    }

    // Additional validation for required context
    if (!chapterId) {
      toast.error("Chapter ID is missing");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create curriculum data object
      const curriculumData: CurriculumCreationFormData = {
        chapter_id: chapterId,
        type: 'lecture',
        lecture_title: lectureData.lectureTitle,
        lecture_description: lectureData.lectureDescription || '',
        lecture_type: lectureData.lectureType === 'document' ? 'file' : lectureData.lectureType as 'youtube_url' | 'file',
        lecture_hours: lectureData.lectureHours || '0',
        lecture_minutes: lectureData.lectureMinutes || '0',
        lecture_seconds: lectureData.lectureSeconds || '0',
        lecture_free_preview: lectureData.lectureFreePreview || '0',
        lecture_file: lectureData.lectureFile instanceof File ? lectureData.lectureFile : undefined,
        lecture_youtube_url: lectureData.lectureYoutubeUrl || lectureData.lectureUrl || undefined,
        resource_status: lectureData.resources.length > 0 ? 1 : 0,
        // Required assignment fields (ignored for lecture type)
        assignment_title: '',
        assignment_points: 0,
        assignment_description: '',
        assignment_media: new File([], ''),
        assignment_allowed_file_types: [],
        resource_data: lectureData.resources.map((resource) => {
          // Create base resource object
          const baseResource = {
            id: resource.id || undefined,
            resource_type: resource.resource_type as "url" | "file",
            title: resource.resource_title,
          };

          // For URL resources, only include resource_url
          if (resource.resource_type === "url") {
            return {
              ...baseResource,
              resource_url: resource.resource_url || "",
            };
          }

          // For file resources, only include resource_file
          if (resource.resource_type === "file" || resource.resource_type === "document") {
            return {
              ...baseResource,
              resource_file: resource.resource_file instanceof File ? resource.resource_file : undefined,
            };
          }

          // Fallback - return base resource
          return baseResource;
        })
      };

      // Call the createCurriculum API (addingQuiz = false for lectures)
      const response = await createCurriculumWithData(curriculumData);

      if (response.success) {
        toast.success("Lecture created successfully!");
        dispatch(setIsCurriculumCreated(true));

        // Reset form data after successful submission
        dispatch(setLectureData({
          lectureTitle: "",
          lectureDescription: "",
          lectureHours: "",
          lectureMinutes: "",
          lectureSeconds: "",
          lectureFreePreview: "0",
          lectureType: "",
          lectureUrl: "",
          lectureFile: null,
          lectureYoutubeUrl: "",
          resources: []
        }));
        setActiveTab(null);
      } else {
        toast.error(response.error || "Failed to create lecture");
        console.error("Lecture creation failed:", response);
      }
    } catch (error) {
      console.error("Error creating lecture:", error);
      toast.error("An unexpected error occurred while creating the lecture");
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitEditLectureData = async () => {
    // Validate form using Zod
    if (!validateForm()) {
      return;
    }

    // Additional validation for required context
    if (!chapterId) {
      toast.error("Chapter ID is missing");
      return;
    }

    setIsSubmitting(true);

    try {

      // Create lecture update data object
      const lectureUpdateData: LectureUpdateFormData = {
        lecture_type_id: lectureTypeId!, // This should be the actual lecture type ID from the curriculum data
        chapter_id: chapterId,
        is_active: 1,
        type: 'lecture',
        lecture_title: lectureData.lectureTitle,
        lecture_description: lectureData.lectureDescription || '',
        lecture_type: lectureData.lectureType as 'youtube_url' | 'file',
        lecture_youtube_url: lectureData.lectureYoutubeUrl || lectureData.lectureUrl || undefined,
        lecture_hours: parseInt(lectureData.lectureHours || '0'),
        lecture_minutes: parseInt(lectureData.lectureMinutes || '0'),
        lecture_seconds: parseInt(lectureData.lectureSeconds || '0'),
        lecture_free_preview: lectureData.lectureFreePreview === '1' ? 1 : 0,
        resource_status: lectureData.resources.length > 0 ? 1 : 0,
        resource_data: lectureData.resources.map((resource) => {
          // Create base resource object
          const baseResource = {
            id: resource.id || undefined,
            resource_type: resource.resource_type as "url" | "file",
            resource_title: resource.resource_title,
          };

          // For URL resources, include resource_url
          if (resource.resource_type === "url") {
            return {
              ...baseResource,
              resource_url: resource.resource_url || "",
            };
          }

          // For file resources, include resource_file
          if (resource.resource_type === "file" || resource.resource_type === "document") {
            return {
              ...baseResource,
              resource_file: resource.resource_file instanceof File ? resource.resource_file : undefined,
            };
          }

          // Fallback - return base resource
          return baseResource;
        })
      };

      // Call the updateLecture API
      const response = await updateLectureWithData(lectureUpdateData);

      if (response.success) {
        toast.success("Lecture updated successfully!");
        dispatch(setIsCurriculumCreated(true));
        dispatch(setIsEditCurriculum(null));

        // Reset form data after successful submission
        dispatch(setLectureData({
          lectureTitle: "",
          lectureDescription: "",
          lectureHours: "",
          lectureMinutes: "",
          lectureSeconds: "",
          lectureFreePreview: "0",
          lectureType: "video",
          lectureUrl: "",
          lectureFile: null,
          lectureYoutubeUrl: "",
          resources: []
        }));
        setActiveTab(null);
      } else {
        toast.error(response.error || "Failed to update lecture");
        console.error("Lecture update failed:", response);
      }
    } catch (error) {
      console.error("Error updating lecture:", error);
      toast.error("An unexpected error occurred while updating the lecture");
    } finally {
      setIsSubmitting(false);
    }
  };

  const lectureFileSize = lectureData.lectureFile instanceof File ? (lectureData.lectureFile.size / (1024 * 1024)).toFixed(2) : 0;

  return (
    <div className="space-y-4">
      <h3 className="sm:text-lg font-semibold">{t("add_lecture")}</h3>
      <div className="space-y-2">
        <Label htmlFor="lectureTitle" className="text-sm font-medium">
          {t("lecture_title")} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="lectureTitle"
          placeholder={t("introduction_to_interaction_design")}
          value={lectureData.lectureTitle}
          className={errors.lectureTitle ? "border-red-500" : ""}
          onChange={(e) => handleInputChange("lectureTitle", e.target.value)}
        />
        <p className="text-xs text-gray-500">{t("max_100_characters")}</p>
        {errors.lectureTitle && (
          <p className="text-red-500 text-sm">{errors.lectureTitle}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="courseType" className="text-sm font-medium">
          {t("lecture_type")} <span className="text-red-500">*</span>
        </Label>
        <Select
          value={lectureData.lectureType}
          onValueChange={(value) => handleInputChange("lectureType", value)}
        >
          <SelectTrigger className={`w-full ${errors.lectureType ? "border-red-500" : ""}`}>
            <SelectValue placeholder={t("select_type")} />
          </SelectTrigger>
          <SelectContent>
            {courseTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.lectureType && (
          <p className="text-red-500 text-sm">{errors.lectureType}</p>
        )}
      </div>

      {/* Course duration in hours, minutes, seconds */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="hours" className="text-sm font-medium">
            {t("hours")} <span className="text-red-500">*</span>
          </Label>
          <Select value={lectureData.lectureHours} onValueChange={(value) => handleInputChange("lectureHours", value)}>
            <SelectTrigger className={`w-full ${errors.lectureHours ? "border-red-500" : ""}`}>
              <SelectValue placeholder={t("select_hours")} />
            </SelectTrigger>
            <SelectContent>
              {hours.map((hour) => (
                <SelectItem key={hour.value} value={hour.value}>
                  {hour.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="minutes" className="text-sm font-medium">
            {t("minutes")} <span className="text-red-500">*</span>
          </Label>
          <Select value={lectureData.lectureMinutes} onValueChange={(value) => handleInputChange("lectureMinutes", value)}>
            <SelectTrigger className={`w-full ${errors.lectureMinutes ? "border-red-500" : ""}`}>
              <SelectValue placeholder={t("select_minutes")} />
            </SelectTrigger>
            <SelectContent>
              {minutes.map((minute) => (
                <SelectItem key={minute.value} value={minute.value}>
                  {minute.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="seconds" className="text-sm font-medium">
            {t("seconds")} <span className="text-red-500">*</span>
          </Label>
          <Select value={lectureData.lectureSeconds} onValueChange={(value) => handleInputChange("lectureSeconds", value)}>
            <SelectTrigger className={`w-full ${errors.lectureSeconds ? "border-red-500" : ""}`}>
              <SelectValue placeholder={t("select_seconds")} />
            </SelectTrigger>
            <SelectContent>
              {seconds.map((second) => (
                <SelectItem key={second.value} value={second.value}>
                  {second.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Upload File for Video or Document */}
      {(lectureData.lectureType === "file" || lectureData.lectureType === "document") && (
        <LectureFileInput
          lectureType={lectureData.lectureType}
          selectedFile={lectureData.lectureFile as File | null}
          handleFileChange={handleFileChange}
          error={errors.lectureFile}
        />
      )}

      {/* Youtube URL input for Youtube type */}
      {lectureData.lectureType === "youtube_url" && (
        <div className="space-y-2">
          <Label htmlFor="youtubeUrl" className="text-sm font-medium">
            {t("youtube_url")} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="youtubeUrl"
            placeholder={t("youtube_url_placeholder")}
            value={lectureData.lectureYoutubeUrl}
            className={errors.lectureYoutubeUrl ? "border-red-500" : ""}
            onChange={(e) => handleInputChange("lectureYoutubeUrl", e.target.value)}
          />
          {errors.lectureYoutubeUrl && (
            <p className="text-red-500 text-sm">{errors.lectureYoutubeUrl}</p>
          )}
        </div>
      )}

      <div className="flex items-center gap-2">
        <Checkbox
          id="allowPreview"
          checked={lectureData.lectureFreePreview === "1"}
          onCheckedChange={(checked) => handleInputChange("lectureFreePreview", checked ? "1" : "0")}
        />
        <Label
          htmlFor="allowPreview"
          className="text-sm font-medium cursor-pointer"
        >
          {t("check_this_to_allow_students_to_preview_this_lecture")}
        </Label>
      </div>

      <div className="pt-3">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => setAddResourceModalOpen(true)}
        >
          <BiPlus className="h-4 w-4" /> {t("add_resources")}
        </Button>
        {/* Add Resource Modal */}
        <AddResourceModal
          open={addResourceModalOpen}
          onOpenChange={setAddResourceModalOpen}
          editResource={editResource}
        />
      </div>

      {/* Resources List */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">{t("resources")}</h3>

        {lectureData.resources.length > 0 ? (
          <div className="space-y-2">
            {lectureData.resources.map((resource, idx) => (
              <div
                key={resource.resource_title + idx}
                className="flex items-center justify-between p-3 border borderColor rounded-md"
              >
                <div className="flex items-center">
                  {/* Use resource_type for icon logic */}
                  {resource.resource_type === "document" ? (
                    <span className="h-7 w-7 primaryColor mr-2 flexCenter primaryLightBg text-xl rounded-[4px]">
                      <BiFile className="" />
                    </span>
                  ) : (
                    <span className="h-7 w-7 primaryColor mr-2 flexCenter primaryLightBg text-xl rounded-[4px]">
                      <FaPaperclip className="-rotate-45" />
                    </span>
                  )}
                  {/* Use resource_title for display */}
                  <span>{resource.resource_title}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditResource({ isEditResource: true, resource: resource })}>
                    <BiEditAlt className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleDeleteResource(resource.resource_title)}
                  >
                    <BiSolidTrash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">{t("no_resources_added_yet")}</p>
        )}
      </div>

      <div className="pt-4 border-t borderColor space-y-4">
        <Button
          onClick={() => isLectureEdit ? submitEditLectureData() : submitLectureData()}
          className="primaryBg hover:hoverBgColor"
          disabled={isSubmitting}
        >
          {isSubmitting ? `${isLectureEdit ? t("updating_lecture") : t("creating_lecture")}` : isLectureEdit ? t("update_lecture") : t("submit_lecture")}
          {
            isSubmitting && (
              <FormSubmitLoader />
            )
          }
        </Button>
        {
          Number(lectureFileSize) > 100 && isSubmitting && (
            <p className="text-sm text-red-500">
              {t("lecture_file_size_warning")}
            </p>
          )
        }
      </div>
    </div>
  );
}
