'use client';

import React, { useState, useEffect } from 'react';
import { Run } from '@/types/run';
import { calculatePace, formatTime, parseTime } from '@/utils/paceCalculations';

interface RunFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (runData: Omit<Run, 'id'>) => void;
  run?: Run;
}

export function RunFormModal({ visible, onClose, onSave, run }: RunFormModalProps) {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [distance, setDistance] = useState('');
  const [timeHours, setTimeHours] = useState('0');
  const [timeMinutes, setTimeMinutes] = useState('0');
  const [timeSeconds, setTimeSeconds] = useState('0');
  const [pace, setPace] = useState('');

  // 如果是编辑模式，填充表单数据
  useEffect(() => {
    if (run) {
      setName(run.name || '');
      setDate(run.date || '');
      setDistance(run.distance.toString());
      
      // 解析时间
      const totalSeconds = run.time;
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      
      setTimeHours(hours.toString());
      setTimeMinutes(minutes.toString());
      setTimeSeconds(seconds.toString());
      
      // 解析配速
      const paceMinutes = Math.floor(run.pace / 60);
      const paceSeconds = Math.floor(run.pace % 60);
      setPace(`${paceMinutes}:${paceSeconds.toString().padStart(2, '0')}`);
    } else {
      // 重置表单
      setName('');
      setDate(new Date().toISOString().split('T')[0]);
      setDistance('');
      setTimeHours('0');
      setTimeMinutes('0');
      setTimeSeconds('0');
      setPace('');
    }
  }, [run, visible]);

  // 当距离或时间改变时，自动计算配速
  useEffect(() => {
    const distanceNum = parseFloat(distance);
    const totalSeconds = parseInt(timeHours) * 3600 + parseInt(timeMinutes) * 60 + parseInt(timeSeconds);
    
    if (distanceNum > 0 && totalSeconds > 0) {
      const calculatedPace = calculatePace(distanceNum, totalSeconds);
      const paceMinutes = Math.floor(calculatedPace / 60);
      const paceSeconds = Math.floor(calculatedPace % 60);
      setPace(`${paceMinutes}:${paceSeconds.toString().padStart(2, '0')}`);
    }
  }, [distance, timeHours, timeMinutes, timeSeconds]);

  const handleSave = () => {
    if (!name || !date || !distance) {
      alert('请填写所有必填字段');
      return;
    }

    const distanceNum = parseFloat(distance);
    if (isNaN(distanceNum) || distanceNum <= 0) {
      alert('请输入有效的距离');
      return;
    }

    const totalSeconds = parseInt(timeHours) * 3600 + parseInt(timeMinutes) * 60 + parseInt(timeSeconds);
    if (isNaN(totalSeconds) || totalSeconds <= 0) {
      alert('请输入有效的时间');
      return;
    }

    const paceSeconds = parseTime(pace);
    if (isNaN(paceSeconds) || paceSeconds <= 0) {
      alert('请输入有效的配速');
      return;
    }

    onSave({
      name,
      date,
      distance: distanceNum,
      time: totalSeconds,
      pace: paceSeconds,
    });
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          {run ? '编辑跑步记录' : '添加跑步记录'}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              名称
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="例如：晨跑"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              日期
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              距离 (公里)
            </label>
            <input
              type="number"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="例如：5.5"
              step="0.1"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              时间
            </label>
            <div className="flex space-x-2">
              <div className="flex-1">
                <input
                  type="number"
                  value={timeHours}
                  onChange={(e) => setTimeHours(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="时"
                  min="0"
                />
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  value={timeMinutes}
                  onChange={(e) => setTimeMinutes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="分"
                  min="0"
                  max="59"
                />
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  value={timeSeconds}
                  onChange={(e) => setTimeSeconds(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="秒"
                  min="0"
                  max="59"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              配速 (分:秒/公里)
            </label>
            <input
              type="text"
              value={pace}
              onChange={(e) => setPace(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="例如：5:30"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}