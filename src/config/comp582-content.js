// src/config/comp582-content.js

export const COMP582_CONTENT = {
  description: {
    title: "COMP 582: Software Requirements Analysis",
    overview:
      "An in-depth study of the early phases of the software development life cycle commonly called software requirements analysis and specification. Topics include the gathering of both functional and nonfunctional requirements, customer communication, requirements prototyping, requirements modeling, requirements validation, the documentation of requirements in terms of a formal software requirements specification, and the management of software requirements.",
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

// Theme configuration - Green theme matching sphere color
export const COMP582_THEME = {
  primaryColor: "#34D399",
  backgroundColor: "rgba(45, 43, 58, 0.7)",
  textColor: "#ffffff",
  borderColor: "rgba(52, 211, 153, 0.2)",
  accentColor: "#6EE7B7",
  secondaryBackground: "#1A1820",
};

// Navigation items for the course page
export const COMP582_NAV_ITEMS = [
  { id: "description", label: "Course Description" },
  { id: "assignments", label: "Assignments" },
  { id: "projects", label: "Projects" },
];
