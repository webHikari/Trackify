import React from "react";
import "./Sidebar.css";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "home", label: "Home" },
    { id: "dashboard", label: "Dashboard" },
    { id: "activity", label: "Activity" },
    { id: "pages", label: "Pages" },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Trackify</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                className={activeTab === tab.id ? "active" : ""}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}; 