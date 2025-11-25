import { BilingualText } from '../types';

export interface IssueCategory {
  id: string;
  name: BilingualText;
  icon: string;
}

export const issueCategories: IssueCategory[] = [
  { id: 'road', name: { en: 'Road/Pothole', kn: 'ರಸ್ತೆ/ಗುಂಡಿ' }, icon: 'Construction' },
  { id: 'water', name: { en: 'Water Supply', kn: 'ನೀರು ಪೂರೈಕೆ' }, icon: 'Droplets' },
  { id: 'electricity', name: { en: 'Electricity', kn: 'ವಿದ್ಯುತ್' }, icon: 'Zap' },
  { id: 'sanitation', name: { en: 'Sanitation/Drainage', kn: 'ನೈರ್ಮಲ್ಯ/ಒಳಚರಂಡಿ' }, icon: 'Pipette' },
  { id: 'streetlight', name: { en: 'Street Light', kn: 'ಬೀದಿ ದೀಪ' }, icon: 'Lightbulb' },
  { id: 'garbage', name: { en: 'Garbage', kn: 'ಕಸ' }, icon: 'Trash2' },
  { id: 'other', name: { en: 'Other', kn: 'ಇತರೆ' }, icon: 'HelpCircle' },
];

export function getCategoryById(id: string): IssueCategory | undefined {
  return issueCategories.find((cat) => cat.id === id);
}

export function getCategoryName(id: string, language: 'en' | 'kn' = 'en'): string {
  const category = getCategoryById(id);
  return category ? category.name[language] : id;
}
