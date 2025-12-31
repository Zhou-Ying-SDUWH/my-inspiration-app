import { insforge } from '@/config/insforge';
import { Run } from '@/types/run';
import { useUser } from '@insforge/react';

// 数据库操作相关API
export const dbAPI = {
  // 移除了getUserId方法，因为用户ID应该通过useUser钩子在组件中获取

  // 获取当前用户的跑步记录
  async getUserRuns(userId: string) {
    try {
      console.log('getUserRuns - userId:', userId);
      
      if (!userId) {
        throw new Error('无法获取用户ID');
      }

      console.log('Fetching runs from database...');
      const { data, error } = await insforge.database
        .from('runs')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      console.log('Database response:', { data, error });

      if (error) {
        console.error('Database error:', error);
        throw new Error(error.message || '获取跑步记录失败');
      }

      return { data, error: null };
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

      console.log('Adding run to database:', { ...runData, user_id: userId });
      const { data, error } = await insforge.database
        .from('runs')
        .insert([{ ...runData, user_id: userId }])
        .select();

      console.log('Database response for addRun:', { data, error });

      if (error) {
        console.error('Database error in addRun:', error);
        throw new Error(error.message || '添加跑步记录失败');
      }

      return { data, error: null };
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

      const { data, error } = await insforge.database
        .from('runs')
        .update(runData)
        .eq('id', id)
        .eq('user_id', userId)
        .select();

      if (error) {
        throw new Error(error.message || '更新跑步记录失败');
      }

      return { data, error: null };
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

      const { error } = await insforge.database
        .from('runs')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        throw new Error(error.message || '删除跑步记录失败');
      }

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

      const { data, error } = await insforge.database
        .from('runs')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error) {
        throw new Error(error.message || '获取跑步记录失败');
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};