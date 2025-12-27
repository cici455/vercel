import { NextResponse } from 'next/server';

export async function POST(request) {
  // 注意：这里没有 ": Request"，纯 JS 写法
  const body = await request.json();
  const { firstName, lastName, date, time, city } = body;

  console.log("收到数据:", body);

  const result = {
    firstName: firstName,
    sunSign: "Leo",          
    moonSign: "Virgo",       
    lifePath: "Number 1",    
    message: `你好 ${firstName}, 后端连接成功！`
  };

  return NextResponse.json(result);
}
