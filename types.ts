
export enum CourseStatus {
  PUBLISHED = 'Publicado',
  DRAFT = 'Borrador',
  ARCHIVED = 'Archivado'
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  price: number | 'Gratis';
  students: number;
  status: CourseStatus;
  category: string;
  lessons: number;
  image: string;
  description: string;
}

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  instructor: string;
  originalPrice?: number;
}

export interface Coupon {
  id: string;
  code: string;
  type: string;
  value: string;
  courses: string;
  redemptions: string;
  validity: string;
  status: 'Activo' | 'Agotado' | 'Programado';
}
