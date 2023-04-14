import Image from 'next/image';
import React from 'react';

type ProductCardProps = {
  imageSrc: string;
  name: string;
  description: string;
  price: string;
  link: string;
};

const ProductCard: React.FC<ProductCardProps> = ({
  imageSrc,
  name,
  description,
  price,
  link,
}) => {
  return (
    <div className='max-w-sm rounded overflow-hidden shadow-lg'>
      <Image
        width={320}
        height={240}
        src={imageSrc}
        alt={name}
        className='w-full h-64 object-cover'
      />
      <div className='px-6 py-4'>
        <div className='font-bold text-xl mb-2'>{name}</div>
        <p className='text-gray-700 text-base'>{description}</p>
      </div>
      <div className='px-6 py-4 flex justify-between items-center'>
        <span className='text-gray-600 text-lg font-medium'>${price}</span>
        <a
          href={link}
          target='_blank'
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        >
          Ir para Web
        </a>
      </div>
    </div>
  );
};

export default ProductCard;
