// src/config/comp484-content.js

export const COMP484_CONTENT = {
  description: {
    title: "COMP 484: Web Engineering",
    overview:
      "Internet infrastructure and the underlying networking technologies. Study of system and software architectures for web applications, e-business and e-commerce systems. Principles of website design. Advances in web-engineering technologies. Principles of web-based based transaction processing. XML and the associated technologies. Web service technology. Security and privacy issues. Study of the emerging Internet technologies.",
    objectives: [
      "Understand internet infrastructure and networking fundamentals",
      "Learn system and software architectures for web applications",
      "Master principles of modern website design",
      "Explore web-based transaction processing",
      "Work with XML and related technologies",
      "Understand web service technologies and APIs",
      "Address security and privacy considerations in web development",
    ],
  },
  assignments: {
    title: "Assignments",
    items: [
      {
        id: 1,
        title: "Lab 1: The $8 Webpage",
        description:
          "Built a 1990s-era website from scratch using only HTML and CSS (no frameworks, no JavaScript). Created an 8-cell image table navigation (lab1.html) where each image links to a different site. Built a styled secondary page (lab1A.html) with an external CSS stylesheet featuring a name/image header div with red borders, a 4-cell table layout containing a hierarchical hobbies list, a form submitting to a PHP endpoint, a CSS-only hover dropdown menu for network layers, and a Google search form using GET method.",
        status: "completed",
        link: "https://nirvanafan205.github.io/WebEng/",
      },
      {
        id: 2,
        title: "Assignment 2",
        description: "Coming soon...",
        status: "pending",
      },
    ],
  },
  projects: {
    title: "Projects",
    items: [
      {
        id: 1,
        title: "Counter App - Full Stack Web Application",
        description:
          "A cloud-native, full-stack web application demonstrating modern software development practices. Users can create accounts and maintain their own personal counter with secure authentication. Features include user registration, JWT-based session management, bcrypt password hashing, and a responsive UI. Deployed serverlessly on AWS with Lambda, DynamoDB, API Gateway, CloudFront, and S3. Built with Infrastructure as Code using AWS SAM and containerized local development with Docker Compose.",
        technologies: [
          "React 18",
          "Vite",
          "Tailwind CSS",
          "Node.js",
          "Express",
          "AWS Lambda",
          "DynamoDB",
          "API Gateway",
          "CloudFront",
          "S3",
          "JWT",
          "Docker",
          "AWS SAM",
        ],
        link: "https://comp484.click",
      },
    ],
  },
};

// Theme configuration for the course page
export const COMP484_THEME = {
  primaryColor: "#FFB7C5",
  backgroundColor: "rgba(45, 43, 58, 0.7)",
  textColor: "#ffffff",
  borderColor: "rgba(255, 183, 197, 0.2)",
  accentColor: "#FFD1DC",
  secondaryBackground: "#1A1820",
};

// Navigation items for the course page
export const COMP484_NAV_ITEMS = [
  { id: "description", label: "Course Description" },
  { id: "assignments", label: "Assignments" },
  { id: "projects", label: "Projects" },
];
