import { Inter } from 'next/font/google';
import { useState } from 'react';
import ProductCard from '../components/ProductCard';

const inter = Inter({ subsets: ['latin'] });

type Item = {
  title: string;
  price: string;
  image: string;
  description: string;
  link: string;
};

export default function Home() {
  const [data, setData] = useState<Item[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value);
  }

  async function handleSearch() {
    setIsLoading(true);
    const res = await fetch(`/api/search?searchterm=${inputValue}`);
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

      <div className='container flex gap-4 flex-wrap'>
        {isLoading && <span>Carregando...</span>}
        {!isLoading &&
          data.map((item, index) => (
            <ProductCard
              key={index}
              description={item.description}
              imageSrc={item.image}
              name={item.title}
              price={item.price}
              link={item.link}
            />
          ))}
      </div>
    </div>
  );
}
