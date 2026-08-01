export interface University {
  id: string;
  name: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface Program {
  id: string;
  name: string;
}
  
export interface Student {
  id: string;
  email: string;
  fullName: string;
}

export interface TeamMember {
  userId: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string | null;
  roleName: string;
  scopeName: string;
  scopeType: 'UNIVERSITY' | 'DEPARTMENT' | 'PROGRAM' | 'SESSION';
}