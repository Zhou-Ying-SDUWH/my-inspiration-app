'use client';

import React from 'react';
import { useUser } from '@insforge/react';

export function CustomUserButton() {
  const { user, signOut } = useUser();

  const handleSignOut = () => {
    signOut();
  };

  if (!user) return null;

  // 从profile中获取用户信息
  const userName = user.profile?.name || '';
  const userAvatar = user.profile?.avatar_url || '';
  const userEmail = user.email;

  return (
    <div className="relative group">
      <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors">
        {userAvatar ? (
          <img 
            src={userAvatar} 
            alt="User Avatar" 
            className="w-full h-full rounded-full object-cover"
            onError={(e) => {
              // 如果图片加载失败，显示用户名的首字母
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = userName ? userName.charAt(0).toUpperCase() : userEmail.charAt(0).toUpperCase();
                parent.className = "flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white font-semibold";
              }
            }}
          />
        ) : (
          <span className="text-white font-semibold">
            {userName ? userName.charAt(0).toUpperCase() : userEmail.charAt(0).toUpperCase()}
          </span>
        )}
      </button>
      
      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 invisible group-hover:visible">
        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {userName || '用户'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {userEmail}
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          退出登录
        </button>
      </div>
    </div>
  );
}