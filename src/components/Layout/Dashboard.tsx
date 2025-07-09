import { Clock, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../stores/useAppStore";
import type { Tool } from "../../types";
import ToolCard from "./ToolCard";

interface DashboardProps {
  tools: Tool[];
}

export default function Dashboard({ tools }: DashboardProps) {
  const navigate = useNavigate();
  const { searchQuery, favorites, toggleFavorite, history } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredTools = useMemo(() => {
    let filtered = tools;

    // Filtre par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (tool) =>
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query) ||
          tool.category.toLowerCase().includes(query)
      );
    }

    // Filtre par catégorie
    if (selectedCategory) {
      filtered = filtered.filter((tool) => tool.category === selectedCategory);
    }

    return filtered;
  }, [tools, searchQuery, selectedCategory]);

  // Outils favoris
  const favoriteTools = useMemo(() => {
    return tools.filter((tool) => favorites.includes(tool.id));
  }, [tools, favorites]);

  // Outils récemment utilisés
  const recentTools = useMemo(() => {
    const recentEntries = history.slice(0, 6).reduce((acc, entry) => {
      if (!acc.find((tool) => tool.id === entry.toolId)) {
        const tool = tools.find((t) => t.id === entry.toolId);
        if (tool) acc.push(tool);
      }
      return acc;
    }, [] as Tool[]);

    return recentEntries;
  }, [history, tools]);

  // Catégories d'outils
  const categories = useMemo(() => {
    const grouped = filteredTools.reduce(
      (acc, tool) => {
        if (!acc[tool.category]) acc[tool.category] = [];
        acc[tool.category].push(tool);
        return acc;
      },
      {} as Record<string, Tool[]>
    );

    return Object.entries(grouped).map(([category, tools]) => ({
      name: category,
      label:
        {
          generators: "Générateurs",
          converters: "Convertisseurs",
          analyzers: "Analyseurs",
          ai: "Intelligence Artificielle",
        }[category as keyof typeof grouped] || category,
      tools,
      icon:
        {
          generators: "🔧",
          converters: "🔄",
          analyzers: "📊",
          ai: "🤖",
        }[category as keyof typeof grouped] || "🛠️",
    }));
  }, [filteredTools]);

  // Catégories disponibles pour les filtres
  const availableCategories = useMemo(() => {
    const categories = tools.reduce(
      (acc, tool) => {
        if (!acc[tool.category]) {
          acc[tool.category] = {
            name: tool.category,
            label:
              {
                generators: "Générateurs",
                converters: "Convertisseurs",
                analyzers: "Analyseurs",
                ai: "Intelligence Artificielle",
                image: "Images",
              }[tool.category] || tool.category,
            icon:
              {
                generators: "🔧",
                converters: "🔄",
                analyzers: "📊",
                ai: "🤖",
                image: "🖼️",
              }[tool.category] || "🛠️",
          };
        }
        return acc;
      },
      {} as Record<string, { name: string; label: string; icon: string }>
    );

    return Object.values(categories);
  }, [tools]);

  const toggleCategoryFilter = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  return (
    <div className="space-y-8">
      {/* Filtres par catégorie */}
      <div className="bg-dark-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🏷️</span>
          <h3 className="text-lg font-medium text-gray-200">
            Filtrer par catégorie
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {availableCategories.map(({ name, label, icon }) => (
            <button
              key={name}
              onClick={() => toggleCategoryFilter(name)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedCategory === name
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-dark-700 text-gray-300 hover:bg-dark-600 hover:text-white"
              }`}
            >
              <span className="mr-2">{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Sections rapides */}
      {!searchQuery && !selectedCategory && (
        <div className="space-y-6">
          {/* Outils favoris */}
          {favoriteTools.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-yellow-400" />
                <h2 className="text-xl font-semibold text-gray-100">Favoris</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteTools.map((tool) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    onClick={(toolId) => navigate(`/${toolId}`)}
                    isFavorite={favorites.includes(tool.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Outils récents */}
          {recentTools.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-secondary-400" />
                <h2 className="text-xl font-semibold text-gray-100">
                  Récemment utilisés
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentTools.map((tool) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    onClick={(toolId) => navigate(`/${toolId}`)}
                    isFavorite={favorites.includes(tool.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Tous les outils par catégorie */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl">🛠️</span>
          <h2 className="text-xl font-semibold text-gray-100">
            {searchQuery
              ? `Résultats pour "${searchQuery}"`
              : selectedCategory
                ? `${availableCategories.find((c) => c.name === selectedCategory)?.label}`
                : "Tous les outils"}
          </h2>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="ml-2 px-2 py-1 text-xs bg-dark-700 text-gray-400 hover:text-white rounded"
            >
              ✕
            </button>
          )}
        </div>

        {filteredTools.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
              Aucun outil trouvé
            </h3>
            <p className="text-gray-500">
              Essayez de modifier votre recherche ou parcourez tous les outils
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {categories.map(({ name, label, tools, icon }) => (
              <div key={name}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">{icon}</span>
                  <h3 className="text-lg font-medium text-gray-200">{label}</h3>
                  <span className="text-sm text-gray-500">
                    ({tools.length})
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tools.map((tool) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      onClick={(toolId) => navigate(`/${toolId}`)}
                      isFavorite={favorites.includes(tool.id)}
                      onToggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
