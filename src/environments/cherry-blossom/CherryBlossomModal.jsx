// src/environments/cherry-blossom/CherryBlossomModal.jsx
import { useEffect, useState } from "react";

// Global state for modal (pub/sub pattern matching OceanSunset.jsx)
let modalListeners = [];
let currentModal = null;

export function openCherryModal(contentId) {
  currentModal = contentId;
  modalListeners.forEach((listener) => listener(contentId));
}

export function closeCherryModal() {
  currentModal = null;
  modalListeners.forEach((listener) => listener(null));
}

function subscribeToModal(listener) {
  modalListeners.push(listener);
  listener(currentModal);
  return () => {
    modalListeners = modalListeners.filter((l) => l !== listener);
  };
}

/**
 * Modal overlay component for displaying course content
 * Styled with lofi dark gradient backgrounds
 *
 * @param {Object} props
 * @param {Object} props.content - Content object with sections (description, assignments, projects)
 * @param {Object} props.theme - Theme colors
 */
export default function CherryBlossomModal({ content = {}, theme = {} }) {
  const [activePanel, setActivePanel] = useState(null);

  useEffect(() => {
    return subscribeToModal(setActivePanel);
  }, []);

  if (!activePanel) return null;

  const {
    primaryColor = "#FFB7C5",
    backgroundColor = "#2D2B3A",
    secondaryBackground = "#1A1820",
    accentColor = "#FFD1DC",
  } = theme;

  const panelContent = content[activePanel];
  if (!panelContent) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(26, 24, 32, 0.9)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        zIndex: 99999,
      }}
      onClick={closeCherryModal}
    >
      <div
        style={{
          background: `linear-gradient(135deg, ${backgroundColor} 0%, ${secondaryBackground} 100%)`,
          borderRadius: "20px",
          padding: "40px",
          maxWidth: "700px",
          width: "90%",
          maxHeight: "80vh",
          overflow: "auto",
          boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 60px ${primaryColor}20`,
          border: `1px solid ${primaryColor}30`,
          color: "#ffffff",
          fontFamily: "'Segoe UI', system-ui, sans-serif",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            borderBottom: `1px solid ${primaryColor}40`,
            paddingBottom: "16px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: "600",
              background: `linear-gradient(90deg, ${primaryColor}, ${accentColor})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {panelContent.title}
          </h2>
          <button
            type="button"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              border: "none",
              color: "#ffffff",
              fontSize: "24px",
              cursor: "pointer",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s ease",
            }}
            onClick={(e) => {
              e.stopPropagation();
              closeCherryModal();
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.background = `${primaryColor}40`)
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)")
            }
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ lineHeight: "1.7", fontSize: "16px" }}>
          {activePanel === "description" && (
            <DescriptionContent data={panelContent} theme={{ primaryColor, accentColor }} />
          )}
          {activePanel === "assignments" && (
            <AssignmentsContent data={panelContent} theme={{ primaryColor, accentColor }} />
          )}
          {activePanel === "projects" && (
            <ProjectsContent data={panelContent} theme={{ primaryColor, accentColor }} />
          )}
        </div>
      </div>
    </div>
  );
}

// Content section components
function DescriptionContent({ data, theme }) {
  return (
    <>
      {data.overview && (
        <p style={{ color: "#d0d8e0", marginBottom: "20px" }}>{data.overview}</p>
      )}
      {data.objectives && (
        <>
          <h3 style={{ color: theme.primaryColor, marginBottom: "12px" }}>
            Learning Objectives
          </h3>
          <ul style={{ color: "#d0d8e0", paddingLeft: "20px", margin: 0 }}>
            {data.objectives.map((obj, idx) => (
              <li key={idx} style={{ marginBottom: "8px" }}>
                {obj}
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}

function AssignmentsContent({ data, theme }) {
  const items = data.items || [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {items.length === 0 && (
        <p style={{ color: "#888", fontStyle: "italic" }}>No assignments yet.</p>
      )}
      {items.map((assignment) => (
        <div
          key={assignment.id}
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            padding: "16px",
            borderRadius: "12px",
            border: `1px solid ${theme.primaryColor}20`,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <h4 style={{ margin: 0, color: theme.accentColor }}>
              {assignment.title}
            </h4>
            <span
              style={{
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "500",
                background:
                  assignment.status === "completed"
                    ? "rgba(74, 222, 128, 0.2)"
                    : assignment.status === "in-progress"
                      ? "rgba(251, 191, 36, 0.2)"
                      : "rgba(156, 163, 175, 0.2)",
                color:
                  assignment.status === "completed"
                    ? "#4ade80"
                    : assignment.status === "in-progress"
                      ? "#fbbf24"
                      : "#9ca3af",
              }}
            >
              {assignment.status}
            </span>
          </div>
          <p style={{ color: "#d0d8e0", margin: 0, fontSize: "14px" }}>
            {assignment.description}
          </p>
        </div>
      ))}
    </div>
  );
}

function ProjectsContent({ data, theme }) {
  const items = data.items || [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {items.length === 0 && (
        <p style={{ color: "#888", fontStyle: "italic" }}>No projects yet.</p>
      )}
      {items.map((project) => (
        <div
          key={project.id}
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            padding: "20px",
            borderRadius: "12px",
            border: `1px solid ${theme.primaryColor}20`,
          }}
        >
          <h4 style={{ margin: "0 0 8px 0", color: theme.accentColor }}>
            {project.title}
          </h4>
          <p style={{ color: "#d0d8e0", marginBottom: "12px", fontSize: "14px" }}>
            {project.description}
          </p>
          {project.technologies && project.technologies.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: project.link ? "16px" : "0" }}>
              {project.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  style={{
                    background: `${theme.primaryColor}20`,
                    padding: "4px 12px",
                    borderRadius: "16px",
                    fontSize: "12px",
                    color: theme.primaryColor,
                    border: `1px solid ${theme.primaryColor}30`,
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                padding: "10px 20px",
                borderRadius: "8px",
                background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})`,
                color: "#1A1820",
                fontWeight: "600",
                fontSize: "14px",
                textDecoration: "none",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = `0 4px 12px ${theme.primaryColor}40`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              View Live Demo
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
