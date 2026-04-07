// src/config/comp467-content.js

export const COMP467_CONTENT = {
  description: {
    title: "COMP 467: Multimedia System Design",
    overview:
      "Study of fundamentals of multimedia storage, processing, communication, presentation and display by digital means with emphasis on audio, still images and video media. Includes sampling theory, compression techniques and synchronization. Discussion of hypermedia and methodology issues. Multimedia programming; software tools for authoring multimedia applications and interfaces.",
    objectives: [
      "Understand fundamentals of multimedia storage, processing, and communication",
      "Apply sampling theory and compression techniques to digital media",
      "Work with audio, still image, and video media formats",
      "Implement synchronization across multimedia streams",
      "Explore hypermedia concepts and methodology issues",
      "Develop multimedia applications using software authoring tools",
    ],
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
      {
        id: 5,
        title: "Assignment 5 - MongoDB Tutorial",
        description:
          "Walks through the core MongoDB CRUD workflow in Python: connects to a local instance, creates a database and collection, inserts a document, and verifies it.\n\nCode highlights:\n• `MongoClient('mongodb://localhost:27017/')`\n• `collection.insert_one({...})`\n• `client.list_database_names()`",
        technologies: ["Python", "MongoDB", "PyMongo"],
      },
      {
        id: 6,
        title: "Assignment 6 - Argparse File Reader",
        description:
          "Reads a text file via a CLI argument and reports its line count. Supports a --verbose flag to print every line.\n\nCode highlights:\n• `argparse.ArgumentParser()` with positional + optional args\n• `args.verbose` conditional output",
        technologies: ["Python", "argparse", "File I/O"],
      },
      {
        id: 7,
        title: "Assignment 8 - Frame-to-Timecode Converter",
        description:
          "Converts raw frame numbers to HH:MM:SS:FF timecodes at 24 fps. Useful for post-production workflows where editors reference frames instead of wall-clock time.\n\nCode highlights:\n• Integer division / modulo chain: `hours → minutes → seconds → frames`\n• `f\"{hours:02d}:{minutes:02d}:{seconds:02d}:{frames:02d}\"`",
        technologies: ["Python", "Timecode math"],
      },
      {
        id: 8,
        title: "Assignment 9 - FFmpeg Video Commands",
        description:
          "Imports a video file and runs two ffmpeg/ffprobe operations: (1) ffprobe extracts metadata (codec, resolution, frame rate, duration) as JSON, and (2) ffmpeg extracts a single frame at a given timestamp and saves it as a JPEG.\n\nCode highlights:\n• `subprocess.run([\"ffprobe\", \"-print_format\", \"json\", ...])`\n• `subprocess.run([\"ffmpeg\", \"-ss\", timestamp, \"-frames:v\", \"1\", ...])`",
        technologies: ["Python", "FFmpeg", "ffprobe", "subprocess", "static_ffmpeg"],
      },
      {
        id: 9,
        title: "Assignment 10 - Subprocess Largest-File Finder",
        description:
          "Runs `ls -l` on a directory via subprocess + shlex, parses the output line-by-line, and reports the largest file by size.\n\nCode highlights:\n• `subprocess.Popen(shlex.split(command), stdout=subprocess.PIPE)`\n• Streaming line-by-line parse to find max file size",
        technologies: ["Python", "subprocess", "shlex", "argparse"],
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
      {
        id: 2,
        title: "Project 2 - Database-Driven Pipeline Processor",
        description:
          "Extends Project 1 by persisting all data in MongoDB and adding Flame support.\n\nFeatures:\n• Auto-discovers and organizes import files by date across 5 runs\n• Parses both Baselight and Flame export formats\n• Stores work orders, work entries, and user records in MongoDB\n• Generates CSV reports from database queries\n• Runs analytical queries (work after a date on Flame, work on specific storage paths, all Flame users, users on hpsans15)\n• CLI via argparse with --files and --verbose flags\n\nCode highlights:\n• `discover_files()` scans a directory and buckets files by date/type\n• `map_path()` handles both Baselight and Flame path formats\n• MongoDB queries with `$gt`, `$regex`, and `distinct`",
        technologies: ["Python", "MongoDB", "PyMongo", "CSV", "argparse", "File parsing"],
      },
      {
        id: 3,
        title: "Project 3 - Crucible: Video Processing & Frame.io Pipeline",
        description:
          "Extends Project 2 by adding video processing, thumbnail generation, timecode conversion, and Frame.io upload.\n\nFeatures:\n• Reads frame ranges from MongoDB and converts them to HH:MM:SS:FF timecodes\n• Extracts the middle frame of each range as a thumbnail using MoviePy\n• Resizes thumbnails with Pillow and saves as temporary JPEGs\n• Exports results to CSV or XLSX (with embedded thumbnail images via XlsxWriter)\n• Uploads all generated thumbnails to Frame.io via their API\n• CLI with --process (video path) and --output (csv/xlsx) flags\n\nCode highlights:\n• `frames_to_timecode()` converts frame numbers at detected fps\n• `video.get_frame(middle_frame / frame_rate)` for thumbnail extraction\n• `xlsxwriter.insert_image()` embeds thumbnails into spreadsheet cells\n• `FrameioClient.assets.upload()` for cloud delivery",
        technologies: [
          "Python",
          "MongoDB",
          "PyMongo",
          "MoviePy",
          "Pillow",
          "XlsxWriter",
          "Frame.io API",
          "FFmpeg",
          "CSV",
          "argparse",
        ],
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
