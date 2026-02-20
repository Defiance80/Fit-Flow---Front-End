import { cn } from "@/lib/utils";
import { getCategories } from "@/utils/api/user/getCategories";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { LuMinus, LuPlus } from "react-icons/lu";



interface CategoryMinimal {
  id: number;
  slug: string;
  name?: string; 
  translated_name?: string; 
  all_items_count?: number;
  has_subcategory?: boolean;
  subcategories_count?: number;
}

interface CategoryNodeProps {
  category: CategoryMinimal;
  extraDetails?: Record<string, string | number | undefined>;
  onToggle?: (category: CategoryMinimal, checked: boolean) => void;
  checked?: boolean;
}

const PER_PAGE = 20;

const CategoryNode: React.FC<CategoryNodeProps> = ({
  category,
  extraDetails,
  onToggle,
  checked,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [expanded, setExpanded] = useState<boolean>(false);
  const [subcategories, setSubcategories] = useState<CategoryMinimal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const selectedSlug = searchParams.get("category") || "";
  // Apply rule: when no selected slug, nothing is selected
  const isSelected = checked ?? (selectedSlug ? category.slug === selectedSlug : false);

  const canExpand = (category.subcategories_count ?? 0) > 0 || category.has_subcategory === true;

  const displayName = category.translated_name || category.name || "";

  const handleFetchChildren = useCallback(async () => {
    if (isLoading || subcategories.length > 0) return;
    setIsLoading(true);
    try {
      const response = await getCategories({
        id: category.id,
        get_subcategory: 1,
        per_page: PER_PAGE,
        page: 1,
      });
      if (!response?.error) {
        const list = response?.data?.data?.[0]?.subcategories ?? [];
        setSubcategories(list);
      }
    } finally {
      setIsLoading(false);
    }
  }, [category.id, isLoading, subcategories.length]);

  const handleToggleExpand = useCallback(async () => {
    if (!expanded && subcategories.length === 0) {
      await handleFetchChildren();
    }
    setExpanded((prev) => !prev);
  }, [expanded, handleFetchChildren, subcategories.length]);

  // Auto-expand when a child equals the selected slug (after refresh)
  useEffect(() => {
    const maybeExpandForSelected = async () => {
      if (!selectedSlug || !canExpand) return;
      if (expanded && subcategories.length > 0) return; // already shown
      if (subcategories.length === 0) {
        await handleFetchChildren();
      }
      const found = subcategories.some((c) => c.slug === selectedSlug);
      if (found) setExpanded(true);
    };
    // Fire and forget
    void maybeExpandForSelected();
  }, [selectedSlug, canExpand, subcategories, expanded, handleFetchChildren]);

  // Navigate based on checkbox state: set category when checked, remove when unchecked
  const handleNavigate = useCallback((checked: boolean) => {
    const params = new URLSearchParams(searchParams);
    if (checked) {
      // When checking: set the category parameter
      params.set("category", category.slug);
    } else {
      // When unchecking: remove the category parameter
      params.delete("category");
    }
    // Remove extra details if they exist
    if (extraDetails) {
      Object.keys(extraDetails).forEach((key) => params.delete(key));
    }
    router.push(`${pathname}?${params.toString()}`);
  }, [category.slug, extraDetails, pathname, router, searchParams]);

  const handleCheckboxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const nextChecked = e.target.checked;
      if (onToggle) {
        onToggle(category, nextChecked);
      } else {  
        // Pass the checked state to handleNavigate
        handleNavigate(nextChecked);
      }
    },
    [category, handleNavigate, onToggle]
  );

  const inputId = `cate-${category.id}-${category.slug}`;

  return (
    <li>
      <div className="flex items-center rounded text-sm">
        <div className="flex-1 ltr:text-left rtl:text-right py-1 px-2 rounded-sm flex items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <input
              id={inputId}
              type="checkbox"
              checked={isSelected}
              onChange={handleCheckboxChange}
              className="form-checkbox h-4 w-4 text-indigo-600 accent-primaryBg"
              aria-label={`Select category ${displayName}`}
            />
            <label htmlFor={inputId} className={cn("break-all cursor-pointer text-md ", isSelected ? "" : "")}>{displayName}</label>
          </span>
          <span className="flex items-center gap-1">
            {typeof category.all_items_count === "number" && (
              <span>({category.all_items_count})</span>
            )}
            {canExpand && (
              <button
                type="button"
                className="text-sm p-1 hover:bg-muted rounded-sm"
                onClick={handleToggleExpand}
                aria-label={expanded ? `Collapse ${displayName}` : `Expand ${displayName}`}
                onMouseDown={(e) => e.preventDefault()}
              >
                {expanded ? <LuMinus size={14} /> : <LuPlus size={14} />}
              </button>
            )}
          </span>
        </div>
      </div>

      {expanded && subcategories.length > 0 && (
        <ul className="list-none ltr:ml-3 rtl:mr-3 ltr:border-l rtl:border-r ltr:pl-2 rtl:pr-2 space-y-1">
          {subcategories.map((sub) => (
            <CategoryNode key={sub.id} category={sub} extraDetails={extraDetails} onToggle={onToggle} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default CategoryNode;


