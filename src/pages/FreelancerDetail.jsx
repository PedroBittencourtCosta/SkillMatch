import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Badge,
  Flex,
  Button,
  Divider,
  Image,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  HiArrowLeft,
  HiAcademicCap,
  HiMail,
  HiBriefcase,
  HiExternalLink,
  HiCode,
  HiStatusOnline,
} from 'react-icons/hi';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export default function FreelancerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { alunos, projetos, getEmpresa } = useApp();

  const aluno = alunos.find((a) => a.id === id);

  if (!aluno) {
    return (
      <Box minH="calc(100vh - 70px)" py={16}>
        <Container maxW="800px">
          <VStack spacing={6} py={20}>
            <Text fontSize="5xl">😕</Text>
            <Heading fontSize="xl" fontWeight="700">
              Freelancer não encontrado
            </Heading>
            <Text color="gray.400" fontSize="sm">
              O perfil que você está procurando não existe.
            </Text>
            <Button
              variant="ghost"
              leftIcon={<HiArrowLeft />}
              onClick={() => navigate('/freelancers')}
              color="cyan.400"
              size="sm"
            >
              Voltar para Freelancers
            </Button>
          </VStack>
        </Container>
      </Box>
    );
  }

  // Projetos na plataforma (time)
  const projetosParticipados = projetos.filter((p) => p.time.includes(aluno.id));
  const projetosConcluidos = projetosParticipados.filter((p) => p.status === 'concluido');
  const projetosAtivos = projetosParticipados.filter((p) => p.status === 'em_andamento');
  const projetosAbertos = projetosParticipados.filter((p) => p.status === 'aberto');

  // Portfolio externo
  const portfolioExterno = aluno.portfolio_externo || [];

  // Stats
  const totalProjetos = projetosParticipados.length + portfolioExterno.length;

  const statusColors = {
    aberto: 'green',
    em_andamento: 'yellow',
    concluido: 'blue',
  };

  const statusLabels = {
    aberto: 'Aberto',
    em_andamento: 'Em Andamento',
    concluido: 'Concluído',
  };

  return (
    <Box minH="calc(100vh - 70px)" py={8}>
      <Container maxW="900px">
        <VStack spacing={8} align="stretch">
          {/* Botão Voltar */}
          <MotionBox
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="ghost"
              leftIcon={<HiArrowLeft />}
              onClick={() => navigate('/freelancers')}
              color="gray.400"
              size="sm"
              _hover={{ color: 'cyan.400' }}
            >
              Voltar para Freelancers
            </Button>
          </MotionBox>

          {/* Header do perfil */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box
              bg="rgba(26, 32, 44, 0.5)"
              border="1px solid rgba(255,255,255,0.06)"
              borderRadius="2xl"
              p={8}
              position="relative"
              overflow="hidden"
            >
              {/* Glow decorativo */}
              <Box
                position="absolute"
                top="-100px"
                right="-100px"
                w="300px"
                h="300px"
                bg="radial-gradient(circle, rgba(0,198,255,0.08), transparent)"
                pointerEvents="none"
              />

              <Flex
                direction={{ base: 'column', md: 'row' }}
                gap={6}
                align={{ base: 'center', md: 'start' }}
              >
                {/* Avatar grande */}
                <Flex
                  w="90px"
                  h="90px"
                  bg="rgba(0,198,255,0.1)"
                  borderRadius="2xl"
                  align="center"
                  justify="center"
                  fontSize="4xl"
                  border="2px solid rgba(0,198,255,0.2)"
                  flexShrink={0}
                >
                  {aluno.avatar}
                </Flex>

                {/* Info principal */}
                <VStack
                  align={{ base: 'center', md: 'start' }}
                  spacing={3}
                  flex={1}
                  textAlign={{ base: 'center', md: 'left' }}
                >
                  <VStack align={{ base: 'center', md: 'start' }} spacing={1}>
                    <Heading fontSize="2xl" fontWeight="800">
                      {aluno.nome}
                    </Heading>
                    <HStack spacing={3}>
                      <HStack spacing={1}>
                        <HiAcademicCap size={14} color="var(--chakra-colors-gray-400)" />
                        <Text fontSize="sm" color="gray.400">
                          {aluno.nivel}
                        </Text>
                      </HStack>
                      <Badge
                        colorScheme={aluno.em_projeto ? 'yellow' : 'green'}
                        borderRadius="full"
                        px={2}
                        py={0.5}
                        fontSize="xs"
                      >
                        {aluno.em_projeto ? 'Em Projeto' : 'Disponível'}
                      </Badge>
                    </HStack>
                  </VStack>

                  <Text fontSize="sm" color="gray.300" maxW="500px">
                    {aluno.bio}
                  </Text>

                  {/* E-mail */}
                  <HStack spacing={2}>
                    <HiMail size={14} color="var(--chakra-colors-cyan-400)" />
                    <Text fontSize="sm" color="cyan.400">
                      {aluno.email}
                    </Text>
                  </HStack>
                </VStack>
              </Flex>

              {/* Stats resumidas */}
              <SimpleGrid
                columns={{ base: 2, sm: 4 }}
                spacing={4}
                mt={6}
                pt={6}
                borderTop="1px solid rgba(255,255,255,0.06)"
              >
                <VStack spacing={0}>
                  <Text fontSize="xl" fontWeight="800" color="cyan.400">
                    {aluno.skills.length}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    Skills
                  </Text>
                </VStack>
                <VStack spacing={0}>
                  <Text fontSize="xl" fontWeight="800" color="cyan.400">
                    {totalProjetos}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    Projetos
                  </Text>
                </VStack>
                <VStack spacing={0}>
                  <Text fontSize="xl" fontWeight="800" color="green.400">
                    {projetosConcluidos.length}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    Concluídos
                  </Text>
                </VStack>
                <VStack spacing={0}>
                  <Text fontSize="xl" fontWeight="800" color="yellow.400">
                    {projetosAtivos.length}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    Ativos
                  </Text>
                </VStack>
              </SimpleGrid>
            </Box>
          </MotionBox>

          {/* Skills */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Box
              bg="rgba(26, 32, 44, 0.5)"
              border="1px solid rgba(255,255,255,0.06)"
              borderRadius="2xl"
              p={6}
            >
              <HStack spacing={2} mb={4}>
                <HiCode size={18} color="var(--chakra-colors-cyan-400)" />
                <Heading fontSize="md" fontWeight="700">
                  Habilidades
                </Heading>
              </HStack>
              <HStack spacing={2} flexWrap="wrap" gap={2}>
                {aluno.skills.map((skill) => (
                  <Badge
                    key={skill}
                    bg="rgba(0, 198, 255, 0.1)"
                    color="cyan.300"
                    borderRadius="full"
                    px={3}
                    py={1}
                    fontSize="sm"
                    fontWeight="500"
                  >
                    {skill}
                  </Badge>
                ))}
              </HStack>
            </Box>
          </MotionBox>

          {/* Projetos na plataforma */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Box
              bg="rgba(26, 32, 44, 0.5)"
              border="1px solid rgba(255,255,255,0.06)"
              borderRadius="2xl"
              p={6}
            >
              <HStack spacing={2} mb={4}>
                <HiBriefcase size={18} color="var(--chakra-colors-cyan-400)" />
                <Heading fontSize="md" fontWeight="700">
                  Projetos na Plataforma
                </Heading>
                <Badge colorScheme="cyan" borderRadius="full" px={2} fontSize="xs">
                  {projetosParticipados.length}
                </Badge>
              </HStack>

              {projetosParticipados.length === 0 ? (
                <VStack py={8} spacing={3}>
                  <Text fontSize="3xl">💼</Text>
                  <Text color="gray.500" fontSize="sm">
                    Nenhum projeto na plataforma ainda.
                  </Text>
                </VStack>
              ) : (
                <VStack spacing={3} align="stretch">
                  {projetosParticipados.map((projeto) => {
                    const empresa = getEmpresa(projeto.empresa_id);
                    const entregasConcluidas = projeto.entregas.filter(
                      (e) => e.concluido
                    ).length;

                    return (
                      <Box
                        key={projeto.id}
                        bg="rgba(255,255,255,0.03)"
                        border="1px solid rgba(255,255,255,0.06)"
                        borderRadius="xl"
                        p={4}
                        cursor="pointer"
                        transition="all 0.2s ease"
                        _hover={{
                          bg: 'rgba(0,198,255,0.06)',
                          borderColor: 'rgba(0,198,255,0.2)',
                          transform: 'translateX(4px)',
                        }}
                        onClick={() => navigate(`/projeto/${projeto.id}`)}
                      >
                        <Flex
                          justify="space-between"
                          align={{ base: 'start', sm: 'center' }}
                          direction={{ base: 'column', sm: 'row' }}
                          gap={2}
                        >
                          <VStack align="start" spacing={1}>
                            <HStack spacing={2}>
                              <Badge
                                colorScheme={statusColors[projeto.status]}
                                borderRadius="full"
                                px={2}
                                fontSize="xs"
                              >
                                {statusLabels[projeto.status]}
                              </Badge>
                              <Text fontWeight="700" fontSize="sm" color="white">
                                {projeto.titulo}
                              </Text>
                            </HStack>
                            <Text fontSize="xs" color="gray.500">
                              {empresa?.avatar} {empresa?.nome} •{' '}
                              {entregasConcluidas}/{projeto.entregas.length} entregas
                            </Text>
                          </VStack>
                          <HStack spacing={1} flexWrap="wrap">
                            {projeto.tecnologias.slice(0, 3).map((tech) => (
                              <Badge
                                key={tech}
                                bg="rgba(255,255,255,0.06)"
                                color="gray.300"
                                borderRadius="full"
                                px={2}
                                fontSize="9px"
                              >
                                {tech}
                              </Badge>
                            ))}
                          </HStack>
                        </Flex>
                      </Box>
                    );
                  })}
                </VStack>
              )}
            </Box>
          </MotionBox>

          {/* Portfólio Externo */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Box
              bg="rgba(26, 32, 44, 0.5)"
              border="1px solid rgba(255,255,255,0.06)"
              borderRadius="2xl"
              p={6}
            >
              <HStack spacing={2} mb={4}>
                <HiStatusOnline size={18} color="var(--chakra-colors-cyan-400)" />
                <Heading fontSize="md" fontWeight="700">
                  Portfólio Externo
                </Heading>
                <Badge colorScheme="purple" borderRadius="full" px={2} fontSize="xs">
                  {portfolioExterno.length}
                </Badge>
              </HStack>

              {portfolioExterno.length === 0 ? (
                <VStack py={8} spacing={3}>
                  <Text fontSize="3xl">🚀</Text>
                  <Text color="gray.500" fontSize="sm">
                    Nenhum projeto externo adicionado ao portfólio.
                  </Text>
                </VStack>
              ) : (
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  {portfolioExterno.map((item) => (
                    <Box
                      key={item.id}
                      bg="rgba(255,255,255,0.03)"
                      border="1px solid rgba(255,255,255,0.06)"
                      borderRadius="xl"
                      overflow="hidden"
                      transition="all 0.3s ease"
                      _hover={{
                        transform: 'translateY(-3px)',
                        boxShadow: '0 8px 30px rgba(0, 128, 230, 0.12)',
                        borderColor: 'rgba(0, 198, 255, 0.2)',
                      }}
                    >
                      {/* Imagem */}
                      {item.imagem ? (
                        <Image
                          src={item.imagem}
                          alt={item.titulo}
                          w="100%"
                          h="160px"
                          objectFit="cover"
                          fallback={
                            <Box
                              w="100%"
                              h="160px"
                              bg="linear-gradient(135deg, rgba(0,128,230,0.2), rgba(0,198,255,0.1))"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Text fontSize="3xl">🚀</Text>
                            </Box>
                          }
                        />
                      ) : (
                        <Box
                          w="100%"
                          h="160px"
                          bg="linear-gradient(135deg, rgba(0,128,230,0.2), rgba(0,198,255,0.1))"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Text fontSize="3xl">🚀</Text>
                        </Box>
                      )}

                      <VStack align="stretch" spacing={3} p={4}>
                        <Flex justify="space-between" align="start">
                          <VStack align="start" spacing={1} flex={1}>
                            <Badge
                              colorScheme="purple"
                              borderRadius="full"
                              px={2}
                              fontSize="xs"
                            >
                              Externo
                            </Badge>
                            <Text fontWeight="700" fontSize="md" color="white">
                              {item.titulo}
                            </Text>
                          </VStack>
                          {item.link && (
                            <ChakraLink
                              href={item.link}
                              isExternal
                              color="gray.400"
                              _hover={{ color: 'cyan.400' }}
                            >
                              <HiExternalLink size={18} />
                            </ChakraLink>
                          )}
                        </Flex>

                        <Text fontSize="sm" color="gray.400" noOfLines={2}>
                          {item.descricao}
                        </Text>

                        <HStack spacing={1} flexWrap="wrap">
                          {(item.tecnologias || []).map((tech) => (
                            <Badge
                              key={tech}
                              bg="rgba(255,255,255,0.06)"
                              color="gray.300"
                              borderRadius="full"
                              px={2}
                              py={0.5}
                              fontSize="xs"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </HStack>
                      </VStack>
                    </Box>
                  ))}
                </SimpleGrid>
              )}
            </Box>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
}
