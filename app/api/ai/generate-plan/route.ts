import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// 初始化DeepSeek客户端
const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  baseURL: 'https://api.deepseek.com'
});

export async function POST(request: NextRequest) {
  try {
    // 获取请求体
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: '用户ID是必需的' }, { status: 400 });
    }

    // 从数据库获取用户的跑步历史记录
    console.log('Fetching runs for userId:', userId);
    
    // 使用模拟数据（实际应用中应该从数据库获取）
    const mockRuns = [
      {
        id: "9a5f2af7-c19a-48fc-92e0-af869c9ad98b",
        user_id: "f68e2505-2ae9-4bec-941f-aeb5dc2a88e5",
        name: "夜跑",
        date: "2025-12-31",
        distance: 20.26,
        time: 6360,
        pace: 314,
        created_at: "2025-12-31T08:50:00.543Z",
        updated_at: "2025-12-31T08:50:00.543Z"
      },
      {
        id: "8265376f-859a-4d7d-a859-68de304d80dc",
        user_id: "f68e2505-2ae9-4bec-941f-aeb5dc2a88e5",
        name: "早餐跑",
        date: "2025-12-31",
        distance: 10.00,
        time: 2760,
        pace: 276,
        created_at: "2025-12-31T08:50:00.714Z",
        updated_at: "2025-12-31T08:50:00.714Z"
      },
      {
        id: "0b004fba-7cd0-4252-bdd6-fb378c549b61",
        user_id: "f68e2505-2ae9-4bec-941f-aeb5dc2a88e5",
        name: "比赛",
        date: "2025-12-31",
        distance: 3.00,
        time: 720,
        pace: 240,
        created_at: "2025-12-31T09:23:17.889Z",
        updated_at: "2025-12-31T09:23:17.889Z"
      }
    ];
    
    // 过滤出当前用户的跑步记录
    const runs = mockRuns.filter(run => run.user_id === userId);
    
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
      duration: run.time, // 注意：数据库中的字段名是time，不是duration
      pace: run.pace,
      notes: '' // 添加空字符串作为notes字段的默认值
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

    // 调用DeepSeek API生成计划
    const completion = await deepseek.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: '你是一名专业的跑步教练，擅长根据用户的跑步历史数据制定个性化的训练计划。请始终以JSON格式返回训练计划。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
    });
    
    const text = completion.choices[0].message.content || '';
    
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

    return NextResponse.json({ 
      success: true,
      plan: planData,
      planId: 'mock-plan-id'
    });

  } catch (error) {
    console.error('生成跑步计划失败:', error);
    return NextResponse.json({ 
      error: '生成跑步计划失败',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
}