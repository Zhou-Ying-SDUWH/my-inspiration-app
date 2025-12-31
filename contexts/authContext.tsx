'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser, SignIn, UserButton } from '@insforge/react';
import { dbAPI } from '@/services/dbAPI';

interface AuthContextType {
  user: any;
  isLoading: boolean;
  signIn: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 确保在客户端渲染
  useEffect(() => {
    setIsClient(true);
    // 模拟加载状态
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // 当用户登录时，将token保存到localStorage
  useEffect(() => {
    if (user && isClient) {
      // 这里需要获取用户的JWT token并保存到localStorage
      // 由于InsForge React SDK可能不直接提供token，我们需要其他方式获取
      // 这可能需要自定义实现或使用InsForge的其他方法
    }
  }, [user, isClient]);

  const signIn = () => {
    // 使用InsForge的SignIn组件或方法
    // 这里可能需要自定义实现
  };

  const signOut = () => {
    // 清除localStorage中的token
    if (isClient) {
      localStorage.removeItem('insforge_token');
    }
    // 使用InsForge的SignOut组件或方法
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// 导出InsForge的认证组件
export { SignIn, UserButton };