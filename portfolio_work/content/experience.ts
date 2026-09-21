export type ArchiveCategory = "Experience" | "Certification" | "Achievement";
export type ArchiveEntry = {
  id: string;
  category: ArchiveCategory;
  title: string;
  organization: string;
  description: string;
  period?: string;
  // Only use a date supported by the record. Year-only values remain year-only.
  sortDate?: string;
  url?: string;
};

// Source: public/cv.pdf and existing education records in lib/data.ts.
// These are project contributions, not claims of employment. Certificate names,
// issuers, dates and personal awards must be supplied before publishing them.
export const archiveEntries: ArchiveEntry[] = [
  {
    id: "EDU-2023",
    category: "Achievement",
    title: "Began undergraduate studies in IT & Management",
    organization: "University of Moratuwa",
    period: "2023",
    sortDate: "2023",
    description: "Started the BSc (Hons) in Information Technology & Management at the University of Moratuwa. An academic milestone in my learning journey.",
  },
  {
    id: "EDU-2022",
    category: "Achievement",
    title: "Completed Advanced Level studies",
    organization: "J/Vembadi Girls’ High School · Jaffna",
    period: "2022",
    sortDate: "2022",
    description: "Completed GCE Advanced Level studies in the Physical Science stream, following the 2020–2022 study period.",
  },
  {
    id: "EXP-001",
    category: "Experience",
    title: "Evaluation & approval workflow contributor",
    organization: "Performance Management System · Project experience",
    description: "Built team management, evaluation, review, approval, rejection and status tracking. Connected the frontend workflow to Flask REST APIs and Supabase PostgreSQL.",
    url: "/projects/pms#contribution",
  },
  {
    id: "EXP-002",
    category: "Experience",
    title: "Authentication, editor & post management contributor",
    organization: "BlogApp · Project experience",
    description: "Developed secure login and session management, the live-preview Markdown editor, post CRUD operations, search and a personal profile dashboard.",
    url: "/projects/blogapp#contribution",
  },
  {
    id: "EXP-003",
    category: "Experience",
    title: "Operator interface & machine control contributor",
    organization: "CNC Paper Board Cutting Machine · Project experience",
    description: "Implemented the LCD interface and servo control, synchronised paper feeding with cutting, and designed machine components in Blender.",
    url: "/projects/cnc#contribution",
  },
  {
    id: "LRN-001",
    category: "Certification",
    title: "Software, web & database coursework",
    organization: "Certification & continuous learning · CV record",
    description: "My CV records completed certifications and online courses in software development, web technologies and database systems. Individual credentials are not listed here yet.",
  },
];
