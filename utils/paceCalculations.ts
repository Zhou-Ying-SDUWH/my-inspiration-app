// 时间格式化：将秒数转换为 HH:MM:SS 格式
export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
};

// 时间解析：将 HH:MM:SS 格式转换为秒数
export const parseTime = (timeStr: string): number => {
  const parts = timeStr.split(':').map(Number);
  
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else {
    return 0;
  }
};

// 距离格式化：将公里数转换为合适的显示格式
export const formatDistance = (km: number): string => {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  } else {
    return `${km.toFixed(2)}km`;
  }
};

// 配速计算：根据距离和时间计算配速（秒/公里）
export const calculatePace = (distance: number, timeInSeconds: number): number => {
  if (distance <= 0) return 0;
  return Math.round(timeInSeconds / distance);
};

// 完成时间计算：根据距离和配速计算完成时间（秒）
export const calculateTime = (distance: number, paceInSeconds: number): number => {
  return Math.round(distance * paceInSeconds);
};

// 距离计算：根据时间和配速计算距离（公里）
export const calculateDistance = (timeInSeconds: number, paceInSeconds: number): number => {
  if (paceInSeconds <= 0) return 0;
  return parseFloat((timeInSeconds / paceInSeconds).toFixed(2));
};

// 配速格式化：将秒/公里转换为 MM:SS 格式
export const formatPace = (secondsPerKm: number): string => {
  const minutes = Math.floor(secondsPerKm / 60);
  const seconds = Math.floor(secondsPerKm % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}'/km`;
};

// 计算平均配速
export const calculateAveragePace = (runs: Array<{distance: number, time: number}>): number => {
  if (runs.length === 0) return 0;
  
  const totalDistance = runs.reduce((sum, run) => sum + run.distance, 0);
  const totalTime = runs.reduce((sum, run) => sum + run.time, 0);
  
  if (totalDistance === 0) return 0;
  return Math.round(totalTime / totalDistance);
};

// 计算总距离
export const calculateTotalDistance = (runs: Array<{distance: number}>): number => {
  return runs.reduce((sum, run) => sum + run.distance, 0);
};

// 计算总时间
export const calculateTotalTime = (runs: Array<{time: number}>): number => {
  return runs.reduce((sum, run) => sum + run.time, 0);
};

// 计算最长距离
export const calculateLongestDistance = (runs: Array<{distance: number}>): number => {
  if (runs.length === 0) return 0;
  return Math.max(...runs.map(run => run.distance));
};

// 计算最快配速
export const calculateFastestPace = (runs: Array<{pace: number}>): number => {
  if (runs.length === 0) return 0;
  return Math.min(...runs.map(run => run.pace));
};

// 计算本周距离
export const calculateWeeklyDistance = (runs: Array<{distance: number, date: string}>): number => {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  return runs
    .filter(run => {
      const runDate = new Date(run.date);
      return runDate >= startOfWeek;
    })
    .reduce((sum, run) => sum + run.distance, 0);
};

// 计算本月距离
export const calculateMonthlyDistance = (runs: Array<{distance: number, date: string}>): number => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  return runs
    .filter(run => {
      const runDate = new Date(run.date);
      return runDate >= startOfMonth;
    })
    .reduce((sum, run) => sum + run.distance, 0);
};