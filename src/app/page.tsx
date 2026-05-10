"use client";

import React, { useState } from "react";


// 这是前端页面：课程销售页 + 视频观看页。
// 当前使用 Stripe Payment Link MVP 版：
// 1. 前言视频公开播放
// 2. 用户点击付费按钮时，直接跳转到 Stripe Payment Link
// 3. Stripe 支付成功后，建议在 Stripe 后台设置跳回：你的网站域名/?watch=1&paid=1
// 4. 页面检测到 paid=1 后进入观看页并切换为全集模式
// 5. 正式上线时，paidAccess 不能只靠 URL 参数，后续再升级成 webhook + 数据库 + 登录系统

const COURSE = {
  brandName: "Course Studio",
  title: "你的课程标题",
  subtitle: "先看免费前言，确认内容适合你之后，再付费解锁完整视频。",
  description:
    "这是一套围绕具体问题展开的视频课程。页面不做复杂设计，重点是让用户快速理解课程价值、观看前言，并完成付费解锁。",
  price: "¥199",
  originalPrice: "¥399",
  previewVideoUrl:
    "https://player.mediadelivery.net/embed/657194/8493f941-1d70-421a-904f-78629c12bcce?autoplay=false&loop=false&muted=false&preload=true&responsive=true",
  paidVideoUrl: "",
  stripePaymentUrl: "https://buy.stripe.com/28E28s2p2f9Y04v98AbMQ01",
  supportText: "购买后可观看完整视频内容。",
};

const lessons = [
  { id: 1, title: "前言：这套视频适合谁", duration: "08:32", free: true },
  { id: 2, title: "第一部分：核心问题与底层逻辑", duration: "23:18", free: false },
  { id: 3, title: "第二部分：完整方法拆解", duration: "31:04", free: false },
  { id: 4, title: "第三部分：实战案例与关键细节", duration: "27:46", free: false },
  { id: 5, title: "第四部分：完整流程演示", duration: "42:10", free: false },
  { id: 6, title: "第五部分：总结与下一步行动", duration: "18:55", free: false },
];

function runSmokeTests() {
  const results = [
    {
      name: "课程必须至少有一个免费试看章节",
      pass: lessons.some((lesson) => lesson.free),
    },
    {
      name: "每个课程章节必须有唯一 id",
      pass: new Set(lessons.map((lesson) => lesson.id)).size === lessons.length,
    },
    {
      name: "前言视频链接不能为空",
      pass: typeof COURSE.previewVideoUrl === "string" && COURSE.previewVideoUrl.length > 0,
    },
    {
      name: "课程标题不能为空",
      pass: typeof COURSE.title === "string" && COURSE.title.trim().length > 0,
    },
    {
      name: "课程目录不能为空",
      pass: Array.isArray(lessons) && lessons.length > 0,
    },
  ];

  if (typeof console !== "undefined") {
    results.forEach((test) => {
      if (!test.pass) console.warn(`[Smoke Test Failed] ${test.name}`);
    });
  }

  return results.every((test) => test.pass);
}

runSmokeTests();

function getInitialPage() {
  if (typeof window === "undefined") return "landing";
  const params = new URLSearchParams(window.location.search);
  return params.get("watch") === "1" || params.get("paid") === "1" ? "watch" : "landing";
}

function getInitialPaidAccess() {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  return params.get("paid") === "1" || params.get("success") === "true";
}

function Icon({ name, className = "h-5 w-5" }) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };

  const icons = {
    lock: (
      <svg {...common}>
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </svg>
    ),
    play: (
      <svg {...common}>
        <circle cx="12" cy="12" r="10" />
        <path d="M10 8l6 4-6 4V8z" fill="currentColor" stroke="none" />
      </svg>
    ),
    check: (
      <svg {...common}>
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12.5l2.5 2.5L16 9" />
      </svg>
    ),
    card: (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18" />
        <path d="M7 15h3" />
      </svg>
    ),
    arrow: (
      <svg {...common}>
        <path d="M19 12H5" />
        <path d="M12 19l-7-7 7-7" />
      </svg>
    ),
  };

  return icons[name] || icons.check;
}

function VideoFrame({ paidAccess, paidVideoUrl }) {
  const videoUrl = paidAccess ? paidVideoUrl || COURSE.paidVideoUrl : COURSE.previewVideoUrl;
  const title = paidAccess ? "全集合集" : "免费前言试看";
  const emptyTitle = paidAccess ? "全集合集链接待接入" : "前言视频链接待接入";
  const emptyDescription = paidAccess
    ? "后端已经确认你有权限，但还没有配置付费合集视频链接。"
    : "免费前言视频链接还没有接入。";

  return (
    <div className="overflow-hidden rounded-[2rem] bg-zinc-950 shadow-2xl ring-1 ring-black/10">
      <div className="relative aspect-video">
        {videoUrl ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={videoUrl}
            title={title}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-950 px-6 text-center text-white">
            <div>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                <Icon name="lock" className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold">{emptyTitle}</h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-zinc-400">{emptyDescription}</p>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-white/10 bg-zinc-950/95 p-5 text-white">
        <p className="text-sm text-zinc-400">当前播放</p>
        <div className="mt-1 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h3 className="text-xl font-bold">{title}</h3>
          <span className="w-fit rounded-full bg-white/10 px-4 py-2 text-sm text-zinc-200">
            {paidAccess ? "已解锁全集" : "当前为免费试看"}
          </span>
        </div>
      </div>
    </div>
  );
}

function WatchLessonRow({ lesson, paidAccess }) {
  const unlocked = lesson.free || paidAccess;

  return (
    <div className={`flex items-center justify-between rounded-2xl border p-4 ${unlocked ? "border-zinc-200 bg-white" : "border-zinc-200 bg-zinc-50"}`}>
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${unlocked ? "bg-zinc-950 text-white" : "bg-zinc-200 text-zinc-500"}`}>
          {unlocked ? <Icon name="play" className="h-5 w-5" /> : <Icon name="lock" className="h-5 w-5" />}
        </div>
        <div>
          <div className="font-semibold text-zinc-950">{lesson.title}</div>
          <div className="mt-0.5 text-sm text-zinc-500">{lesson.duration}</div>
        </div>
      </div>
      <div className="text-sm font-medium text-zinc-500">{unlocked ? "可看" : "锁定"}</div>
    </div>
  );
}

function LandingPage({ onOpenPreview, onBuy, checkoutLoading }) {
  return (
    <main>
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-[1.05fr_0.95fr] md:items-center md:py-20">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white/70 px-4 py-2 text-sm font-medium text-zinc-700">
            <Icon name="check" className="h-4 w-4" />
            免费看前言，付费看完整视频
          </div>

          <h1 className="text-4xl font-black leading-tight tracking-tight md:text-6xl">{COURSE.title}</h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">{COURSE.subtitle}</p>

          <p className="mt-4 max-w-2xl leading-7 text-zinc-600">{COURSE.description}</p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <button
              onClick={onOpenPreview}
              className="rounded-full bg-zinc-950 px-7 py-4 text-center font-semibold text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-zinc-800"
            >
              先看免费前言
            </button>
            <button
              onClick={onBuy}
              disabled={checkoutLoading}
              className="rounded-full border border-zinc-300 bg-white px-7 py-4 font-semibold text-zinc-950 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {checkoutLoading ? "正在跳转支付..." : `付费解锁 ${COURSE.price}`}
            </button>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-zinc-200">
          <h2 className="text-2xl font-black tracking-tight">看完前言后再决定</h2>
          <p className="mt-3 leading-7 text-zinc-600">
            点击左侧按钮会进入完整观看界面。未付费时播放前言；付费完成后进入同一个界面，但视频会切换成全集合集。
          </p>
          <div className="mt-6 rounded-3xl bg-zinc-950 p-6 text-white">
            <div className="flex items-center gap-3">
              <Icon name="card" className="h-6 w-6" />
              <h3 className="text-xl font-bold">解锁完整视频</h3>
            </div>
            <div className="mt-5 flex items-end gap-3">
              <span className="text-4xl font-black">{COURSE.price}</span>
              <span className="pb-1 text-zinc-400 line-through">{COURSE.originalPrice}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-400">{COURSE.supportText}</p>
            <button
              onClick={onBuy}
              disabled={checkoutLoading}
              className="mt-6 w-full rounded-2xl bg-white px-5 py-3 font-bold text-zinc-950 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {checkoutLoading ? "正在跳转支付..." : "跳转 Stripe 支付"}
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16">
        <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="text-3xl font-black tracking-tight md:text-4xl">课程目录</h2>
            <p className="mt-4 leading-7 text-zinc-600">先免费观看前言。确认内容适合后，完成支付即可在同一个观看界面解锁全集合集。</p>
          </div>
          <div className="space-y-3">
            {lessons.map((lesson) => (
              <WatchLessonRow key={lesson.id} lesson={lesson} paidAccess={false} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function WatchPage({ paidAccess, paidVideoUrl, accessLoading, onBack, onBuy, checkoutLoading }) {
  return (
    <main className="mx-auto max-w-7xl px-5 py-8 md:py-12">
      <button onClick={onBack} className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50">
        <Icon name="arrow" className="h-4 w-4" />
        返回介绍页
      </button>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          {accessLoading ? (
            <div className="flex aspect-video items-center justify-center rounded-[2rem] bg-white text-zinc-500 shadow-xl ring-1 ring-zinc-200">
              正在检查观看权限...
            </div>
          ) : (
            <VideoFrame paidAccess={paidAccess} paidVideoUrl={paidVideoUrl} />
          )}

          {!paidAccess && !accessLoading && (
            <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black tracking-tight">喜欢这个前言？</h2>
              <p className="mt-3 leading-7 text-zinc-600">
                付费后会回到这个观看界面，后端确认付款后，播放器会自动切换为完整合集。
              </p>
              <button
                onClick={onBuy}
                disabled={checkoutLoading}
                className="mt-5 rounded-full bg-zinc-950 px-7 py-4 font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {checkoutLoading ? "正在跳转支付..." : `付费解锁全集 ${COURSE.price}`}
              </button>
            </div>
          )}
        </div>

        <aside className="rounded-[2rem] bg-white p-5 shadow-xl ring-1 ring-zinc-200 lg:sticky lg:top-6 lg:h-fit">
          <div className="mb-5">
            <p className="text-sm font-semibold text-zinc-500">课程目录</p>
            <h2 className="mt-1 text-2xl font-black">{paidAccess ? "全集已解锁" : "试看模式"}</h2>
          </div>

          <div className="space-y-3">
            {lessons.map((lesson) => (
              <WatchLessonRow key={lesson.id} lesson={lesson} paidAccess={paidAccess} />
            ))}
          </div>

          {!paidAccess && (
            <button
              onClick={onBuy}
              disabled={checkoutLoading}
              className="mt-5 w-full rounded-2xl bg-zinc-950 px-5 py-3 font-bold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {checkoutLoading ? "正在跳转..." : "解锁全集"}
            </button>
          )}
        </aside>
      </div>
    </main>
  );
}

export default function VideoCoursePaywallSite() {
  const [page, setPage] = useState(getInitialPage);
  const [paidAccess, setPaidAccess] = useState(getInitialPaidAccess);
  const [paidVideoUrl, setPaidVideoUrl] = useState("");
  const [accessLoading, setAccessLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  function handleBuy() {
    setCheckoutLoading(true);
    window.location.href = COURSE.stripePaymentUrl;
  }

  return (
    <div className="min-h-screen bg-[#f7f4ef] text-zinc-950">
      {page === "watch" ? (
        <WatchPage
          paidAccess={paidAccess}
          paidVideoUrl={paidVideoUrl}
          accessLoading={accessLoading}
          onBack={() => setPage("landing")}
          onBuy={handleBuy}
          checkoutLoading={checkoutLoading}
        />
      ) : (
        <LandingPage onOpenPreview={() => setPage("watch")} onBuy={handleBuy} checkoutLoading={checkoutLoading} />
      )}

      <footer className="border-t border-zinc-200 px-5 py-10 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} {COURSE.brandName}. All rights reserved.
      </footer>
    </div>
  );
}
