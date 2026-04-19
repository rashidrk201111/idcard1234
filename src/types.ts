export type CardCategory = 'school' | 'college' | 'corporate';
export type CardOrientation = 'landscape' | 'portrait';

export interface FieldStyle {
  fontFamily: string;
  fontSize: number;
  color: string;
  fontWeight: string;
  gradient?: string;
}

export interface IDCardData {
  id: string;
  fullName: string;
  role: string;
  category: CardCategory;
  orientation?: CardOrientation;
  themeColor?: string;
  gradient?: string; // CSS gradient string
  department?: string;
  employeeId?: string;
  grade?: string;
  studentId?: string;
  rollNo?: string;
  branch?: string;
  idLabel?: string;
  bloodGroup?: string;
  address?: string;
  dob?: string;
  fathersName?: string;
  mothersName?: string;
  contactNo?: string;
  session?: string;
  institutionName?: string;
  institutionAddress?: string;
  institutionPhone?: string;
  showBarcode?: boolean;
  issueDate?: string;
  expiryDate?: string;
  photoUrl?: string;
  // Dynamic styles for fields
  nameStyle?: FieldStyle;
  roleStyle?: FieldStyle;
  idStyle?: FieldStyle;
  metaStyle?: FieldStyle;
  expiryStyle?: FieldStyle;
  extraStyle?: FieldStyle;
  labelStyle?: FieldStyle;
  headerLabelStyle?: FieldStyle;
  surfaceEffect?: 'standard' | 'matte' | 'glossy' | 'glass';
  layoutType?: 'modern' | 'classic';
}

export type AppSection = 'hub' | 'id-card' | 'passport-photo' | 'privacy' | 'terms';
