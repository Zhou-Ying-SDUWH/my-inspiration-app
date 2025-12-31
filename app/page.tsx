'use client';

import React, { useState, useEffect } from 'react';
import { useRunStore } from '@/store/useRunStore';
import { RunCard } from '@/components/RunCard';
import { RunFormModal } from '@/components/RunFormModal';
import { AIPlanComponent } from '@/components/AIPlanComponent';
import { Run } from '@/types/run';
import { Plus } from 'lucide-react';
import { SignIn, useUser } from '@insforge/react';
import { CustomUserButton } from '@/components/CustomUserButton';
import { formatPace } from '@/utils/paceCalculations';

export default function Home() {
  const { user } = useUser();
  const [userLoading, setUserLoading] = useState(true);
  const { runs, addRun, updateRun, deleteRun, fetchRuns, isLoading, error } = useRunStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRun, setEditingRun] = useState<Run | undefined>(undefined);

  // 模拟用户加载状态
  useEffect(() => {
    const timer = setTimeout(() => setUserLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Fetch runs when component mounts or user changes
  useEffect(() => {
    if (user) {
      fetchRuns(user.id);
    } else {
      // Clear runs when user is not authenticated
      useRunStore.setState({ runs: [] });
    }
  }, [user, fetchRuns]);

  // Show error message if any
  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

  const handleAddRun = () => {
    setEditingRun(undefined);
    setModalVisible(true);
  };

  const handleEditRun = (run: Run) => {
    setEditingRun(run);
    setModalVisible(true);
  };

  const handleDeleteRun = async (run: Run) => {
    if (window.confirm(`确定要删除"${run.name}"这条记录吗？`)) {
      if (!user) return;
      await deleteRunWithUser(run.id);
    }
  };

  const addRunWithUser = async (run: Omit<Run, 'id' | 'user_id'>) => {
    if (!user) return;
    
    await addRun(run, user.id);
  };

  const updateRunWithUser = async (id: string, updates: Partial<Omit<Run, 'id' | 'user_id'>>) => {
    if (!user) return;
    
    await updateRun(id, updates, user.id);
  };

  const deleteRunWithUser = async (id: string) => {
    if (!user) return;
    
    await deleteRun(id, user.id);
    // 刷新跑步记录列表
    await fetchRuns(user.id);
  };

  const handleSaveRun = async (runData: Omit<Run, 'id'>) => {
    try {
      if (editingRun) {
        await updateRunWithUser(editingRun.id, runData);
        alert('跑步记录已更新');
      } else {
        await addRunWithUser(runData);
        alert('跑步记录已添加');
      }
      setModalVisible(false);
      setEditingRun(undefined);
      // 刷新跑步记录列表
      if (user) {
        await fetchRuns(user.id);
      }
    } catch (err) {
      alert('操作失败，请重试');
    }
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
      <p className="text-lg font-medium mb-2">还没有跑步记录</p>
      <p className="text-sm">点击右下角的 + 按钮添加第一条记录</p>
    </div>
  );

  if (userLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="max-w-md w-full mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
            跑步记录
          </h1>
          <p className="text-center mb-6 text-gray-600 dark:text-gray-400">
            请登录以管理您的跑步记录
          </p>
          <div className="flex justify-center">
            <SignIn />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            跑步记录
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              欢迎, {user.email || '用户'}
            </span>
            <CustomUserButton />
          </div>
        </header>

        <main>
          {/* AI计划组件 */}
          <AIPlanComponent userId={user.id} />
          
          {isLoading && runs.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div>
              {runs.length === 0 ? (
                renderEmptyState()
              ) : (
                <div className="space-y-4">
                  {runs
                    .sort((a, b) => b.date.localeCompare(a.date))
                    .map((run) => (
                      <RunCard
                        key={run.id}
                        run={run}
                        onEdit={() => handleEditRun(run)}
                        onDelete={() => handleDeleteRun(run)}
                      />
                    ))}
                </div>
              )}
            </div>
          )}
        </main>

        <button
          className="fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg transition-colors"
          onClick={handleAddRun}
        >
          <Plus size={24} />
        </button>

        <RunFormModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSave={handleSaveRun}
          run={editingRun}
        />
      </div>
    </div>
  );
}