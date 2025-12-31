import { createClient } from '@insforge/sdk';

const insforgeUrl = process.env.NEXT_PUBLIC_INSFORGE_URL || 'https://q7crgduz.us-west.insforge.app';
const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5MTIwMTV9.zcfNvjx7mHkRL__jqBssMSHkDKsD_ieG3sdEUFVN4TU';

// 客户端实例（用于前端）
export const insforge = createClient({
  baseUrl: insforgeUrl,
  anonKey: anonKey,
});

// 服务端实例（用于API路由）
export const insforgeAdmin = createClient({
  baseUrl: insforgeUrl,
  anonKey: anonKey,
});