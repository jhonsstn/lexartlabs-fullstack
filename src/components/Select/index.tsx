import React from 'react';

type SelectProps = {
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

const Select: React.FC<SelectProps> = ({ onChange }) => {
  return (
    <select
      className='block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
      onChange={onChange}
    >
      <option value='1'>Geladeira</option>
      <option value='2'>TV</option>
      <option value='3'>Celular</option>
    </select>
  );
};

export default Select;
