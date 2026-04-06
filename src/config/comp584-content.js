// src/config/comp584-content.js

export const COMP584_CONTENT = {
  description: {
    title: "COMP 584: Advanced Web Engineering",
    overview:
      "A study of the concepts, principles, techniques and methods of Web engineering. Topics include requirements engineering, modeling and architectures, design and technologies, testing, operation and maintenance, Web project management, application development process, usability, and performance and security of Web applications. Technologies, business models and strategies and societal issues of Web 2.0 and Semantic Web also are discussed.",
    objectives: [
      "Apply web engineering principles to design and develop web applications",
      "Understand requirements engineering for web-based systems",
      "Evaluate web application architectures and design patterns",
      "Implement testing strategies for web applications",
      "Manage web projects through the application development lifecycle",
      "Assess usability, performance, and security of web applications",
      "Explore Web 2.0 and Semantic Web technologies and their societal impact",
    ],
  },
  assignments: {
    title: "Assignments",
    items: [
      {
        id: 1,
        title: "Assignment 1: Email Campaign",
        description:
          "A single-page fan site built as an email-campaign landing page for something I'm passionate about — the New Orleans hip-hop duo $uicideboy$. The page features a glitch-styled hero, an About section, a discography, and an embedded live-video gallery, all wrapped in a gritty grain/scanline visual treatment.\n\n" +
          "Tech stack: React 19, Vite 7, Tailwind CSS 4, ESLint, and gh-pages for deployment to GitHub Pages.",
        status: "completed",
        link: "https://captainpeanutbuttter495.github.io/Email-Campaign/",
      },
      {
        id: 2,
        title: "Assignment 2: Project API",
        description:
          "An astronomy viewer that consumes NASA's Astronomy Picture of the Day (APOD) API. The app displays today's APOD in a cinematic hero section, a spotlight with the full explanation, a horizontally scrollable week strip of recent entries, and a mission-log detail panel. Users can browse the last 7 days or pull up a random APOD. Styled with a retro space-terminal aesthetic using animated starfields, scanlines, and telemetry-chip UI elements.\n\n" +
          "Tech stack: React 18, Vite 5, Tailwind CSS 3, Framer Motion, PostCSS, Autoprefixer, and the NASA APOD REST API.",
        status: "completed",
        link: "https://captainpeanutbuttter495.github.io/NASA-API-space-images/",
      },
    ],
  },
  projects: {
    title: "Projects",
    items: [
      {
        id: 1,
        title: "Melomix — Music Discovery & Playback Web App",
        introduction:
          "Melomix is built with React (v18) using Vite as the build tool. React is a declarative, " +
          "component-based JavaScript library that uses a virtual DOM and one-way data flow to build " +
          "interactive UIs out of reusable components written in JSX.\n\n" +
          "Full technology stack: React 18, Vite, React Router DOM, Tailwind CSS, Bootstrap / React-Bootstrap, " +
          "FontAwesome, React Spotify Web Playback, TanStack React Query, Axios, EmailJS, Node.js, Express, " +
          "MongoDB (Atlas) + Mongoose, bcryptjs, serverless-http, the Spotify Web API, the LRClib lyrics API, " +
          "and AWS (Lambda, API Gateway, S3, CloudFront, Route 53, ACM) deployed via AWS SAM.",
        motivation:
          "React was chosen because its component model lets the music-search, player, lyrics overlay, and " +
          "settings panels be built as independent, reusable pieces; the virtual DOM keeps the UI responsive " +
          "as search results and playback state update; its hooks + Context API provide lightweight global " +
          "auth state (UserContext) without a heavier state library; and its ecosystem (React Router for SPA " +
          "routing, React Query for caching Spotify responses, Axios for HTTP) solves common web-app problems " +
          "out of the box. Pairing it with Vite gives instant HMR during development and tree-shaken production " +
          "bundles for fast loads on CloudFront.",
        design:
          "The app is a single-page application rooted in App.jsx and wrapped by BrowserRouter + UserProvider " +
          "in index.jsx. React Router DOM maps URLs to page components — LandingPage, Login, Registration, " +
          "Dashboard, and Settings — with Dashboard and Settings gated by UserContext. Each page is composed " +
          "from smaller feature components (SpotifyPlayer, ArtistCarousel, Lyrics, StarryNight, Footer).\n\n" +
          "Key flows:\n" +
          "- Auth: Registration/Login forms POST to an Express API; passwords are hashed with bcrypt and users " +
          "are stored in MongoDB Atlas. On success the user is written to UserContext so every component can " +
          "read auth state via useContext.\n" +
          "- Search & Playback: Dashboard useState hooks hold the query and selected track; results come from " +
          "the Spotify Web API (cached by React Query) and playback is handled by the react-spotify-web-playback " +
          "embed.\n" +
          "- Lyrics: Selecting a track calls a /scrape/:songName Express endpoint that proxies LRClib, and the " +
          "lyrics render in an overlay card.\n" +
          "- Deployment: The Vite build is served from S3 behind CloudFront at melomix.click, while the Express " +
          "API runs on AWS Lambda via serverless-http behind API Gateway — all provisioned with AWS SAM.",
        technologies: [
          "React 18",
          "Vite",
          "React Router DOM",
          "Tailwind CSS",
          "Bootstrap",
          "TanStack React Query",
          "Axios",
          "Node.js",
          "Express",
          "MongoDB Atlas",
          "Mongoose",
          "bcrypt",
          "Spotify Web API",
          "LRClib API",
          "AWS Lambda",
          "API Gateway",
          "S3",
          "CloudFront",
          "Route 53",
          "AWS SAM",
        ],
        link: "https://melomix.click",
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
