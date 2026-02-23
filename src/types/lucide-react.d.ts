declare module 'lucide-react' {
  import { FC, SVGAttributes } from 'react';
  
  export interface LucideProps extends SVGAttributes<SVGElement> {
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
    absoluteStrokeWidth?: boolean;
    fill?: string;
  }

  export type LucideIcon = FC<LucideProps>;

  // Generic export for all icons
  const _default: Record<string, LucideIcon>;
  export default _default;

  // Named exports for all icons used in this project
  export const Activity: LucideIcon;
  export const AlignLeft: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const BarChart3: LucideIcon;
  export const Bell: LucideIcon;
  export const BookOpen: LucideIcon;
  export const Building2: LucideIcon;
  export const CalendarDays: LucideIcon;
  export const Check: LucideIcon;
  export const CheckCircle: LucideIcon;
  export const CheckIcon: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const ChevronDownIcon: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const ChevronLeftIcon: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const ChevronRightIcon: LucideIcon;
  export const ChevronUp: LucideIcon;
  export const Circle: LucideIcon;
  export const CircleIcon: LucideIcon;
  export const ClipboardList: LucideIcon;
  export const Clock: LucideIcon;
  export const Code: LucideIcon;
  export const CreditCard: LucideIcon;
  export const Dumbbell: LucideIcon;
  export const Eye: LucideIcon;
  export const EyeIcon: LucideIcon;
  export const EyeOff: LucideIcon;
  export const Globe: LucideIcon;
  export const Heart: LucideIcon;
  export const HeartPulse: LucideIcon;
  export const Hospital: LucideIcon;
  export const InfoIcon: LucideIcon;
  export const LayoutDashboard: LucideIcon;
  export const Leaf: LucideIcon;
  export const Link2: LucideIcon;
  export const Loader2: LucideIcon;
  export const LucideClipboardEdit: LucideIcon;
  export const LucidePlusCircle: LucideIcon;
  export const Mail: LucideIcon;
  export const MapPin: LucideIcon;
  export const Menu: LucideIcon;
  export const MessageSquare: LucideIcon;
  export const MoreHorizontalIcon: LucideIcon;
  export const Play: LucideIcon;
  export const Plus: LucideIcon;
  export const Rocket: LucideIcon;
  export const SearchIcon: LucideIcon;
  export const Settings: LucideIcon;
  export const Shield: LucideIcon;
  export const Smartphone: LucideIcon;
  export const Star: LucideIcon;
  export const Target: LucideIcon;
  export const TrendingUp: LucideIcon;
  export const Upload: LucideIcon;
  export const UserPlus: LucideIcon;
  export const Users: LucideIcon;
  export const UtensilsCrossed: LucideIcon;
  export const Watch: LucideIcon;
  export const X: LucideIcon;
  export const XCircle: LucideIcon;
  export const XIcon: LucideIcon;
  export const Zap: LucideIcon;
}
