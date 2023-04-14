import { Inter } from 'next/font/google';
import { useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

type Item = {
  title: string;
  price: number;
  image: string;
};

interface HomeProps {
  data: Item[];
}

export default function Home() {
  const [data, setData] = useState<Item[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value);
  }

  async function handleSearch() {
    setIsLoading(true);
    const res = await fetch(`/api/search?q=${inputValue}`);
    const data = await res.json();
    console.log(data);
    setData(data);
    setIsLoading(false);
  }

  return (
    <div className='container flex mx-auto justify-center flex-col py-4'>
      <div>
        <input
          type='text'
          value={inputValue}
          className='h-11 bg-slate-300 rounded-sm'
          onChange={handleInputChange}
        />
        <button
          className='h-11 px-4 ml-4 rounded-sm bg-blue-900'
          onClick={handleSearch}
        >
          Buscar
        </button>
      </div>

      <div className='container flex flex-col'>
        {isLoading && <span>Carregando...</span>}
        {!isLoading &&
          data.map((item, index) => <span key={index}>{item.title}</span>)}
      </div>
    </div>
  );
}
