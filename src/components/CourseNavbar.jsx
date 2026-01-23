// src/components/CourseNavbar.jsx
import { useState } from "react";

/**
 * Reusable navbar component for course pages
 * Features glassmorphism styling and props-based theming
 *
 * @param {Object} props
 * @param {Array} props.items - Array of { id, label } for nav items
 * @param {string} props.activeItem - Currently active item id
 * @param {Function} props.onItemSelect - Callback when item is selected
 * @param {Function} props.onBack - Callback for back button
 * @param {Object} props.theme - Theme colors { primaryColor, backgroundColor, textColor }
 */
export default function CourseNavbar({
  items = [],
  activeItem,
  onItemSelect,
  onBack,
  theme = {},
}) {
  const [hoveredItem, setHoveredItem] = useState(null);

  const {
    primaryColor = "#FFB7C5",
    backgroundColor = "rgba(45, 43, 58, 0.7)",
    textColor = "#ffffff",
    borderColor = "rgba(255, 183, 197, 0.2)",
  } = theme;

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 24px",
        background: backgroundColor,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: `1px solid ${borderColor}`,
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
          e.currentTarget.style.borderColor = primaryColor;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
        }}
        style={{
          padding: "10px 18px",
          borderRadius: "10px",
          background: "rgba(255, 255, 255, 0.08)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          color: textColor,
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "500",
          transition: "all 0.2s ease",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <span style={{ fontSize: "16px" }}>←</span>
        Back
      </button>

      {/* Nav items */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {items.map((item) => {
          const isActive = activeItem === item.id;
          const isHovered = hoveredItem === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onItemSelect(item.id)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                padding: "10px 20px",
                borderRadius: "10px",
                background: isActive
                  ? `linear-gradient(135deg, ${primaryColor}40, ${primaryColor}20)`
                  : isHovered
                    ? "rgba(255, 255, 255, 0.12)"
                    : "rgba(255, 255, 255, 0.05)",
                border: isActive
                  ? `1px solid ${primaryColor}`
                  : "1px solid rgba(255, 255, 255, 0.1)",
                color: isActive ? primaryColor : textColor,
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: isActive ? "600" : "500",
                transition: "all 0.25s ease",
                transform: isHovered && !isActive ? "translateY(-1px)" : "none",
                boxShadow: isActive
                  ? `0 4px 12px ${primaryColor}30`
                  : isHovered
                    ? "0 2px 8px rgba(0, 0, 0, 0.2)"
                    : "none",
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Spacer for symmetry */}
      <div style={{ width: "90px" }} />
    </nav>
  );
}
