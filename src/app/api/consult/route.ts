import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { firstName, lastName, date, time, city } = body;

  console.log("收到数据:", body);

  const result = {
    firstName: firstName,
    sunSign: "Leo",
    moonSign: "Virgo",
    lifePath: "Number 1",
    message: `你好 ${firstName}, 星星已收到你的召唤！`
  };

  return NextResponse.json(result);
}
