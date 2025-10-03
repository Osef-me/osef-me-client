import React, { useState } from "react";
import { HiChevronRight, HiChevronDown } from "react-icons/hi";
import { MdMenuBook, MdLocationSearching, MdBarChart, MdInfo } from "react-icons/md";
import { useHelpContent } from "@/hooks/useHelpContent";

const ChevronRight = HiChevronRight;
const ChevronDown = HiChevronDown;
const BookOpen = MdMenuBook;
const Target = MdLocationSearching;
const BarChart3 = MdBarChart;
const Info = MdInfo;

interface HelpSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  subsections?: {
    id: string;
    title: string;
  }[];
}

const Help: React.FC = () => {
  const { getContent, getSectionList } = useHelpContent();
  const [activeSection, setActiveSection] = useState<string>("patterns");
  const [activeSubsection, setActiveSubsection] = useState<string>("stream");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["patterns"]));

  const HELP_SECTIONS: HelpSection[] = [
    {
      id: "patterns",
      title: "Patterns",
      icon: <Target size={18} />,
      subsections: getSectionList().find(s => s.id === "patterns")?.subsections
    },
    {
      id: "ratings", 
      title: "MSD Rating System",
      icon: <BarChart3 size={18} />,
      subsections: getSectionList().find(s => s.id === "ratings")?.subsections
    },
    {
      id: "navigation",
      title: "Using the Website", 
      icon: <BookOpen size={18} />,
      subsections: getSectionList().find(s => s.id === "navigation")?.subsections
    },
  ];

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const selectSection = (sectionId: string, subsectionId?: string) => {
    setActiveSection(sectionId);
    if (subsectionId) {
      setActiveSubsection(subsectionId);
    } else {
      // If no subsection, select the first one
      const section = HELP_SECTIONS.find(s => s.id === sectionId);
      if (section?.subsections && section.subsections.length > 0) {
        setActiveSubsection(section.subsections[0].id);
      }
    }
  };

  const renderContent = () => {
    const sectionTitle = HELP_SECTIONS.find(s => s.id === activeSection)?.title;
    const subsectionTitle = HELP_SECTIONS
      .find(s => s.id === activeSection)
      ?.subsections?.find(sub => sub.id === activeSubsection)?.title;

    const content = getContent(activeSection, activeSubsection);

    return (
      <div className="flex-1 p-6 relative">
        {/* Fixed GIF Panel on the right */}
        {content?.content?.gif_url && (
          <div className="fixed top-20 right-6 w-80 z-10">
            <div className="bg-base-200 rounded-lg p-4 shadow-lg border border-base-300">
              <h4 className="text-md font-medium mb-3">Visual Example</h4>
              <div className="bg-base-300 rounded-lg p-4 text-center">
                <img
                  src={content.content.gif_url}
                  alt={content.content.gif_description || "Pattern example"}
                  className="w-full h-auto rounded-lg shadow-md"
                  onError={(e) => {
                    // Fallback si le GIF ne charge pas
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="bg-base-100 rounded border-2 border-dashed border-base-content/20 p-6">
                          <p class="text-base-content/60 mb-2">📹 GIF Preview</p>
                          <p class="text-xs font-mono text-base-content/50 mb-2">${content.content.gif_url}</p>
                          <p class="text-xs text-base-content/40">${content.content.gif_description}</p>
                        </div>
                      `;
                    }
                  }}
                />
                {content.content.gif_description && (
                  <p className="text-xs text-base-content/60 mt-2 text-center">
                    {content.content.gif_description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <div className="text-sm breadcrumbs mb-6">
            <ul>
              <li>Help</li>
              <li>{sectionTitle}</li>
              {subsectionTitle && <li>{subsectionTitle}</li>}
            </ul>
          </div>

          {/* Content Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-base-content mb-2">
              {subsectionTitle || sectionTitle}
            </h1>
            {content?.description && (
              <div className="alert alert-info">
                <Info size={20} />
                <span>{content.description}</span>
              </div>
            )}
          </div>

          {/* Main Content */}
          {content && (
            <div className="prose max-w-none space-y-6">
              {/* Definition */}
              {content.content?.definition && (
                <div className="bg-base-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3">Definition</h3>
                  <p className="text-base-content/80">{content.content.definition}</p>
                </div>
              )}

              {/* Characteristics */}
              {content.content?.characteristics && (
                <div className="bg-base-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3">Characteristics</h3>
                  <ul className="list-disc list-inside space-y-2 text-base-content/70">
                    {content.content.characteristics.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Difficulty Factors */}
              {content.content?.difficulty_factors && (
                <div className="bg-base-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3">Difficulty Factors</h3>
                  <ul className="list-disc list-inside space-y-2 text-base-content/70">
                    {content.content.difficulty_factors.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}



              {/* Example Beatmaps */}
              {content.content?.example_beatmaps && (
                <div className="bg-base-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3">Example Beatmaps</h3>
                  <div className="grid gap-3">
                    {content.content.example_beatmaps.map((beatmap, i) => (
                      <div key={i} className="bg-base-100 rounded-lg p-4 hover:bg-base-300 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <a 
                              href={beatmap.url}
                              className="text-primary hover:text-primary-focus font-medium text-lg"
                            >
                              {beatmap.title}
                            </a>
                            <p className="text-sm text-base-content/60">
                              Click to view beatmap details
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="badge badge-primary font-mono text-sm">
                              {beatmap.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-xs text-base-content/50">
                    💡 Tip: Click on beatmap titles to view their detailed MSD analysis
                  </div>
                </div>
              )}

              {/* Scale (for ratings) */}
              {content.content?.scale && (
                <div className="bg-base-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3">Difficulty Scale</h3>
                  <div className="space-y-2">
                    {Object.entries(content.content.scale).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center p-2 bg-base-100 rounded">
                        <span className="font-medium capitalize">{key}:</span>
                        <span className="font-mono text-base-content/70">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Common Rates */}
              {content.content?.common_rates && (
                <div className="bg-base-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3">Common Rate Modifiers</h3>
                  <div className="space-y-2">
                    {Object.entries(content.content.common_rates).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center p-2 bg-base-100 rounded">
                        <span className="font-mono font-medium">{key}:</span>
                        <span className="text-base-content/70">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Generic Lists */}
              {content.content?.factors && (
                <div className="bg-base-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3">Key Factors</h3>
                  <ul className="list-disc list-inside space-y-2 text-base-content/70">
                    {content.content.factors.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {content.content?.usage_tips && (
                <div className="bg-base-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3">Usage Tips</h3>
                  <ul className="list-disc list-inside space-y-2 text-base-content/70">
                    {content.content.usage_tips.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-base-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-base-200 border-r border-base-300 min-h-screen">
          <div className="p-6">
            <h2 className="text-xl font-bold text-base-content mb-6">Help & Documentation</h2>
            
            <nav className="space-y-2">
              {HELP_SECTIONS.map((section) => (
                <div key={section.id}>
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(section.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? "bg-primary text-primary-content"
                        : "bg-base-100 hover:bg-base-300 text-base-content"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {section.icon}
                      <span className="font-medium">{section.title}</span>
                    </div>
                    {expandedSections.has(section.id) ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </button>

                  {/* Subsections */}
                  {expandedSections.has(section.id) && section.subsections && (
                    <div className="ml-4 mt-2 space-y-1">
                      {section.subsections.map((subsection) => (
                        <button
                          key={subsection.id}
                          onClick={() => selectSection(section.id, subsection.id)}
                          className={`w-full text-left p-2 rounded text-sm transition-colors ${
                            activeSection === section.id && activeSubsection === subsection.id
                              ? "bg-secondary text-secondary-content"
                              : "text-base-content/70 hover:bg-base-300 hover:text-base-content"
                          }`}
                        >
                          {subsection.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default Help;
