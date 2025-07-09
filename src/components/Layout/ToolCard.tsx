import { Star, TrendingUp } from "lucide-react";
import type { Tool } from "../../types";

type ToolCardProps = {
  tool: Tool;
  onClick: (toolId: string) => void;
  isFavorite: boolean;
  onToggleFavorite: (toolId: string) => void;
  usageCount?: number;
};

export default function ToolCard({
  tool,
  onClick,
  isFavorite,
  onToggleFavorite,
  usageCount = 0,
}: ToolCardProps) {
  return (
    <div
      onClick={() => onClick(tool.id)}
      className="group relative glass-effect rounded-xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary-500/10 hover:border-primary-500/30"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(tool.id);
        }}
        className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 ${
          isFavorite
            ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
            : "bg-dark-700 text-gray-500 hover:bg-dark-600 hover:text-yellow-400"
        }`}
        title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
      >
        <Star className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
      </button>

      {usageCount > 0 && (
        <div className="absolute top-4 left-4 flex items-center gap-1 px-2 py-1 bg-primary-500/20 text-primary-400 rounded-full text-xs">
          <TrendingUp className="w-3 h-3" />
          <span>{usageCount}</span>
        </div>
      )}

      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-xl flex items-center justify-center text-2xl group-hover:from-primary-500/30 group-hover:to-secondary-500/30 transition-all duration-300">
          {tool.icon}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-100 mb-2 group-hover:text-primary-400 transition-colors duration-200">
            {tool.name}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            {tool.description}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            tool.category === "generators"
              ? "bg-green-500/20 text-green-400"
              : tool.category === "converters"
                ? "bg-blue-500/20 text-blue-400"
                : tool.category === "analyzers"
                  ? "bg-purple-500/20 text-purple-400"
                  : tool.category === "image"
                    ? "bg-orange-500/20 text-orange-400"
                    : "bg-purple-500/20 text-purple-400"
          }`}
        >
          {tool.category === "generators"
            ? "Générateur"
            : tool.category === "converters"
              ? "Convertisseur"
              : tool.category === "analyzers"
                ? "Analyseur"
                : tool.category === "image"
                  ? "Image"
                  : "IA"}
        </span>

        <div className="text-gray-500 group-hover:text-primary-400 transition-colors duration-200">
          <svg
            className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-secondary-500/0 group-hover:from-primary-500/5 group-hover:to-secondary-500/5 rounded-xl pointer-events-none transition-all duration-300"></div>
    </div>
  );
}
