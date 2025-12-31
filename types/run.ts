export interface Run {
  id: string;
  user_id?: string;
  date: string;
  name: string;
  distance: number; // in km
  time: number; // in seconds
  pace: number; // in seconds per km
}

interface RunStore {
  runs: Run[];
  isLoading: boolean;
  error: string | null;
  fetchRuns: (userId: string) => Promise<void>;
  addRun: (run: Omit<Run, 'id' | 'user_id'>, userId: string) => Promise<void>;
  updateRun: (id: string, updates: Partial<Omit<Run, 'id' | 'user_id'>>, userId: string) => Promise<void>;
  deleteRun: (id: string, userId: string) => Promise<void>;
  getRunById: (id: string) => Run | undefined;
}