// src/config/comp587-content.js

export const COMP587_CONTENT = {
  description: {
    title: "COMP 587: Software Verification and Validation",
    overview:
      "An in-depth study of verification and validation strategies and techniques as they apply to the development of quality software. Topics include test planning and management, testing tools, technical reviews, formal methods and the economics of software testing. The relationship of testing to other quality assurance activities as well as the integration of verification and validation into the overall software development process are also discussed.",
  },
  assignments: {
    title: "Assignments",
    items: [
      // Placeholder - user will add real content later
      {
        id: 1,
        title: "Assignment 1",
        description: "Coming soon...",
        status: "pending",
      },
    ],
  },
  projects: {
    title: "Projects",
    items: [
      // Placeholder - user will add real content later
      {
        id: 1,
        title: "Project 1",
        description: "Coming soon...",
        technologies: [],
      },
    ],
  },
};

// Theme configuration - Red/Pink theme matching sphere color
export const COMP587_THEME = {
  primaryColor: "#FB7185",
  backgroundColor: "rgba(45, 43, 58, 0.7)",
  textColor: "#ffffff",
  borderColor: "rgba(251, 113, 133, 0.2)",
  accentColor: "#FDA4AF",
  secondaryBackground: "#1A1820",
};

// Navigation items for the course page
export const COMP587_NAV_ITEMS = [
  { id: "description", label: "Course Description" },
  { id: "assignments", label: "Assignments" },
  { id: "projects", label: "Projects" },
];
