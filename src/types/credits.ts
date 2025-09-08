export type Cast = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
};

export type Crew = {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
};

export type TitleCreditsResponse = {
  id: number;
  cast: Cast[];
  crew: Crew[];
};