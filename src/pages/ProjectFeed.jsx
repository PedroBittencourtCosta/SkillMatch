import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  Badge,
} from '@chakra-ui/react';
import { useState } from 'react';
import { HiSearch } from 'react-icons/hi';
import { useApp } from '../context/AppContext';
import { CATEGORIAS, NIVEIS, TIPOS } from '../data/mockData';
import ProjectCard from '../components/ProjectCard';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export default function ProjectFeed() {
  const { projetos } = useApp();
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('Todas');
  const [nivel, setNivel] = useState('Todos');
  const [tipo, setTipo] = useState('Todos');

  const projetosFiltrados = projetos.filter((p) => {
    if (busca && !p.titulo.toLowerCase().includes(busca.toLowerCase())) return false;
    if (categoria !== 'Todas' && p.categoria !== categoria) return false;
    if (nivel !== 'Todos' && p.nivel_requerido !== nivel) return false;
    if (tipo !== 'Todos') {
      if (tipo === 'Individual' && p.vagas > 1) return false;
      if (tipo === 'Time' && p.vagas <= 1) return false;
    }
    return true;
  });

  const selectStyles = {
    bg: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 'xl',
    size: 'sm',
    _hover: { borderColor: 'rgba(0,198,255,0.3)' },
    _focus: { borderColor: 'cyan.500', boxShadow: 'none' },
  };

  return (
    <Box minH="calc(100vh - 70px)" py={8}>
      <Container maxW="1200px">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <VStack align="start" spacing={2}>
              <HStack>
                <Heading fontSize="2xl" fontWeight="800">Projetos</Heading>
                <Badge colorScheme="cyan" borderRadius="full" px={2}>
                  {projetosFiltrados.length}
                </Badge>
              </HStack>
              <Text color="gray.400" fontSize="sm">
                Encontre projetos que combinam com suas habilidades
              </Text>
            </VStack>
          </MotionBox>

          {/* Filtros */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Box
              bg="rgba(26, 32, 44, 0.5)"
              border="1px solid rgba(255,255,255,0.06)"
              borderRadius="2xl"
              p={4}
            >
              <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={3}>
                <InputGroup size="sm">
                  <InputLeftElement pointerEvents="none">
                    <HiSearch color="gray" />
                  </InputLeftElement>
                  <Input
                    placeholder="Buscar projetos..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    bg="rgba(255,255,255,0.04)"
                    border="1px solid rgba(255,255,255,0.08)"
                    borderRadius="xl"
                    _hover={{ borderColor: 'rgba(0,198,255,0.3)' }}
                    _focus={{ borderColor: 'cyan.500', boxShadow: 'none' }}
                  />
                </InputGroup>
                <Select value={categoria} onChange={(e) => setCategoria(e.target.value)} {...selectStyles}>
                  {CATEGORIAS.map((c) => (
                    <option key={c} value={c}>
                      {c === 'Todas' ? 'Todas as Categorias' : c}
                    </option>
                  ))}
                </Select>
                <Select value={nivel} onChange={(e) => setNivel(e.target.value)} {...selectStyles}>
                  {NIVEIS.map((n) => (
                    <option key={n} value={n}>
                      {n === 'Todos' ? 'Todos os Níveis' : n}
                    </option>
                  ))}
                </Select>
                <Select value={tipo} onChange={(e) => setTipo(e.target.value)} {...selectStyles}>
                  {TIPOS.map((t) => (
                    <option key={t} value={t}>
                      {t === 'Todos' ? 'Todos os Tipos' : t}
                    </option>
                  ))}
                </Select>
              </SimpleGrid>
            </Box>
          </MotionBox>

          {/* Grid de Projetos */}
          {projetosFiltrados.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {projetosFiltrados.map((projeto, i) => (
                <MotionBox
                  key={projeto.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 + i * 0.05 }}
                >
                  <ProjectCard projeto={projeto} />
                </MotionBox>
              ))}
            </SimpleGrid>
          ) : (
            <VStack py={16} spacing={4}>
              <Text fontSize="4xl">🔍</Text>
              <Text color="gray.500" fontSize="sm">Nenhum projeto encontrado com esses filtros.</Text>
            </VStack>
          )}
        </VStack>
      </Container>
    </Box>
  );
}
