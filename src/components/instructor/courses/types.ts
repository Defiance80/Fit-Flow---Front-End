export interface CourseData {
  id: string;
  number: string;
  title: string;
  publishDate: string;
  status: string;
  thumbnail?: string;
  price: number;
  originalPrice?: number;
  description: string;
  instructor: { name: string; avatar?: string };
  level: string;
  duration: string;
  taught: string;
  access: string;
  certificate: string;
  analytics: {
    earnings: number;
    enrolledUsers: number;
    reviews: number;
    totalReviews: number;
    sales: number;
  };
}

export interface User {
  id: number;
  name: string;
  slug: string;
  email: string;
  mobile: string | null;
  country_code: string | null;
  email_verified_at: string | null;
  profile: string;
  is_active: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  is_instructor: boolean;
  instructor_process_status: 'pending' | 'approved' | 'rejected' | 'suspended'; // adjust if more statuses exist
  roles: Role[];
  instructor_details: InstructorDetails | null;
}

export interface Role {
  id: number;
  name: string;
  guard_name: string;
  custom_role: number;
  created_at: string;
  updated_at: string;
  pivot: Pivot;
}

export interface Pivot {
  model_type: string;
  model_id: number;
  role_id: number;
}

export interface InstructorDetails {
  id: number;
  user_id: number;
  type: 'individual' | 'team'; // adjust if other types exist
  status: 'pending' | 'approved' | 'rejected'; // adjust if needed
  reason: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
