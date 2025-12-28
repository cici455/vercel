import { redirect } from 'next/navigation';

export default function Home() {
  // 服务器端重定向到 index.html
  redirect('/index.html');
}
