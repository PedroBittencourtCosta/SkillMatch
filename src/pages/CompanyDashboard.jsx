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
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react';
import { useNavigate, Link } from 'react-router-dom';
import { HiClipboardList, HiUsers, HiCheckCircle, HiClock, HiArrowRight } from 'react-icons/hi';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export default function CompanyDashboard() {
  const { usuario, getProjetosDaEmpresa, projetos } = useApp();
  const navigate = useNavigate();

  if (!usuario || usuario.tipo !== 'empresa') {
    navigate('/login');
    return null;
  }

  const meusProjetos = getProjetosDaEmpresa(usuario.id);
  const abertos = meusProjetos.filter((p) => p.status === 'aberto');
  const emAndamento = meusProjetos.filter((p) => p.status === 'em_andamento');
  const concluidos = meusProjetos.filter((p) => p.status === 'concluido');
  const totalCandidaturas = meusProjetos.reduce((acc, p) => acc + p.candidaturas.length, 0);

  const stats = [
    { label: 'Projetos', value: meusProjetos.length, icon: <HiClipboardList />, color: '#00c6ff' },
    { label: 'Candidaturas', value: totalCandidaturas, icon: <HiUsers />, color: '#ff944d' },
    { label: 'Em Andamento', value: emAndamento.length, icon: <HiClock />, color: '#ffd700' },
    { label: 'Concluídos', value: concluidos.length, icon: <HiCheckCircle />, color: '#48bb78' },
  ];

  const statusColors = { aberto: 'green', em_andamento: 'yellow', concluido: 'blue' };
  const statusLabels = { aberto: 'Aberto', em_andamento: 'Em Andamento', concluido: 'Concluído' };

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
            <VStack align="start" spacing={1}>
              <Text fontSize="3xl">{usuario.avatar}</Text>
              <Heading fontSize="2xl" fontWeight="800">{usuario.nome}</Heading>
              <Text color="gray.400" fontSize="sm">{usuario.tipo_negocio} • {usuario.cidade}</Text>
            </VStack>
          </MotionBox>

          {/* Stats */}
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
            {stats.map((stat, i) => (
              <MotionBox
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Box
                  bg="rgba(26, 32, 44, 0.5)"
                  border="1px solid rgba(255,255,255,0.06)"
                  borderRadius="2xl"
                  p={5}
                  transition="all 0.3s"
                  _hover={{ borderColor: `${stat.color}33` }}
                >
                  <VStack align="start" spacing={2}>
                    <Flex
                      w="40px"
                      h="40px"
                      borderRadius="lg"
                      bg={`${stat.color}15`}
                      color={stat.color}
                      align="center"
                      justify="center"
                      fontSize="lg"
                    >
                      {stat.icon}
                    </Flex>
                    <Text fontSize="2xl" fontWeight="800">{stat.value}</Text>
                    <Text fontSize="xs" color="gray.500">{stat.label}</Text>
                  </VStack>
                </Box>
              </MotionBox>
            ))}
          </SimpleGrid>

          {/* Lista de Projetos */}
          <VStack spacing={4} align="stretch">
            <Heading fontSize="lg" fontWeight="700">Meus Projetos</Heading>
            {meusProjetos.length === 0 ? (
              <Box
                bg="rgba(26, 32, 44, 0.5)"
                border="1px solid rgba(255,255,255,0.06)"
                borderRadius="2xl"
                p={8}
                textAlign="center"
              >
                <Text color="gray.500" fontSize="sm">Nenhum projeto postado ainda.</Text>
              </Box>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {meusProjetos.map((projeto, i) => (
                  <MotionBox
                    key={projeto.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.05 }}
                  >
                    <Box
                      bg="rgba(26, 32, 44, 0.5)"
                      border="1px solid rgba(255,255,255,0.06)"
                      borderRadius="2xl"
                      p={6}
                      cursor="pointer"
                      transition="all 0.3s ease"
                      _hover={{
                        transform: 'translateY(-3px)',
                        borderColor: 'rgba(0,198,255,0.3)',
                        boxShadow: '0 8px 25px rgba(0,128,230,0.12)',
                      }}
                      onClick={() => navigate(`/empresa/projeto/${projeto.id}`)}
                    >
                      <VStack align="stretch" spacing={4}>
                        <Flex justify="space-between" align="start">
                          <VStack align="start" spacing={1} flex={1}>
                            <HStack>
                              <Badge colorScheme={statusColors[projeto.status]} borderRadius="full" px={2} fontSize="xs">
                                {statusLabels[projeto.status]}
                              </Badge>
                            </HStack>
                            <Text fontWeight="700" fontSize="md">{projeto.titulo}</Text>
                          </VStack>
                          <HiArrowRight color="gray" />
                        </Flex>

                        <HStack spacing={4} fontSize="xs" color="gray.400">
                          <HStack><HiUsers /><Text>{projeto.time.length}/{projeto.vagas} no time</Text></HStack>
                          <HStack><HiClipboardList /><Text>{projeto.candidaturas.length} candidatura(s)</Text></HStack>
                        </HStack>

                        {/* Barra de time */}
                        <Box bg="rgba(255,255,255,0.04)" borderRadius="full" h="6px" overflow="hidden">
                          <Box
                            bg="linear-gradient(90deg, #0080e6, #00c6ff)"
                            h="100%"
                            w={`${(projeto.time.length / projeto.vagas) * 100}%`}
                            borderRadius="full"
                            transition="width 0.3s"
                          />
                        </Box>
                      </VStack>
                    </Box>
                  </MotionBox>
                ))}
              </SimpleGrid>
            )}
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}
