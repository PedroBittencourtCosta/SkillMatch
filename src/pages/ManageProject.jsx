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
  Divider,
  useToast,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiCheck, HiX, HiUsers, HiChat } from 'react-icons/hi';
import { useApp } from '../context/AppContext';
import TeamBadge from '../components/TeamBadge';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export default function ManageProject() {
  const { id } = useParams();
  const { projetos, getAluno, usuario, aceitarCandidato, rejeitarCandidato, concluirProjeto } = useApp();
  const navigate = useNavigate();
  const toast = useToast();

  if (!usuario || usuario.tipo !== 'empresa') {
    navigate('/login');
    return null;
  }

  const projeto = projetos.find((p) => p.id === id);
  if (!projeto || projeto.empresa_id !== usuario.id) {
    return (
      <Container maxW="800px" py={20} textAlign="center">
        <Text color="gray.500">Projeto não encontrado.</Text>
        <Button mt={4} variant="glass" onClick={() => navigate('/empresa/dashboard')}>Voltar</Button>
      </Container>
    );
  }

  const vagasRestantes = projeto.vagas - projeto.time.length;

  const handleAceitar = (alunoId) => {
    aceitarCandidato(projeto.id, alunoId);
    const aluno = getAluno(alunoId);
    toast({
      title: `✅ ${aluno?.nome} aceito(a) no time!`,
      description: vagasRestantes <= 1 ? 'Time completo! O projeto vai iniciar.' : `${vagasRestantes - 1} vaga(s) restante(s).`,
      status: 'success',
      duration: 3000,
      position: 'top',
    });
  };

  const handleRejeitar = (alunoId) => {
    rejeitarCandidato(projeto.id, alunoId);
    toast({
      title: 'Candidatura recusada.',
      status: 'info',
      duration: 2000,
      position: 'top',
    });
  };

  const handleConcluir = () => {
    concluirProjeto(projeto.id);
    toast({
      title: '🎉 Projeto concluído!',
      description: 'Todos os membros do time foram liberados.',
      status: 'success',
      duration: 3000,
      position: 'top',
    });
  };

  const statusColors = { aberto: 'green', em_andamento: 'yellow', concluido: 'blue' };
  const statusLabels = { aberto: 'Aberto', em_andamento: 'Em Andamento', concluido: 'Concluído' };

  return (
    <Box minH="calc(100vh - 70px)" py={8}>
      <Container maxW="800px">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <VStack spacing={8} align="stretch">
            {/* Back */}
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<HiArrowLeft />}
              onClick={() => navigate('/empresa/dashboard')}
              w="fit-content"
              color="gray.400"
            >
              Dashboard
            </Button>

            {/* Header */}
            <Box
              bg="rgba(26, 32, 44, 0.5)"
              border="1px solid rgba(255,255,255,0.06)"
              borderRadius="2xl"
              p={6}
            >
              <VStack align="stretch" spacing={4}>
                <Flex justify="space-between" align="start" flexWrap="wrap" gap={4}>
                  <VStack align="start" spacing={2}>
                    <HStack>
                      <Badge colorScheme={statusColors[projeto.status]} borderRadius="full" px={2}>
                        {statusLabels[projeto.status]}
                      </Badge>
                      <TeamBadge vagas={projeto.vagas} />
                    </HStack>
                    <Heading fontSize="xl" fontWeight="800">{projeto.titulo}</Heading>
                  </VStack>
                </Flex>

                <Text fontSize="sm" color="gray.400">{projeto.descricao}</Text>

                <HStack spacing={2} flexWrap="wrap">
                  {projeto.tecnologias.map((tech) => (
                    <Badge
                      key={tech}
                      bg="rgba(0,198,255,0.1)"
                      color="cyan.300"
                      borderRadius="full"
                      px={2}
                      fontSize="xs"
                    >
                      {tech}
                    </Badge>
                  ))}
                </HStack>
              </VStack>
            </Box>

            {/* Time Atual */}
            <Box
              bg="rgba(26, 32, 44, 0.5)"
              border="1px solid rgba(255,255,255,0.06)"
              borderRadius="2xl"
              p={6}
            >
              <VStack spacing={4} align="stretch">
                <Flex justify="space-between" align="center">
                  <HStack>
                    <HiUsers />
                    <Text fontWeight="700" fontSize="sm">Time ({projeto.time.length}/{projeto.vagas})</Text>
                  </HStack>
                  {vagasRestantes > 0 && (
                    <Badge colorScheme="cyan" borderRadius="full" fontSize="xs">
                      {vagasRestantes} vaga(s)
                    </Badge>
                  )}
                </Flex>

                {projeto.time.length > 0 ? (
                  <VStack spacing={3} align="stretch">
                    {projeto.time.map((alunoId) => {
                      const aluno = getAluno(alunoId);
                      return (
                        <HStack
                          key={alunoId}
                          bg="rgba(255,255,255,0.03)"
                          borderRadius="xl"
                          p={4}
                          spacing={4}
                        >
                          <Text fontSize="2xl">{aluno?.avatar}</Text>
                          <VStack align="start"
                            spacing={0}
                            flex={1}
                            cursor="pointer"
                            onClick={() => navigate(`/freelancer/${alunoId}`)} // Redireciona para o perfil
                            _hover={{ opacity: 0.8 }}>
                            <Text fontWeight="600" fontSize="sm">{aluno?.nome}</Text>
                            <Text fontSize="xs" color="gray.500">{aluno?.nivel}</Text>
                          </VStack>
                          <HStack spacing={1} flexWrap="wrap">
                            {aluno?.skills?.slice(0, 3).map((s) => (
                              <Badge key={s} fontSize="9px" borderRadius="full" bg="rgba(0,198,255,0.1)" color="cyan.300" px={2}>
                                {s}
                              </Badge>
                            ))}
                          </HStack>
                        </HStack>
                      );
                    })}
                  </VStack>
                ) : (
                  <Text fontSize="sm" color="gray.500">Nenhum membro no time ainda.</Text>
                )}

                {/* Vagas abertas visuais */}
                {vagasRestantes > 0 && (
                  <HStack spacing={2}>
                    {Array.from({ length: vagasRestantes }).map((_, i) => (
                      <Box
                        key={i}
                        border="1px dashed rgba(255,255,255,0.1)"
                        borderRadius="xl"
                        p={3}
                        flex={1}
                        textAlign="center"
                      >
                        <Text fontSize="xs" color="gray.600">Vaga aberta</Text>
                      </Box>
                    ))}
                  </HStack>
                )}
              </VStack>
            </Box>

            {/* Candidaturas */}
            <Box
              bg="rgba(26, 32, 44, 0.5)"
              border="1px solid rgba(255,255,255,0.06)"
              borderRadius="2xl"
              p={6}
            >
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between">
                  <Text fontWeight="700" fontSize="sm">
                    Candidaturas ({projeto.candidaturas.length})
                  </Text>
                </HStack>

                {projeto.candidaturas.length === 0 ? (
                  <VStack py={6} spacing={3}>
                    <Text fontSize="3xl">📭</Text>
                    <Text fontSize="sm" color="gray.500">
                      {projeto.status === 'aberto' ? 'Nenhuma candidatura recebida ainda.' : 'Sem candidaturas pendentes.'}
                    </Text>
                  </VStack>
                ) : (
                  <VStack spacing={3} align="stretch">
                    {projeto.candidaturas.map((cand) => {
                      const aluno = getAluno(cand.aluno_id);
                      return (
                        <Box
                          key={cand.aluno_id}
                          bg="rgba(255,255,255,0.03)"
                          border="1px solid rgba(255,255,255,0.06)"
                          borderRadius="xl"
                          p={5}
                        >

                          <VStack align="stretch" spacing={4}>
                            <Flex justify="space-between" align="start" flexWrap="wrap" gap={3}>
                              <HStack spacing={3}
                                cursor="pointer"
                                onClick={() => navigate(`/freelancer/${cand.aluno_id}`)}
                                _hover={{ opacity: 0.8 }}>
                                <Text fontSize="2xl">{aluno?.avatar}</Text>
                                <VStack align="start" spacing={0}>
                                  <Text fontWeight="700" fontSize="sm">{aluno?.nome}</Text>
                                  <Text fontSize="xs" color="gray.500">{aluno?.nivel} • {cand.data}</Text>
                                </VStack>
                              </HStack>
                            </Flex>

                            {/* Skills */}
                            <HStack spacing={1} flexWrap="wrap">
                              {aluno?.skills?.map((s) => (
                                <Badge
                                  key={s}
                                  fontSize="xs"
                                  borderRadius="full"
                                  bg="rgba(0,198,255,0.1)"
                                  color="cyan.300"
                                  px={2}
                                  py={0.5}
                                >
                                  {s}
                                </Badge>
                              ))}
                            </HStack>

                            {/* Bio */}
                            <Text fontSize="sm" color="gray.400">{aluno?.bio}</Text>

                            {/* Mensagem */}
                            <Box
                              bg="rgba(255,255,255,0.02)"
                              borderRadius="lg"
                              p={3}
                              borderLeft="3px solid"
                              borderLeftColor="cyan.500"
                            >
                              <Text fontSize="xs" color="gray.500" mb={1}>Mensagem:</Text>
                              <Text fontSize="sm" color="gray.300" fontStyle="italic">
                                "{cand.mensagem}"
                              </Text>
                            </Box>

                            {/* Ações */}
                            {projeto.status === 'aberto' && vagasRestantes > 0 && (
                              <HStack spacing={3}>
                                <Button
                                  variant="brand"
                                  size="sm"
                                  leftIcon={<HiCheck />}
                                  onClick={() => handleAceitar(cand.aluno_id)}
                                  flex={1}
                                >
                                  Aceitar
                                </Button>

                                {/* BOTÃO DE CHAT ADICIONADO AQUI */}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  leftIcon={<HiChat />}
                                  color="cyan.300"
                                  borderColor="rgba(0,198,255,0.3)"
                                  _hover={{ bg: "rgba(0,198,255,0.1)" }}
                                  onClick={() => navigate(`/chat/${cand.aluno_id}_emp1`)}
                                  flex={1}
                                >
                                  Chat
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  leftIcon={<HiX />}
                                  color="gray.400"
                                  _hover={{ color: 'red.400' }}
                                  onClick={() => handleRejeitar(cand.aluno_id)}
                                >
                                  Recusar
                                </Button>
                              </HStack>
                            )}
                          </VStack>
                        </Box>
                      );
                    })}
                  </VStack>
                )}
              </VStack>
            </Box>

            {/* Entregas */}
            {/* <Box
              bg="rgba(26, 32, 44, 0.5)"
              border="1px solid rgba(255,255,255,0.06)"
              borderRadius="2xl"
              p={6}
            >
              <VStack spacing={4} align="stretch">
                <Text fontWeight="700" fontSize="sm">Entregas</Text>
                {projeto.entregas.map((entrega) => (
                  <HStack key={entrega.id} p={3} bg="rgba(255,255,255,0.02)" borderRadius="xl">
                    <Text fontSize="lg">{entrega.concluido ? '✅' : '⬜'}</Text>
                    <Text
                      fontSize="sm"
                      color={entrega.concluido ? 'gray.500' : 'gray.200'}
                      textDecoration={entrega.concluido ? 'line-through' : 'none'}
                    >
                      {entrega.titulo}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            </Box> */}

            {/* Concluir Projeto */}
            {projeto.status === 'em_andamento' && (
              <Button
                variant="brand"
                size="lg"
                w="100%"
                onClick={handleConcluir}
              >
                🎉 Marcar Projeto como Concluído
              </Button>
            )}
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
}
