// app/api/calculate/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // 1. 获取前端传来的数据
  const body = await request.json();
  const { firstName, lastName, date, time, city } = body;

  console.log("收到数据:", body);

  // ==========================================
  // 【在这里写你的核心后端逻辑】
  // 比如：调用算命算法、查数据库、或者调用 OpenAI
  // ==========================================
  
  // 模拟一个复杂的计算过程
  const result = {
    sunSign: "Leo", // 比如这是你算出来的
    moonSign: "Virgo",
    luckyColor: "Gold",
    message: `你好 ${firstName}, 你的命运齿轮开始转动了...`
  };

  // 2. 把结果返回给前端
  return NextResponse.json(result);
}
