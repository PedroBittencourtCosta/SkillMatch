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
  Flex,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiSearch, HiMail, HiAcademicCap, HiBriefcase } from 'react-icons/hi';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

// Opções de filtro
const SKILLS_DISPONIVEIS = [
  'Todas',
  'React',
  'JavaScript',
  'CSS',
  'Figma',
  'Python',
  'Django',
  'PostgreSQL',
  'Docker',
  'UI/UX',
  'Illustrator',
  'HTML',
  'Node.js',
  'MongoDB',
  'TypeScript',
  'Marketing Digital',
  'SEO',
  'Google Ads',
  'Canva',
];

const NIVEIS_FILTRO = ['Todos', 'Iniciante', 'Intermediário', 'Avançado'];
const DISPONIBILIDADE_FILTRO = ['Todos', 'Disponível', 'Em Projeto'];

export default function FreelancerFeed() {
  const { alunos, projetos } = useApp();
  const navigate = useNavigate();

  const [busca, setBusca] = useState('');
  const [skillFiltro, setSkillFiltro] = useState('Todas');
  const [nivelFiltro, setNivelFiltro] = useState('Todos');
  const [disponibilidade, setDisponibilidade] = useState('Todos');

  const alunosFiltrados = alunos.filter((a) => {
    if (busca && !a.nome.toLowerCase().includes(busca.toLowerCase())) return false;
    if (skillFiltro !== 'Todas' && !a.skills.includes(skillFiltro)) return false;
    if (nivelFiltro !== 'Todos' && a.nivel !== nivelFiltro) return false;
    if (disponibilidade !== 'Todos') {
      if (disponibilidade === 'Disponível' && a.em_projeto) return false;
      if (disponibilidade === 'Em Projeto' && !a.em_projeto) return false;
    }
    return true;
  });

  const getProjetosConcluidos = (alunoId) => {
    return projetos.filter(
      (p) => p.time.includes(alunoId) && p.status === 'concluido'
    ).length;
  };

  const getProjetosAtivos = (alunoId) => {
    return projetos.filter(
      (p) => p.time.includes(alunoId) && p.status === 'em_andamento'
    ).length;
  };

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
                <Heading fontSize="2xl" fontWeight="800">
                  Freelancers
                </Heading>
                <Badge colorScheme="cyan" borderRadius="full" px={2}>
                  {alunosFiltrados.length}
                </Badge>
              </HStack>
              <Text color="gray.400" fontSize="sm">
                Encontre desenvolvedores talentosos para seus projetos
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
                    placeholder="Buscar por nome..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    bg="rgba(255,255,255,0.04)"
                    border="1px solid rgba(255,255,255,0.08)"
                    borderRadius="xl"
                    _hover={{ borderColor: 'rgba(0,198,255,0.3)' }}
                    _focus={{ borderColor: 'cyan.500', boxShadow: 'none' }}
                  />
                </InputGroup>
                <Select
                  value={skillFiltro}
                  onChange={(e) => setSkillFiltro(e.target.value)}
                  {...selectStyles}
                >
                  {SKILLS_DISPONIVEIS.map((s) => (
                    <option key={s} value={s}>
                      {s === 'Todas' ? 'Todas as Skills' : s}
                    </option>
                  ))}
                </Select>
                <Select
                  value={nivelFiltro}
                  onChange={(e) => setNivelFiltro(e.target.value)}
                  {...selectStyles}
                >
                  {NIVEIS_FILTRO.map((n) => (
                    <option key={n} value={n}>
                      {n === 'Todos' ? 'Todos os Níveis' : n}
                    </option>
                  ))}
                </Select>
                <Select
                  value={disponibilidade}
                  onChange={(e) => setDisponibilidade(e.target.value)}
                  {...selectStyles}
                >
                  {DISPONIBILIDADE_FILTRO.map((d) => (
                    <option key={d} value={d}>
                      {d === 'Todos' ? 'Todas as Disponibilidades' : d}
                    </option>
                  ))}
                </Select>
              </SimpleGrid>
            </Box>
          </MotionBox>

          {/* Grid de Freelancers */}
          {alunosFiltrados.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {alunosFiltrados.map((aluno, i) => {
                const concluidos = getProjetosConcluidos(aluno.id);
                const ativos = getProjetosAtivos(aluno.id);

                return (
                  <MotionBox
                    key={aluno.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 + i * 0.05 }}
                  >
                    <Box
                      bg="rgba(26, 32, 44, 0.5)"
                      border="1px solid rgba(255,255,255,0.06)"
                      borderRadius="2xl"
                      p={6}
                      cursor="pointer"
                      transition="all 0.3s ease"
                      _hover={{
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 40px rgba(0, 128, 230, 0.15)',
                        borderColor: 'rgba(0, 198, 255, 0.3)',
                      }}
                      onClick={() => navigate(`/freelancer/${aluno.id}`)}
                      position="relative"
                      overflow="hidden"
                    >
                      {/* Glow accent */}
                      <Box
                        position="absolute"
                        top="-50%"
                        right="-50%"
                        w="200px"
                        h="200px"
                        bg="radial-gradient(circle, rgba(0,198,255,0.05), transparent)"
                        pointerEvents="none"
                      />

                      <VStack align="stretch" spacing={4}>
                        {/* Header com avatar e info */}
                        <Flex justify="space-between" align="start">
                          <HStack spacing={3}>
                            <Flex
                              w="50px"
                              h="50px"
                              bg="rgba(0,198,255,0.1)"
                              borderRadius="xl"
                              align="center"
                              justify="center"
                              fontSize="2xl"
                              border="1px solid rgba(0,198,255,0.15)"
                            >
                              {aluno.avatar}
                            </Flex>
                            <VStack align="start" spacing={0}>
                              <Text fontWeight="700" fontSize="md" color="white">
                                {aluno.nome}
                              </Text>
                              <HStack spacing={1}>
                                <HiAcademicCap
                                  size={12}
                                  color="var(--chakra-colors-gray-500)"
                                />
                                <Text fontSize="xs" color="gray.500">
                                  {aluno.nivel}
                                </Text>
                              </HStack>
                            </VStack>
                          </HStack>
                          <Badge
                            colorScheme={aluno.em_projeto ? 'yellow' : 'green'}
                            borderRadius="full"
                            px={2}
                            py={0.5}
                            fontSize="9px"
                          >
                            {aluno.em_projeto ? 'Em Projeto' : 'Disponível'}
                          </Badge>
                        </Flex>

                        {/* Bio */}
                        <Text fontSize="sm" color="gray.400" noOfLines={2}>
                          {aluno.bio}
                        </Text>

                        {/* Skills */}
                        <HStack spacing={1.5} flexWrap="wrap" gap={1}>
                          {aluno.skills.map((s) => (
                            <Badge
                              key={s}
                              bg="rgba(0, 198, 255, 0.1)"
                              color="cyan.300"
                              borderRadius="full"
                              px={2}
                              py={0.5}
                              fontSize="xs"
                              fontWeight="500"
                            >
                              {s}
                            </Badge>
                          ))}
                        </HStack>

                        {/* Footer stats */}
                        <Flex
                          justify="space-between"
                          align="center"
                          pt={3}
                          borderTop="1px solid rgba(255,255,255,0.04)"
                        >
                          <HStack spacing={4}>
                            <HStack spacing={1}>
                              <HiBriefcase
                                size={14}
                                color="var(--chakra-colors-gray-500)"
                              />
                              <Text fontSize="xs" color="gray.400">
                                {concluidos} concluído{concluidos !== 1 ? 's' : ''}
                              </Text>
                            </HStack>
                            {ativos > 0 && (
                              <HStack spacing={1}>
                                <Box w="6px" h="6px" borderRadius="full" bg="yellow.400" />
                                <Text fontSize="xs" color="gray.400">
                                  {ativos} ativo{ativos !== 1 ? 's' : ''}
                                </Text>
                              </HStack>
                            )}
                          </HStack>
                          <HStack spacing={1}>
                            <HiMail size={14} color="var(--chakra-colors-cyan-400)" />
                            <Text fontSize="xs" color="cyan.400">
                              Contato
                            </Text>
                          </HStack>
                        </Flex>
                      </VStack>
                    </Box>
                  </MotionBox>
                );
              })}
            </SimpleGrid>
          ) : (
            <VStack py={16} spacing={4}>
              <Text fontSize="4xl">🔍</Text>
              <Text color="gray.500" fontSize="sm">
                Nenhum freelancer encontrado com esses filtros.
              </Text>
            </VStack>
          )}
        </VStack>
      </Container>
    </Box>
  );
}
