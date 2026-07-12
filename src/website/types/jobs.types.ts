export interface Job {
  id: number;
  title: string;
  company: string;
  division: string;
  location: string;
  type: string;
  salary: string;
  experience: string;
  education: string;
  category: string;
  aboutPosition: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  skills: string[];
  deadline: string | null;
  postedAt: string;
  createdAt: string;
  is_active: boolean;
}

export interface JobFiltersPublic {
  location: string;
  division: string; // tetap ada di tipe, tapi tidak ditampilkan
  category: string;
  type: string;
}