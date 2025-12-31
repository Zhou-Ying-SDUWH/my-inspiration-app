import { NextRequest, NextResponse } from 'next/server';
import { insforge } from '@/config/insforge';

export async function GET(request: NextRequest) {
  try {
    // 获取用户ID
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: '用户ID是必需的' }, { status: 400 });
    }

    // 从数据库获取用户已生成的计划
    const { data: plans, error } = await insforge
      .from('ai_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5); // 获取最近5个计划

    if (error) {
      console.error('获取跑步计划失败:', error);
      return NextResponse.json({ error: '获取跑步计划失败' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      plans: plans || []
    });

  } catch (error) {
    console.error('获取跑步计划失败:', error);
    return NextResponse.json({ 
      error: '获取跑步计划失败',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
}