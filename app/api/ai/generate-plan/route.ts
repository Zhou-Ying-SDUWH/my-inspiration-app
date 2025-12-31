import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { insforge } from '@/config/insforge';

// 获取Gemini API密钥
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    // 获取请求体
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: '用户ID是必需的' }, { status: 400 });
    }

    // 从数据库获取用户的跑步历史记录
    const { data: runs, error } = await insforge
      .from('runs')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      console.error('获取跑步记录失败:', error);
      return NextResponse.json({ error: '获取跑步记录失败' }, { status: 500 });
    }

    if (!runs || runs.length === 0) {
      return NextResponse.json({ 
        error: '没有足够的跑步记录来生成个性化计划',
        suggestion: '请先添加几条跑步记录，然后再尝试生成智能计划'
      }, { status: 400 });
    }

    // 准备用户跑步历史数据
    const runHistory = runs.map(run => ({
      date: run.date,
      distance: run.distance,
      duration: run.duration,
      pace: run.pace,
      notes: run.notes || ''
    }));

    // 计算一些统计数据
    const totalRuns = runHistory.length;
    const totalDistance = runHistory.reduce((sum, run) => sum + run.distance, 0);
    const avgDistance = totalDistance / totalRuns;
    const avgDuration = runHistory.reduce((sum, run) => sum + run.duration, 0) / totalRuns;
    
    // 获取最近一次跑步记录
    const latestRun = runHistory[0];
    
    // 构建提示词
    const prompt = `
作为一名专业的跑步教练，请根据以下用户跑步历史数据，生成一个个性化的下周跑步计划：

用户跑步历史数据：
- 总跑步次数：${totalRuns}次
- 总跑步距离：${totalDistance.toFixed(2)}公里
- 平均跑步距离：${avgDistance.toFixed(2)}公里
- 平均跑步时长：${Math.floor(avgDuration / 60)}分${(avgDuration % 60).toFixed(0)}秒
- 最近一次跑步：${latestRun.date}，距离${latestRun.distance}公里，时长${Math.floor(latestRun.duration / 60)}分${(latestRun.duration % 60).toFixed(0)}秒

最近5次跑步记录：
${runHistory.slice(0, 5).map((run, index) => 
  `${index + 1}. ${run.date}: ${run.distance}公里，${Math.floor(run.duration / 60)}分${(run.duration % 60).toFixed(0)}秒，配速${run.pace}/公里`
).join('\n')}

请生成一个包含7天的下周跑步计划，考虑以下几点：
1. 根据用户当前水平，适当增加强度和距离
2. 包含不同类型的跑步（轻松跑、间歇跑、长距离跑等）
3. 提供合理的休息日安排
4. 每次跑步提供具体的距离、时长和配速建议
5. 为每次跑步添加简短的训练目的说明

请以JSON格式返回，格式如下：
{
  "plan": [
    {
      "day": "周一",
      "type": "轻松跑",
      "distance": 5.0,
      "duration": 30,
      "pace": "6:00",
      "description": "恢复性跑步，保持轻松的节奏"
    },
    ...
  ],
  "summary": "本周训练计划总结",
  "tips": ["训练建议1", "训练建议2"]
}
`;

    // 调用Gemini API生成计划
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // 尝试解析JSON响应
    let planData;
    try {
      // 提取JSON部分（有时AI会返回额外的文本）
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        planData = JSON.parse(jsonMatch[0]);
      } else {
        planData = JSON.parse(text);
      }
    } catch (parseError) {
      console.error('解析AI响应失败:', parseError);
      // 如果解析失败，返回原始文本
      return NextResponse.json({ 
        error: '解析AI响应失败',
        rawResponse: text
      }, { status: 500 });
    }

    // 保存生成的计划到数据库
    const { data: savedPlan, error: saveError } = await insforge
      .from('ai_plans')
      .insert([
        {
          user_id: userId,
          plan_data: planData,
          created_at: new Date().toISOString(),
          runs_data: runHistory.slice(0, 10) // 保存最近10次跑步记录作为参考
        }
      ])
      .select();

    if (saveError) {
      console.error('保存计划失败:', saveError);
      // 即使保存失败，也返回生成的计划
    }

    return NextResponse.json({ 
      success: true,
      plan: planData,
      planId: savedPlan?.[0]?.id
    });

  } catch (error) {
    console.error('生成跑步计划失败:', error);
    return NextResponse.json({ 
      error: '生成跑步计划失败',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
}