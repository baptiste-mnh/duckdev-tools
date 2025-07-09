import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../stores/useAppStore";
import type { Tool } from "../../types";

interface ToolLayoutProps {
  children: React.ReactNode;
  tool: Tool;
}

const ToolLayout: React.FC<ToolLayoutProps> = ({ children, tool }) => {
  const navigate = useNavigate();
  const { incrementToolUsage } = useAppStore();

  React.useEffect(() => {
    incrementToolUsage(tool.id);
  }, [tool.id, incrementToolUsage]);

  return (
    <div className="animate-fade-in">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 mb-6 px-4 py-2 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors duration-200 text-gray-300 hover:text-white"
      >
        <span>←</span>
        <span>Retour au dashboard</span>
      </button>

      <div className="glass-effect rounded-2xl p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="text-4xl">{tool.icon}</div>
          <div>
            <h1 className="text-3xl font-bold gradient-text">{tool.name}</h1>
            <p className="text-gray-400 mt-2">{tool.description}</p>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
};

export default ToolLayout;
