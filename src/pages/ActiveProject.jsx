import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
  Flex,
  Progress,
  Checkbox,
  useToast,
} from '@chakra-ui/react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export default function ActiveProject() {
  const { usuario, projetos, getEmpresa, getAluno, toggleEntrega, concluirProjeto } = useApp();
  const navigate = useNavigate();
  const toast = useToast();

  if (!usuario || usuario.tipo !== 'aluno') {
    navigate('/login');
    return null;
  }

  const projetoAtivo = projetos.find((p) => p.id === usuario.projeto_ativo_id);

  if (!projetoAtivo) {
    return (
      <Box minH="calc(100vh - 70px)" py={16}>
        <Container maxW="600px">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <VStack
              bg="rgba(26, 32, 44, 0.5)"
              border="1px solid rgba(255,255,255,0.06)"
              borderRadius="2xl"
              p={10}
              spacing={6}
              textAlign="center"
            >
              <Text fontSize="5xl">📋</Text>
              <VStack spacing={2}>
                <Heading fontSize="xl" fontWeight="700">Nenhum projeto ativo</Heading>
                <Text color="gray.400" fontSize="sm">
                  Você não está participando de nenhum projeto no momento.
                  Explore o feed e candidate-se!
                </Text>
              </VStack>
              <Button as={Link} to="/projetos" variant="brand">
                Explorar Projetos
              </Button>
            </VStack>
          </MotionBox>
        </Container>
      </Box>
    );
  }

  const empresa = getEmpresa(projetoAtivo.empresa_id);
  const entregasConcluidas = projetoAtivo.entregas.filter((e) => e.concluido).length;
  const totalEntregas = projetoAtivo.entregas.length;
  const progresso = totalEntregas > 0 ? (entregasConcluidas / totalEntregas) * 100 : 0;
  const todasConcluidas = entregasConcluidas === totalEntregas;

  const handleConcluir = () => {
    concluirProjeto(projetoAtivo.id);
    toast({
      title: '🎉 Projeto concluído!',
      description: 'O projeto foi adicionado ao seu portfólio.',
      status: 'success',
      duration: 4000,
      isClosable: true,
      position: 'top',
    });
  };

  return (
    <Box minH="calc(100vh - 70px)" py={8}>
      <Container maxW="800px">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <VStack spacing={8} align="stretch">
            {/* Header */}
            <VStack align="start" spacing={2}>
              <Badge colorScheme="yellow" borderRadius="full" px={2}>Em Andamento</Badge>
              <Heading fontSize="2xl" fontWeight="800">{projetoAtivo.titulo}</Heading>
              <Text color="gray.400" fontSize="sm">
                {empresa?.avatar} {empresa?.nome} • {empresa?.cidade}
              </Text>
            </VStack>

            {/* Progresso */}
            <Box
              bg="rgba(26, 32, 44, 0.5)"
              border="1px solid rgba(255,255,255,0.06)"
              borderRadius="2xl"
              p={6}
            >
              <VStack spacing={4} align="stretch">
                <Flex justify="space-between" align="center">
                  <Text fontWeight="700" fontSize="sm">Progresso</Text>
                  <Text fontSize="sm" color="cyan.400" fontWeight="600">
                    {entregasConcluidas}/{totalEntregas} entregas
                  </Text>
                </Flex>
                <Progress
                  value={progresso}
                  borderRadius="full"
                  size="sm"
                  bg="rgba(255,255,255,0.06)"
                  sx={{
                    '& > div': {
                      background: 'linear-gradient(90deg, #0080e6, #00c6ff)',
                    },
                  }}
                />
              </VStack>
            </Box>

            {/* Time */}
            <Box
              bg="rgba(26, 32, 44, 0.5)"
              border="1px solid rgba(255,255,255,0.06)"
              borderRadius="2xl"
              p={6}
            >
              <VStack spacing={4} align="stretch">
                <Text fontWeight="700" fontSize="sm">Membros do Time</Text>
                <HStack spacing={4} flexWrap="wrap">
                  {projetoAtivo.time.map((alunoId) => {
                    const aluno = getAluno(alunoId);
                    return (
                      <HStack
                        key={alunoId}
                        bg="rgba(255,255,255,0.04)"
                        borderRadius="xl"
                        px={4}
                        py={2}
                        border={alunoId === usuario.id ? '1px solid rgba(0,198,255,0.3)' : '1px solid rgba(255,255,255,0.06)'}
                      >
                        <Text fontSize="xl">{aluno?.avatar}</Text>
                        <VStack align="start" spacing={0}>
                          <Text fontSize="sm" fontWeight="600">
                            {aluno?.nome} {alunoId === usuario.id && '(você)'}
                          </Text>
                          <Text fontSize="xs" color="gray.500">{aluno?.nivel}</Text>
                        </VStack>
                      </HStack>
                    );
                  })}
                </HStack>
              </VStack>
            </Box>

            {/* Checklist */}
            <Box
              bg="rgba(26, 32, 44, 0.5)"
              border="1px solid rgba(255,255,255,0.06)"
              borderRadius="2xl"
              p={6}
            >
              <VStack spacing={4} align="stretch">
                <Text fontWeight="700" fontSize="sm">Checklist de Entregas</Text>
                {projetoAtivo.entregas.map((entrega) => (
                  <Flex
                    key={entrega.id}
                    align="center"
                    p={3}
                    bg="rgba(255,255,255,0.02)"
                    borderRadius="xl"
                    cursor="pointer"
                    transition="all 0.2s"
                    _hover={{ bg: 'rgba(255,255,255,0.04)' }}
                    onClick={() => toggleEntrega(projetoAtivo.id, entrega.id)}
                  >
                    <Checkbox
                      isChecked={entrega.concluido}
                      colorScheme="cyan"
                      mr={3}
                      onChange={() => {}}
                    />
                    <Text
                      fontSize="sm"
                      color={entrega.concluido ? 'gray.500' : 'gray.200'}
                      textDecoration={entrega.concluido ? 'line-through' : 'none'}
                    >
                      {entrega.titulo}
                    </Text>
                  </Flex>
                ))}
              </VStack>
            </Box>

            {/* Concluir */}
            {todasConcluidas && projetoAtivo.status === 'em_andamento' && (
              <MotionBox
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  variant="brand"
                  size="lg"
                  w="100%"
                  onClick={handleConcluir}
                >
                  🎉 Concluir Projeto
                </Button>
              </MotionBox>
            )}
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
}
