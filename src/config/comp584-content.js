// src/config/comp584-content.js

export const COMP584_CONTENT = {
  description: {
    title: "COMP 584: Advanced Web Engineering",
    overview:
      "A study of the concepts, principles, techniques and methods of Web engineering. Topics include requirements engineering, modeling and architectures, design and technologies, testing, operation and maintenance, Web project management, application development process, usability, and performance and security of Web applications. Technologies, business models and strategies and societal issues of Web 2.0 and Semantic Web also are discussed.",
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

// Theme configuration - Purple theme matching sphere color
export const COMP584_THEME = {
  primaryColor: "#A78BFA",
  backgroundColor: "rgba(45, 43, 58, 0.7)",
  textColor: "#ffffff",
  borderColor: "rgba(167, 139, 250, 0.2)",
  accentColor: "#C4B5FD",
  secondaryBackground: "#1A1820",
};

// Navigation items for the course page
export const COMP584_NAV_ITEMS = [
  { id: "description", label: "Course Description" },
  { id: "assignments", label: "Assignments" },
  { id: "projects", label: "Projects" },
];
