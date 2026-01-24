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
      {
        id: 1,
        title: "Assignment 1 - Random Number Generator",
        description:
          "Generates 25 random numbers (0-25) using list comprehension and finds the largest value.\n\nCode highlights:\n• `numbers = [random.randint(0, 25) for _ in range(25)]`\n• `max(numbers)`",
        technologies: ["Python", "Random module"],
      },
      {
        id: 2,
        title: "Assignment 2 - File I/O & Text Processing",
        description:
          "Creates a text file, reads it, and replaces all vowels with '7'.\n\nCode highlights:\n• Loop through `'aeiouAEIOU'`\n• Use `str.replace()` for vowel substitution",
        technologies: ["Python", "File I/O", "String manipulation"],
      },
      {
        id: 3,
        title: "Assignment 3 - Folder Monitoring Script",
        description:
          "Monitors a folder indefinitely with 1-second intervals. Detects new files using set difference between current and existing files. Reports file type (extension) and creation timestamp.\n\nCode highlights:\n• `new_files = current_files - existing_files`\n• `os.path.getctime()` for creation time",
        technologies: ["Python", "os module", "datetime", "time module"],
      },
      {
        id: 4,
        title: "Assignment 4 - Path Space Analyzer",
        description:
          "Reads folder paths from file, identifies paths with unwanted spaces. Fixes by removing spaces and reports which paths needed fixing.\n\nCode highlights:\n• `if ' ' in folder_path: fixed_path = folder_path.replace(' ', '')`",
        technologies: ["Python", "File I/O", "Path processing"],
      },
    ],
  },
  projects: {
    title: "Projects",
    items: [
      {
        id: 1,
        title: "Project 1 - Baselight/Xytech Import-Export Tool",
        description:
          "Multimedia pipeline automation for post-production facilities.\n\nFeatures:\n• Parses Baselight export files and Xytech work orders\n• Maps paths from local Baselight filesystem to facility storage (hpsans)\n• Handles 3rd party data errors (`<null>`, `<err>`)\n• Converts frame numbers to consolidated ranges (e.g., 31, 32, 33 → 31-33)\n• Exports formatted CSV with producer, operator, job info, and location/frame data\n\nCode highlights:\n• Path suffix matching for filesystem translation\n• Frame range consolidation algorithm\n• CSV writer with structured work order output",
        technologies: ["Python", "CSV", "File parsing", "Data transformation"],
        link: "https://github.com/captainPeanutbuttter495/COMP467",
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
