import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { mode } = body;

    // --- 🚨 模拟模式 (Mock Mode) ---
    // 如果你还没有在 .env.local 里填 API Key，就会运行这段代码
    if (!process.env.DIFY_API_KEY) {
        console.log("⚠️ 未检测到 API Key，使用模拟数据模式");
        
        // 模拟延时 (假装在思考)
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (mode === 'solo') {
            return NextResponse.json([
                {
                    role: "sun",
                    archetype: "The Strategist",
                    icon: "☀️",
                    content: "[模拟数据] 我是你的理性大脑。根据星盘，我认为你不应该现在离职，因为土星正在刑克你的事业宫，风险太大。建议再苟三个月。"
                }
            ]);
        } else {
            return NextResponse.json([
                {
                    role: "moon",
                    archetype: "The Oracle",
                    icon: "🌙",
                    content: "[模拟数据] 别听理性的。我感觉到你内心的枯竭，继续待下去你的灵魂会死掉。我们需要滋养。"
                },
                {
                    role: "rising",
                    archetype: "The Alchemist",
                    icon: "🏹",
                    content: "[模拟数据] 方案如下：不要裸辞，利用每天下班后的2小时开始做副业。这是平衡安全感与自由的最佳公式。"
                }
            ]);
        }
    }

    // --- ✅ 真实模式 (Real Dify Mode) ---
    // 等你填了 Key，就会自动运行这里
    const payload = {
      inputs: {
        sun_sign: body.sun,
        moon_sign: body.moon,
        rising_sign: body.rising,
        user_query: body.query,
        mode: body.mode,
        strategist_context: body.context || "",
        // 传递用户原始数据，供后端计算星盘使用
        user_data: body.userData || {}
      },
      response_mode: "blocking",
      user: "user-lumina-001"
    };

    const response = await fetch(`${process.env.DIFY_API_URL}/workflows/run`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DIFY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Dify connection failed');
    const data = await response.json();
    const rawResult = data.data.outputs.json_output;
    return NextResponse.json(JSON.parse(rawResult));

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: "Service Error" }, { status: 500 });
  }
}