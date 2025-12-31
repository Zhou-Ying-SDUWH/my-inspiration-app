'use client';

import React from 'react';
import { formatDistance, formatTime, formatPace } from '@/utils/paceCalculations';
import { Run } from '@/types/run';
import { Edit, Trash2 } from 'lucide-react';

interface RunCardProps {
  run: Run;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function RunCard({ run, onPress, onEdit, onDelete }: RunCardProps) {
  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
      onClick={onPress}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {run.name || '跑步记录'}
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {run.date}
        </span>
      </div>

      <div className="flex justify-between mb-3">
        <div className="text-center flex-1">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">距离</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatDistance(run.distance)}
          </p>
        </div>

        <div className="text-center flex-1">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">时间</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatTime(run.time)}
          </p>
        </div>

        <div className="text-center flex-1">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">配速</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatPace(run.pace)}
          </p>
        </div>
      </div>

      {(onEdit || onDelete) && (
        <div className="flex justify-end space-x-2">
          {onEdit && (
            <button 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <Edit size={18} className="text-gray-600 dark:text-gray-400" />
            </button>
          )}
          {onDelete && (
            <button 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 size={18} className="text-red-500" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}