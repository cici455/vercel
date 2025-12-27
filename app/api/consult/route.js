import { NextResponse } from 'next/server';

// 注意：这里去掉了 ": Request"，因为这是 JS 文件
export async function POST(request) {
  // 1. 获取前端传来的数据
  const body = await request.json();
  const { firstName, lastName, date, time, city } = body;

  console.log("收到数据:", body);

  // ==========================================
  // 模拟后端逻辑
  // ==========================================
  
  const result = {
    firstName: firstName,
    sunSign: "Leo",          // 模拟算出来的星座
    moonSign: "Virgo",       // 模拟数据
    lifePath: "Number 1",    // 模拟数据
    message: `你好 ${firstName}, 星星已收到你的召唤 (来自后端 API)`
  };

  // 2. 把结果返回给前端
  return NextResponse.json(result);
}
