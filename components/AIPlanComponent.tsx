import React, { useState, useEffect } from 'react';
import { Brain, Calendar, Clock, MapPin, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';

interface PlanDay {
  day: string;
  type: string;
  distance: number;
  duration: number;
  pace: string;
  description: string;
}

interface AIPlan {
  plan: PlanDay[];
  summary: string;
  tips: string[];
}

interface AIPlanComponentProps {
  userId: string;
}

export const AIPlanComponent: React.FC<AIPlanComponentProps> = ({ userId }) => {
  const [plan, setPlan] = useState<AIPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasHistory, setHasHistory] = useState<boolean | null>(null);

  // 检查用户是否有足够的跑步记录
  const checkUserHistory = async () => {
    try {
      const response = await fetch(`/api/ai/generate-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      
      if (response.status === 400) {
        const data = await response.json();
        if (data.error?.includes('没有足够的跑步记录')) {
          setHasHistory(false);
          setError(data.suggestion || '请先添加几条跑步记录');
          return;
        }
      }
      
      setHasHistory(true);
    } catch (err) {
      console.error('检查用户历史失败:', err);
      setHasHistory(false);
    }
  };

  // 生成AI计划
  const generatePlan = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/ai/generate-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '生成计划失败');
      }
      
      setPlan(data.plan);
      setHasHistory(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成计划失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 获取已保存的计划
  const getSavedPlans = async () => {
    try {
      const response = await fetch(`/api/ai/get-plans?userId=${userId}`);
      const data = await response.json();
      
      if (response.ok && data.plans && data.plans.length > 0) {
        setPlan(data.plans[0].plan_data);
        setHasHistory(true);
      } else {
        // 如果没有保存的计划，检查是否有跑步历史
        await checkUserHistory();
      }
    } catch (err) {
      console.error('获取已保存计划失败:', err);
      await checkUserHistory();
    }
  };

  useEffect(() => {
    if (userId) {
      getSavedPlans();
    }
  }, [userId]);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return hours > 0 ? `${hours}小时${mins}分钟` : `${mins}分钟`;
  };

  if (hasHistory === null) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (hasHistory === false) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
          <AlertCircle className="text-amber-500 mr-2" size={24} />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">智能跑步计划</h2>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <p className="text-amber-800 dark:text-amber-200">{error}</p>
          <p className="text-sm text-amber-700 dark:text-amber-300 mt-2">
            添加至少一条跑步记录后，即可生成个性化的智能跑步计划。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Brain className="text-blue-500 mr-2" size={24} />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">智能跑步计划</h2>
        </div>
        <button
          onClick={generatePlan}
          disabled={isLoading}
          className="flex items-center px-3 py-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-md text-sm transition-colors"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              生成中...
            </>
          ) : (
            <>
              <RefreshCw size={16} className="mr-1" />
              重新生成
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : plan ? (
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">本周训练计划</h3>
            <p className="text-gray-600 dark:text-gray-400">{plan.summary}</p>
          </div>

          <div className="space-y-3 mb-6">
            {plan.plan.map((day, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <Calendar size={18} className="text-gray-500 mr-2" />
                    <h4 className="font-medium text-gray-900 dark:text-white">{day.day}</h4>
                    <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                      {day.type}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{day.description}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <MapPin size={16} className="mr-1" />
                    {day.distance}公里
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <Clock size={16} className="mr-1" />
                    {formatDuration(day.duration)}
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <TrendingUp size={16} className="mr-1" />
                    {day.pace}/公里
                  </div>
                </div>
              </div>
            ))}
          </div>

          {plan.tips && plan.tips.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">训练建议</h4>
              <ul className="list-disc list-inside space-y-1">
                {plan.tips.map((tip, index) => (
                  <li key={index} className="text-sm text-blue-800 dark:text-blue-200">{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <Brain size={48} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">还没有生成智能跑步计划</p>
          <button
            onClick={generatePlan}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-md transition-colors"
          >
            生成智能计划
          </button>
        </div>
      )}
    </div>
  );
};