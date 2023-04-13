import { Inter } from 'next/font/google';
import Image from 'next/image';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const handleFetch = async () => {
    const res = await fetch('/api/hello?term=iphone');
    const data = await res.json();
    console.log(data);
  };

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <button onClick={handleFetch}>TESTE</button>
    </main>
  );
}
