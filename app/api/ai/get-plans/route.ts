import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: '用户ID未提供' },
        { status: 400 }
      );
    }
    
    // 返回空数组，表示没有保存的计划
    // 这将触发前端组件调用generate-plan API
    return NextResponse.json({ plans: [] });
  } catch (error) {
    console.error('获取计划时发生错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}