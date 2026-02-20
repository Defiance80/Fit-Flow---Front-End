"use client";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { lectureDataSelector, setLectureData } from "@/redux/instructorReducers/createCourseReducers/curriculamSlice";
import { useDispatch, useSelector } from "react-redux";
import { LectureTabDataType, ResourcesTabDataType } from "@/types/instructorTypes/instructorTypes";
import { instructorResourceTypes } from "@/utils/helpers";
import CustomImageTag from "@/components/commonComp/customImage/CustomImageTag";
import toast from "react-hot-toast";
import { useTranslation } from "@/hooks/useTranslation";

// Local schema mirrors ResourcesForm validation rules so both flows behave the same.
// This keeps modal inline checks in sync with the existing resources tab logic.
const resourceModalSchema = z.object({
  resource_type: z.string().min(1, "Please select a resource type"),
  resource_title: z.string().min(1, "Resource title is required").max(100, "Title must be less than 100 characters"),
  resource_url: z.string().optional(),
  resource_file: z.any().optional(),
}).refine((data) => {
  if (data.resource_type === "external_url" && (!data.resource_url || data.resource_url.trim() === "")) {
    return false;
  }
  return true;
}, {
  message: "Please provide a URL for External URL resources",
  path: ["resource_url"],
}).refine((data) => {
  if (data.resource_type !== "external_url" && !data.resource_file) {
    return false;
  }
  return true;
}, {
  message: "Please select a file for this resource",
  path: ["resource_file"],
});

interface FormErrors {
  resource_type?: string;
  resource_title?: string;
  resource_url?: string;
  resource_file?: string;
}

interface AddResourceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editResource: {
    isEditResource: boolean;
    resource: ResourcesTabDataType | null;
  };
}

export default function AddResourceModal({
  open,
  onOpenChange,
  editResource,
}: AddResourceModalProps) {

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const lectureData = useSelector(lectureDataSelector) as LectureTabDataType;

  const [resourceType, setResourceType] = useState("");
  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceUrl, setResourceUrl] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});

  // Clear only the targeted error so user feedback stays focused.
  const clearError = (field: keyof FormErrors) => {
    if (!errors[field]) {
      return;
    }
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  // Validate current modal inputs before dispatching them into Redux.
  // This prevents incomplete resources from being attached to lectures.
  const validateResource = () => {
    const existingFile = editResource.isEditResource ? editResource.resource?.resource_file : null;
    const validationPayload = {
      resource_type: resourceType,
      resource_title: resourceTitle,
      resource_url: resourceUrl,
      resource_file: resourceType === "external_url" ? null : (files[0] || existingFile || null),
    };

    const result = resourceModalSchema.safeParse(validationPayload);
    if (result.success) {
      setErrors({});
      return true;
    }

    const newErrors: FormErrors = {};
    result.error.errors.forEach((issue) => {
      const field = issue.path[0] as keyof FormErrors;
      newErrors[field] = issue.message;
    });
    setErrors(newErrors);
    toast.error("Please fix the validation errors before submitting");
    return false;
  };

  const handleAddResource = async () => {
    if (!validateResource()) {
      return;
    }
    try {

      // Create the resource object with serializable data
      const mappedResource = {
        resource_type: resourceType === "external_url" ? "url" : "file",
        resource_title: resourceTitle,
        resource_url: resourceType === "external_url" ? resourceUrl : undefined,
        resource_file: resourceType !== "external_url" ? files[0] || null : null,
      };

      dispatch(setLectureData({
        ...lectureData,
        resources: [...lectureData.resources, mappedResource]
      }));

      // Reset the form
      setResourceType("");
      setResourceTitle("");
      setResourceUrl("");
      setFiles([]);
      setErrors({});

      // Close the modal
      onOpenChange(false);
    } catch (error) {
      console.error("Error processing files:", error);
      toast.error("Error processing files. Please try again.");
    }
  };

  const handleEditResource = async () => {
    if (!validateResource()) {
      return;
    }
    try {

      // Create the resource object with serializable data
      const mappedResource = {
        resource_type: resourceType === "external_url" ? "url" : "file",
        resource_title: resourceTitle,
        resource_url: resourceType === "external_url" ? resourceUrl : undefined,
        resource_file: resourceType !== "external_url" ? files[0] || null : null,
        // Keep the original ID for editing
        id: editResource.resource?.id,
      };

      const updatedResources = lectureData.resources.map(resource => {
        return resource.id === editResource.resource?.id ? mappedResource : resource;
      });

      dispatch(setLectureData({
        ...lectureData,
        resources: updatedResources
      }));

      // Reset the form
      setResourceType("");
      setResourceTitle("");
      setResourceUrl("");
      setFiles([]);
      setErrors({});

      // Close the modal
      onOpenChange(false);
    } catch (error) {
      console.error("Error processing files:", error);
      alert("Error processing files. Please try again.");
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
    clearError("resource_file");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
      clearError("resource_file");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (editResource.isEditResource) {
      onOpenChange(true)
    }
    if (editResource.resource) {
      setResourceTitle(editResource.resource.resource_title)
      setResourceType(editResource.resource.resource_type)
      setResourceUrl(editResource.resource.resource_url || "")
    }

  }, [editResource]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white rounded-lg shadow-lg transition-all duration-300 ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {editResource.isEditResource ? t("edit_resource") : t("add_resource")}
          </DialogTitle>
          <DialogClose />
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Resource Type */}
          <div className="space-y-2">
            <Label htmlFor="resourceType">
              {t("resource_type")}<span className="text-red-500">*</span>
            </Label>
            <Select value={resourceType} onValueChange={(value) => {
              setResourceType(value);
              clearError("resource_type");
            }}>
              <SelectTrigger className={`sectionBg ${errors.resource_type ? "border-red-500" : ""}`}>
                <SelectValue placeholder={t("select_type")} />
              </SelectTrigger>
              <SelectContent>
                {instructorResourceTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.resource_type && (
              <p className="text-red-500 text-sm">{errors.resource_type}</p>
            )}
          </div>

          {/* Resource Title */}
          <div className="space-y-2">
            <Label htmlFor="resourceTitle">
              {t("resource_title")}<span className="text-red-500">*</span>
            </Label>
            <Input
              className={`sectionBg ${errors.resource_title ? "border-red-500" : ""}`}
              id="resourceTitle"
              placeholder={t("resource_text")}
              value={resourceTitle}
              onChange={(e) => {
                setResourceTitle(e.target.value);
                clearError("resource_title");
              }}
            />
            {errors.resource_title && (
              <p className="text-red-500 text-sm">{errors.resource_title}</p>
            )}
          </div>

          {/* Resource URL - Only show for external_url type */}
          {resourceType === "external_url" && (
            <div className="space-y-2">
              <Label htmlFor="resourceUrl">
                {t("resource_url")}<span className="text-red-500">*</span>
              </Label>
              <Input
                className={`sectionBg ${errors.resource_url ? "border-red-500" : ""}`}
                id="resourceUrl"
                placeholder="https://example.com/resource"
                value={resourceUrl}
                onChange={(e) => {
                  setResourceUrl(e.target.value);
                  clearError("resource_url");
                }}
              />
              {errors.resource_url && (
                <p className="text-red-500 text-sm">{errors.resource_url}</p>
              )}
            </div>
          )}

          {/* Resource Files - Show for image, audio, video, and document types */}
          {resourceType !== "external_url" && (
            <div className="space-y-2">
              <Label htmlFor="resourceFiles">
                {t("resource_files")}<span className="text-red-500">*</span>
              </Label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer ${errors.resource_file ? "border-red-500" : "border-gray-300"}`}
                onDrop={handleFileDrop}
                onDragOver={handleDragOver}
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                <input
                  id="fileInput"
                  type="file"
                  multiple
                  accept={
                    resourceType === "image" ? "image/*" :
                      resourceType === "audio" ? "audio/*" :
                        resourceType === "video" ? "video/*" :
                          resourceType === "document" ? ".pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .txt" :
                          ""
                  }
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <p className="text-gray-600">
                  {t("drag_and_drop_your")} {resourceType === "image" ? "image" : resourceType === "audio" ? "audio" : resourceType === "video" ? "video" : resourceType === "document" ? "document" : "file"} {t("here_or")}{" "}
                  <span className="text-blue-600 underline">{t("browse")}</span>
                </p>
              </div>

              {/* Display selected files */}
              {files.length > 0 && !editResource.isEditResource && (
                <div className="mt-2">
                  <p className="text-sm font-medium mb-2">{t("selected_files")}:</p>
                  <div className="space-y-1">
                    {files.map((file, index) => (
                      <div key={index} className="text-sm text-gray-600 bg-gray-100 p-2 rounded">
                        {file.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {
                editResource.isEditResource && (
                  resourceType === "image" ?(
                  <div className="mt-2">
                    <div className="text-sm text-gray-600 bg-gray-100 p-2 rounded">
                     <CustomImageTag src={editResource.resource?.resource_file as string} alt={resourceTitle} />
                    </div>
                  </div>
                ) : resourceType === "audio" ? (
                  <div className="mt-2">
                    <div className="text-sm text-gray-600 bg-gray-100 p-2 rounded">
                     <audio src={editResource.resource?.resource_file as string} controls />
                    </div>
                  </div>
                ) : resourceType === "video" ? (
                  <div className="mt-2">
                    <div className="text-sm text-gray-600 bg-gray-100 p-2 rounded">
                      <video src={editResource.resource?.resource_file as string} controls />
                    </div>
                  </div>
                ) : (
                  <div className="mt-2">
                    <div className="text-sm text-gray-600 bg-gray-100 p-2 rounded">
                      <a href={editResource.resource?.resource_file as string} download>{t("download")}</a>
                    </div>
                  </div>
                ))
              }
              {errors.resource_file && (
                <p className="text-red-500 text-sm mt-2">{errors.resource_file}</p>
              )}
            </div>
          )}

          <button
            onClick={editResource.isEditResource ? handleEditResource : handleAddResource}
            className="w-full mt-2 commonBtn"
          >
            {editResource.isEditResource ? t("update_resource") : t("add_resource")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
