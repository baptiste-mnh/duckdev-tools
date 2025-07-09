import { useState } from "react";
import { Search, Settings, Github, Star } from "lucide-react";
import { useAppStore } from "../../stores/useAppStore";

export default function Header() {
  const { searchQuery, setSearchQuery, currentTool } = useAppStore();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <header className="border-b border-dark-700 pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-2xl font-bold text-white">
            <img
              src="/duckdev-tools/icons/logo_512x512.png"
              alt="DuckDev Tools"
              className="w-12 h-12"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold gradient-text">DuckDev Tools</h1>
            <p className="text-gray-300 text-sm mt-1">
              Your complete development toolbox
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!currentTool && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search for a tool..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 bg-dark-800 border border-dark-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              />
            </div>
          )}

          <a
            href="https://github.com/baptiste-mnh/duckdev-tools"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-dark-800 hover:bg-dark-700 border border-dark-600 rounded-lg transition-colors duration-200 text-gray-400 hover:text-white group"
            title="Voir sur GitHub"
          >
            <Github className="w-5 h-5" />
          </a>

          <button
            onClick={() => {
              window.open(
                "https://github.com/baptiste-mnh/duckdev-tools",
                "_blank"
              );
            }}
            className="flex items-center gap-2 px-3 py-2 bg-dark-800 hover:bg-dark-700 border border-dark-600 rounded-lg transition-colors duration-200 text-gray-400 hover:text-white group"
            title="Étoiler sur GitHub"
          >
            <Star className="w-4 h-4" />
            <span className="text-sm">Star</span>
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 bg-dark-800 hover:bg-dark-700 border border-dark-600 rounded-lg transition-colors duration-200 text-gray-400 hover:text-white group"
            title="Parameters"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="absolute right-0 mt-2 w-80 bg-dark-800 border border-dark-600 rounded-lg shadow-xl z-50 mx-4 p-4 animate-slide-in">
          <h3 className="text-lg font-semibold mb-4 text-gray-100">
            Parameters
          </h3>

          <div className="space-y-4">
            <div className="pt-3 border-t border-dark-600">
              <h4 className="text-sm font-medium text-gray-300 mb-2">
                Information
              </h4>
              <div className="space-y-1 text-sm text-gray-400">
                <div>Version : v{import.meta.env.VITE_VERSION}</div>
                <div>Build : {import.meta.env.MODE ?? "static"}</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowSettings(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>
      )}
    </header>
  );
}
