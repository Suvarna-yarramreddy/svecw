import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BsChevronDown, BsChevronUp } from "react-icons/bs"; // Importing Bootstrap icons for arrows
import { Link } from "react-router-dom"; // Import Link from react-router-dom


const CollapsibleSection = ({ title, items, closeSidebar }) => {
 
  const [isOpen, setIsOpen] = React.useState(false);
  const toggleSection = () => setIsOpen(!isOpen);

  return (
    <li>
      <div
        className="d-flex justify-content-between align-items-center w-100"
        style={{
          padding: "10px 15px", // Added padding for better spacing
        }}
      >
        <span style={{ color: "black", fontWeight: "normal" }}>{title}</span>
        <button
          onClick={toggleSection}
          style={{
            border: "none",
            backgroundColor: "transparent",
            padding: "0",
            cursor: "pointer", // Show pointer on hover over the arrow
          }}
        >
          {isOpen ? <BsChevronUp /> : <BsChevronDown />}
        </button>
      </div>
      {isOpen && (
        <ul className="list-unstyled ms-3">
          {items.map((item, index) => (
            <li key={index} style={{ marginBottom: "5px" }}>
              <Link
                to={`/${item.replace(/\s+/g, '').toLowerCase()}`} // Remove spaces and convert to lowercase for path
                style={{
                  color: "black", // Set item text to black
                  backgroundColor: "transparent", // No background
                  textDecoration: "none", // No underline
                  fontWeight: "normal", // No bold
                }}
                onClick={() => closeSidebar()} // Close sidebar when item is clicked
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

const Sidebar = ({ closeSidebar }) => {
  const sections = [
    {
      title: "Publications",
      items: ["Add Publication", "View Publications"],
    },
    {
      title: "Patents",
      items: ["Add Patent", "View Patents"],
    },
    {
      title: "Seed Money",
      items: ["Add Seed Money", "View Seed Money"],
    },
    {
      title: "External Funded Projects",
      items: ["Add External Project", "View External Projects"],
    },
    {
      title: "Consultant",
      items: ["Add Consultant", "View Consultants"],
    },
    {
      title: "Research Scholars",
      items: ["Add Research Scholar", "View Research Scholars"],
    },
    {
      title: "Funded Proposals Submitted",
      items: ["Add Funded Proposal", "View Funded Proposals"],
    },
  ];

  return (
    <div
      className="sidebar bg-light border-end"
      style={{
        width: "250px",
        position: "fixed",
        top: "70px", // Adjusted to be closer to the navbar
        left: "0",
        bottom: "0",
        overflowY: "auto",
        zIndex: "1000",
      }}
    >
      <ul className="list-unstyled p-2">
        {sections.map((section, index) => (
          <CollapsibleSection
            key={index}
            title={section.title}
            items={section.items}
            closeSidebar={closeSidebar} // Pass the closeSidebar function to the section
          />
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
