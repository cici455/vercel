import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { firstName, lastName, date, time, city } = body;

  console.log("Received data:", body);

  const result = {
    firstName: firstName,
    sunSign: "Leo",
    moonSign: "Virgo",
    lifePath: "Number 1",
    message: `Hello ${firstName}, the stars have received your call!`
  };

  return NextResponse.json(result);
}
