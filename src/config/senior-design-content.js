// src/config/senior-design-content.js

export const SENIOR_DESIGN_CONTENT = {
  description: {
    title: "Senior Design Project",
    overview:
      "Project-oriented course to allow students to apply their knowledge of software engineering to the design and implementation of a system to solve a real-world problem. Students select and specify a suitable problem, investigate design alternatives and select an appropriate one, implement a solution and verify and validate the result, all as part of a team effort. The role of digital computers in modern society are investigated, including the dangers of computer misuse, as well as the proper and intelligent use of computers. Ethical concerns of software professionals are studied. Topics include Agile software development process, software project management and risk management, verification and validation of software requirements, user documentation, effective communication through technical writing and oral presentation. Ethical concerns of software professionals and social issues are also discussed.",
  },
  assignments: {
    title: "Milestones",
    items: [
      // Placeholder - user will add real content later
      {
        id: 1,
        title: "Milestone 1",
        description: "Coming soon...",
        status: "pending",
      },
    ],
  },
  projects: {
    title: "Project",
    items: [
      // Placeholder - user will add real content later
      {
        id: 1,
        title: "Senior Design Project",
        description: "Coming soon...",
        technologies: [],
      },
    ],
  },
};

// Theme configuration - Gold/Yellow theme matching sphere color
export const SENIOR_DESIGN_THEME = {
  primaryColor: "#FBBF24",
  backgroundColor: "rgba(45, 43, 58, 0.7)",
  textColor: "#ffffff",
  borderColor: "rgba(251, 191, 36, 0.2)",
  accentColor: "#FCD34D",
  secondaryBackground: "#1A1820",
};

// Navigation items for the page
export const SENIOR_DESIGN_NAV_ITEMS = [
  { id: "description", label: "Overview" },
  { id: "assignments", label: "Milestones" },
  { id: "projects", label: "Project" },
];
