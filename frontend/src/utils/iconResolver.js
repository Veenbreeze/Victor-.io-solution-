import {
  Braces,
  BriefcaseBusiness,
  Code2,
  FileText,
  Globe2,
  GraduationCap,
  Layers,
  Megaphone,
  Palette,
  Rocket,
  ServerCog,
  Sparkles,
  Star,
  TrendingUp,
  Zap
} from 'lucide-react';

const iconMap = {
  Braces,
  BriefcaseBusiness,
  Code2,
  FileText,
  Globe2,
  GraduationCap,
  Layers,
  Megaphone,
  Palette,
  Rocket,
  ServerCog,
  Sparkles,
  Star,
  TrendingUp,
  Zap
};

export function resolveIcon(name) {
  return iconMap[name] || Sparkles;
}

export const availableIconNames = Object.keys(iconMap);
