import { Run } from '@/types/run';

// 模拟跑步记录数据
const mockRuns: Run[] = [
  {
    id: '1',
    user_id: 'f68e2505-2ae9-4bec-941f-aeb5dc2a88e5',
    name: '晨跑',
    date: '2023-06-01',
    distance: 5,
    time: 1800,
    pace: 360
  },
  {
    id: '2',
    user_id: 'f68e2505-2ae9-4bec-941f-aeb5dc2a88e5',
    name: '夜跑',
    date: '2023-06-03',
    distance: 8,
    time: 2880,
    pace: 360
  },
  {
    id: '3',
    user_id: 'f68e2505-2ae9-4bec-941f-aeb5dc2a88e5',
    name: '周末长跑',
    date: '2023-06-05',
    distance: 12,
    time: 4680,
    pace: 390
  }
];

// 数据库操作相关API
export const dbAPI = {
  // 获取当前用户的跑步记录
  async getUserRuns(userId: string) {
    try {
      console.log('getUserRuns - userId:', userId);
      
      if (!userId) {
        throw new Error('无法获取用户ID');
      }

      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 返回模拟数据
      const userRuns = mockRuns.filter(run => run.user_id === userId);
      console.log('返回模拟跑步记录:', userRuns);
      
      return { data: userRuns, error: null };
    } catch (error) {
      console.error('Error in getUserRuns:', error);
      return { data: null, error };
    }
  },

  // 添加新的跑步记录
  async addRun(userId: string, runData: {
    name: string;
    date: string;
    distance: number;
    time: number;
    pace: number;
  }) {
    try {
      console.log('addRun - userId:', userId);
      
      if (!userId) {
        throw new Error('无法获取用户ID');
      }

      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 创建新记录
      const newRun: Run = {
        id: Date.now().toString(),
        user_id: userId,
        ...runData
      };
      
      // 添加到模拟数据
      mockRuns.push(newRun);
      
      console.log('添加模拟跑步记录:', newRun);
      
      return { data: [newRun], error: null };
    } catch (error) {
      console.error('Error in addRun:', error);
      return { data: null, error };
    }
  },

  // 更新跑步记录
  async updateRun(userId: string, id: string, runData: {
    name?: string;
    date?: string;
    distance?: number;
    time?: number;
    pace?: number;
  }) {
    try {
      if (!userId) {
        throw new Error('无法获取用户ID');
      }

      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 查找并更新记录
      const runIndex = mockRuns.findIndex(run => run.id === id && run.user_id === userId);
      
      if (runIndex === -1) {
        throw new Error('跑步记录不存在');
      }
      
      const updatedRun = { ...mockRuns[runIndex], ...runData };
      mockRuns[runIndex] = updatedRun;
      
      return { data: [updatedRun], error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // 删除跑步记录
  async deleteRun(userId: string, id: string) {
    try {
      if (!userId) {
        throw new Error('无法获取用户ID');
      }

      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 查找并删除记录
      const runIndex = mockRuns.findIndex(run => run.id === id && run.user_id === userId);
      
      if (runIndex === -1) {
        throw new Error('跑步记录不存在');
      }
      
      mockRuns.splice(runIndex, 1);
      
      return { data: null, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // 根据ID获取单个跑步记录
  async getRunById(userId: string, id: string) {
    try {
      if (!userId) {
        throw new Error('无法获取用户ID');
      }

      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 查找记录
      const run = mockRuns.find(run => run.id === id && run.user_id === userId);
      
      if (!run) {
        throw new Error('跑步记录不存在');
      }
      
      return { data: run, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};