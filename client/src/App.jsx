import { Box, Container, Flex, Input, Select } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/stores`).then((res) => {
      setStores(res.data);
    });
    axios.get(`${API_URL}/categories`).then((res) => {
      setCategories(res.data);
    });
  }, [setStores]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClick = () => {
    axios
      .get(
        `${API_URL}/search?searchterm=${form.searchTerm}&categoryid=${form.categoryId}&storeid${form.storeId}`,
        { params: form }
      )
      .then((res) => {
        setProducts(res.data);
      });
  };

  return (
    <Box maxW={1280} mx='auto'>
      <Flex alignItems='center' my={4}>
        <Select
          onChange={handleChange}
          name='storeId'
          placeholder='Selecione uma loja'
          mx={4}
        >
          <option value=''>Todas</option>
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.store}
            </option>
          ))}
        </Select>
        <Select
          onChange={handleChange}
          name='categoryId'
          placeholder='Selecione uma categoria'
          mx={4}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.category}
            </option>
          ))}
        </Select>
        <Input
          onChange={handleChange}
          name='searchTerm'
          placeholder='Digite um termo'
          mx={4}
        />
        <Box
          onClick={handleClick}
          bg='blue'
          color='white'
          px={4}
          py={2}
          borderRadius='md'
        >
          Buscar
        </Box>
      </Flex>
      <Container maxW='container.xl'>
        <Flex flexWrap='wrap'>
          {products.map((product) => (
            <Box
              key={product.id}
              bg='gray.200'
              w={{ base: '100%', sm: '50%', md: '33%', lg: '25%' }}
              p={4}
              borderRadius='md'
              my={4}
            >
              {product.title}
            </Box>
          ))}
        </Flex>
      </Container>
    </Box>
  );
}

export default App;
