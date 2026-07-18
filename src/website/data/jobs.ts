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

  // dipakai jobs.ts
  applicants?: number;
  featured?: boolean;
  description?: string;
  culture?: string;

  // dipakai backend
  category?: string;
  aboutPosition?: string;
  createdAt?: string;
  is_active?: boolean;

  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  skills: string[];

  deadline: string | null;
  postedAt: string;
}

export interface JobFiltersPublic {
  location: string;
  division: string;
  category: string;
  type: string;
}