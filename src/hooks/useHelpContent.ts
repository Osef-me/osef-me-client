import helpData from '@/data/help.json';
import { patternGifs, type PatternGifKey } from '@/assets/gifs';

export interface HelpContent {
  definition?: string;
  gif_url?: string;
  gif_description?: string;
  characteristics?: string[];
  difficulty_factors?: string[];
  example_beatmaps?: Array<{
    title: string;
    rating: string;
    url: string;
  }>;
  scale?: Record<string, string>;
  common_rates?: Record<string, string>;
  factors?: string[];
  usage_tips?: string[];
}

export interface SubsectionContent {
  title: string;
  description: string;
  content: HelpContent;
}

export interface Section {
  title: string;
  description: string;
  subsections: Record<string, SubsectionContent>;
}

export interface HelpData {
  patterns: Section;
  ratings: Section;
  navigation: Section;
}

export const useHelpContent = () => {
  const getGifUrl = (patternName: string): string | undefined => {
    const gifKey = patternName.toLowerCase() as PatternGifKey;
    const gif = patternGifs[gifKey];
    return gif ? gif : undefined;
  };

  const getContent = (sectionId: string, subsectionId: string): SubsectionContent | null => {
    const section = (helpData as any)[sectionId];
    if (!section || !section.subsections) return null;

    const subsection = section.subsections[subsectionId];
    if (!subsection) return null;

    // Remplacer l'URL du gif par celle de l'asset importé
    if (subsection.content.gif_url) {
      const patternName = subsectionId;
      const localGifUrl = getGifUrl(patternName);
      if (localGifUrl) {
        subsection.content.gif_url = localGifUrl;
      }
    }

    return subsection;
  };

  const getSectionList = (): Array<{ id: string; title: string; subsections: Array<{ id: string; title: string }> }> => {
    return Object.entries(helpData as any).map(([id, section]: [string, any]) => ({
      id,
      title: section.title,
      subsections: Object.entries(section.subsections).map(([subId, sub]: [string, any]) => ({
        id: subId,
        title: sub.title,
      })),
    }));
  };

  return {
    getContent,
    getSectionList,
  };
};