import { Box, Flex, Image, Input, Select, Spinner } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    axios.get(`${API_URL}/stores`).then((res) => {
      setStores(res.data);
    });
    axios.get(`${API_URL}/categories`).then((res) => {
      setCategories(res.data);
    });
  }, [setStores]);

  const onSubmit = (data) => {
    setLoading(true);
    axios
      .get(
        `${API_URL}/search?searchterm=${data.searchTerm}&categoryid=${
          data.categoryId
        }&storeid=${data.storeId || ''}`,
        { params: data }
      )
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      });
  };

  return (
    <Box maxW={1280} mx='auto'>
      <Flex
        onSubmit={handleSubmit(onSubmit)}
        as='form'
        alignItems='center'
        mt={8}
        mb={16}
        gap={4}
      >
        <Flex position='relative' width='100%'>
          <Select {...register('storeId')} placeholder='Selecione uma loja'>
            <option value=''>Todas</option>
            {stores.map((store) => (
              <option key={store.id} value={store.id}>
                {store.store}
              </option>
            ))}
          </Select>
        </Flex>
        <Flex position='relative' width='100%'>
          <Select
            {...register('categoryId', {
              required: 'Campo categoria obrigatório!',
            })}
            placeholder='Selecione uma categoria'
            isInvalid={errors.categoryId}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.category}
              </option>
            ))}
          </Select>
          {errors.categoryId && (
            <Box position='absolute' color='red' top={10}>
              {errors.categoryId.message}
            </Box>
          )}
        </Flex>
        <Flex position='relative' width='100%'>
          <Input
            {...register('searchTerm', {
              required: 'Termo de busca obrigatório!',
            })}
            placeholder='Digite um termo'
            isInvalid={errors.searchTerm}
          />
          {errors.searchTerm && (
            <Box position='absolute' color='red' top={10}>
              {errors.searchTerm.message}
            </Box>
          )}
        </Flex>
        <Box
          bg='blue'
          color='white'
          px={4}
          py={2}
          borderRadius='md'
          as='button'
          type='submit'
        >
          Buscar
        </Box>
      </Flex>
      <Flex flexWrap='wrap' justifyContent='space-between' gap={8}>
        {loading && (
          <Flex position='relative' width='full'>
            <Spinner
              thickness='4px'
              speed='0.65s'
              emptyColor='gray.200'
              color='blue.500'
              size='xl'
              left='50%'
              position='absolute'
            />
          </Flex>
        )}
        {!loading &&
          products.map((product) => (
            <Box
              key={product.id}
              bg='gray.200'
              w={{
                base: '100%',
                sm: 'calc(25% - 26.67px)',
                md: 'calc(33.33% - 21.33px)',
                lg: 'calc(50% - 16px)',
              }}
              p={4}
              borderRadius='md'
              display='flex'
              flexDirection='row'
            >
              <Box w='33.33%' h='100%' mr={4}>
                <Image
                  src={product.image}
                  h='100%'
                  w='100%'
                  objectFit='cover'
                />
              </Box>
              <Box w='66.67%' h='100%' display='flex' flexDirection='column'>
                <Box as='h2' fontSize='sm' fontWeight='bold' mb={2}>
                  {product.title}
                </Box>
                <Box flex='1' mb={2} overflow='hidden'>
                  {product.description}
                </Box>
                <Box
                  display='flex'
                  justifyContent='space-between'
                  alignItems='center'
                >
                  <Box as='span' fontSize='lg' fontWeight='bold' mr={2}>
                    {product.price}
                  </Box>
                  <Box
                    as='a'
                    href={product.link}
                    target='_blank'
                    bg='blue'
                    color='white'
                    px={4}
                    py={2}
                    borderRadius='md'
                  >
                    Ir para loja
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
      </Flex>
    </Box>
  );
}

export default App;
