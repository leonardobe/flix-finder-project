import type { Title } from '../types/title';

export function getYearFromTitle(title: Title): string | number {
  if (title.media_type === 'movie') {
    return title.release_date
      ? new Date(title.release_date).getFullYear()
      : 'N/A';
  }

  return title.first_air_date
    ? new Date(title.first_air_date).getFullYear()
    : 'N/A';
}

export function formatDuration(minutes: number | undefined | null): string {
  if (!minutes) {
    return 'N/A';
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}min`;
}
