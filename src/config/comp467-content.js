// src/config/comp467-content.js

export const COMP467_CONTENT = {
  description: {
    title: "COMP 467: Multimedia System Design",
    overview:
      "Study of fundamentals of multimedia storage, processing, communication, presentation and display by digital means with emphasis on audio, still images and video media. Includes sampling theory, compression techniques and synchronization. Discussion of hypermedia and methodology issues. Multimedia programming; software tools for authoring multimedia applications and interfaces.",
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

// Theme configuration - Pink theme matching sphere color
export const COMP467_THEME = {
  primaryColor: "#F472B6",
  backgroundColor: "rgba(45, 43, 58, 0.7)",
  textColor: "#ffffff",
  borderColor: "rgba(244, 114, 182, 0.2)",
  accentColor: "#F9A8D4",
  secondaryBackground: "#1A1820",
};

// Navigation items for the course page
export const COMP467_NAV_ITEMS = [
  { id: "description", label: "Course Description" },
  { id: "assignments", label: "Assignments" },
  { id: "projects", label: "Projects" },
];
