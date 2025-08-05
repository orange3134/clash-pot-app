import { Match } from '../types';

const STORAGE_KEY = 'clash-pot-matches';

export function saveMatch(match: Match): void {
  const existingMatches = getMatches();
  const updatedMatches = existingMatches.filter(m => m.id !== match.id);
  updatedMatches.push(match);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMatches));
}

export function getMatches(): Match[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading matches from localStorage:', error);
    return [];
  }
}

export function getMatch(id: string): Match | null {
  const matches = getMatches();
  return matches.find(match => match.id === id) || null;
}

export function deleteMatch(id: string): void {
  const matches = getMatches();
  const filteredMatches = matches.filter(match => match.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredMatches));
}
