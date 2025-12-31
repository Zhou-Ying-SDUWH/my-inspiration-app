import { create } from 'zustand';
import { dbAPI } from '@/services/dbAPI';
import { Run } from '@/types/run';

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

export const useRunStore = create<RunStore>((set, get) => ({
  runs: [],
  isLoading: false,
  error: null,
  
  fetchRuns: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      console.log('Fetching runs for user:', userId);
      const { data: runs, error } = await dbAPI.getUserRuns(userId);
      
      if (error) {
        console.error('Error fetching runs:', error);
        throw new Error(error.message || 'Failed to fetch runs');
      }
      
      console.log('Fetched runs:', runs);
      set({ runs: runs || [] });
    } catch (err) {
      console.error('Error in fetchRuns:', err);
      set({ error: err instanceof Error ? err.message : 'Failed to fetch runs' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  addRun: async (run: Omit<Run, 'id' | 'user_id'>, userId: string) => {
    set({ isLoading: true, error: null });
    try {
      console.log('Adding run for user:', userId, run);
      const { data: newRun, error } = await dbAPI.addRun(userId, run);
      
      if (error) {
        console.error('Error adding run:', error);
        throw new Error(error.message || 'Failed to add run');
      }
      
      console.log('Added run:', newRun);
      if (newRun && newRun.length > 0) {
        set({ runs: [newRun[0], ...get().runs] });
      }
    } catch (err) {
      console.error('Error in addRun:', err);
      set({ error: err instanceof Error ? err.message : 'Failed to add run' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  updateRun: async (id: string, updates: Partial<Omit<Run, 'id' | 'user_id'>>, userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data: updatedRun } = await dbAPI.updateRun(userId, id, updates);
      
      if (updatedRun && updatedRun.length > 0) {
        set({
          runs: get().runs.map((run) =>
            run.id === id ? updatedRun[0] : run
          ),
        });
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to update run' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  deleteRun: async (id: string, userId: string) => {
    set({ isLoading: true, error: null });
    try {
      await dbAPI.deleteRun(userId, id);
      
      set({ runs: get().runs.filter((run) => run.id !== id) });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to delete run' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  getRunById: (id) => get().runs.find((run) => run.id === id),
}));