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
  Textarea,
  useToast,
  Tooltip,
  Divider,
  Avatar,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiUsers, HiCalendar, HiLocationMarker, HiCurrencyDollar } from 'react-icons/hi';
import { useApp } from '../context/AppContext';
import TeamBadge from '../components/TeamBadge';
import { useState } from 'react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export default function ProjectDetail() {
  const { id } = useParams();
  const { projetos, getEmpresa, getAluno, usuario, candidatar } = useApp();
  const navigate = useNavigate();
  const toast = useToast();
  const [mensagem, setMensagem] = useState('');

  const projeto = projetos.find((p) => p.id === id);
  if (!projeto) {
    return (
      <Container maxW="800px" py={20} textAlign="center">
        <Text color="gray.500">Projeto não encontrado.</Text>
        <Button mt={4} variant="glass" onClick={() => navigate('/projetos')}>Voltar</Button>
      </Container>
    );
  }

  const empresa = getEmpresa(projeto.empresa_id);
  const vagasRestantes = projeto.vagas - projeto.time.length;
  const jaCandidatou = projeto.candidaturas.some((c) => c.aluno_id === usuario?.id);
  const jaNoTime = projeto.time.includes(usuario?.id);
  const podeCandidar = usuario?.tipo === 'aluno' && !usuario.em_projeto && projeto.status === 'aberto' && vagasRestantes > 0 && !jaCandidatou && !jaNoTime;

  const handleCandidatar = () => {
    candidatar(projeto.id, mensagem || 'Tenho interesse neste projeto!');
    toast({
      title: '✅ Candidatura enviada!',
      description: 'A empresa será notificada sobre sua candidatura.',
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top',
    });
    setMensagem('');
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
              onClick={() => navigate(-1)}
              w="fit-content"
              color="gray.400"
            >
              Voltar
            </Button>

            {/* Header */}
            <Box
              bg="rgba(26, 32, 44, 0.5)"
              border="1px solid rgba(255,255,255,0.06)"
              borderRadius="2xl"
              p={8}
            >
              <VStack align="stretch" spacing={6}>
                <Flex justify="space-between" align="start" flexWrap="wrap" gap={4}>
                  <VStack align="start" spacing={2} flex={1}>
                    <HStack spacing={2}>
                      <Badge colorScheme={statusColors[projeto.status]} borderRadius="full" px={2}>
                        {statusLabels[projeto.status]}
                      </Badge>
                      <TeamBadge vagas={projeto.vagas} />
                    </HStack>
                    <Heading fontSize="xl" fontWeight="800">{projeto.titulo}</Heading>
                  </VStack>
                  <Text fontSize="4xl">{empresa?.avatar}</Text>
                </Flex>

                {/* Empresa info */}
                <HStack spacing={4} color="gray.400" fontSize="sm" flexWrap="wrap">
                  <HStack><Text>{empresa?.avatar}</Text><Text>{empresa?.nome}</Text></HStack>
                  <HStack><HiLocationMarker /><Text>{empresa?.cidade}</Text></HStack>
                  <HStack><HiCalendar /><Text>{projeto.data_criacao}</Text></HStack>
                </HStack>

                {/* NOVO: Campo de Capital */}
                <Box
                  bg="rgba(0, 198, 255, 0.05)"
                  p={3}
                  borderRadius="xl"
                  border="1px solid rgba(0, 198, 255, 0.1)"
                >
                  <HStack spacing={2}>
                    <Box color="cyan.400" fontSize="xl">
                      <HiCurrencyDollar />
                    </Box>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="xs" color="gray.500" fontWeight="bold" textTransform="uppercase">
                        Capital Disponível
                      </Text>
                      <Text color="cyan.300" fontWeight="800" fontSize="md">
                        {(projeto.capital_disponivel ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>

                <Divider borderColor="whiteAlpha.100" />

                {/* Descrição */}
                <VStack align="start" spacing={2}>
                  <Text fontWeight="600" fontSize="sm" color="gray.300">Sobre o Projeto</Text>
                  <Text color="gray.400" fontSize="sm" lineHeight="1.7">
                    {projeto.descricao}
                  </Text>
                </VStack>

                {/* Tecnologias */}
                <VStack align="start" spacing={2}>
                  <Text fontWeight="600" fontSize="sm" color="gray.300">Tecnologias</Text>
                  <HStack spacing={2} flexWrap="wrap">
                    {projeto.tecnologias.map((tech) => (
                      <Badge
                        key={tech}
                        bg="rgba(0,198,255,0.1)"
                        color="cyan.300"
                        borderRadius="full"
                        px={3}
                        py={1}
                        fontSize="xs"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </HStack>
                </VStack>

                {/* Info do Time */}
                <VStack align="start" spacing={3}>
                  <Text fontWeight="600" fontSize="sm" color="gray.300">
                    <HiUsers style={{ display: 'inline', marginRight: '6px' }} />
                    Time ({projeto.time.length}/{projeto.vagas})
                  </Text>
                  {projeto.time.length > 0 ? (
                    <HStack spacing={3} flexWrap="wrap">
                      {projeto.time.map((alunoId) => {
                        const aluno = getAluno(alunoId);
                        return (
                          <HStack
                            key={alunoId}
                            bg="rgba(255,255,255,0.04)"
                            borderRadius="full"
                            px={3}
                            py={1}
                          >
                            <Text fontSize="lg">{aluno?.avatar}</Text>
                            <Text fontSize="sm" fontWeight="500">{aluno?.nome}</Text>
                          </HStack>
                        );
                      })}
                      {Array.from({ length: vagasRestantes }).map((_, i) => (
                        <HStack
                          key={`vaga-${i}`}
                          bg="rgba(255,255,255,0.02)"
                          borderRadius="full"
                          px={3}
                          py={1}
                          border="1px dashed rgba(255,255,255,0.1)"
                        >
                          <Text fontSize="sm" color="gray.600">Vaga aberta</Text>
                        </HStack>
                      ))}
                    </HStack>
                  ) : (
                    <Text fontSize="sm" color="gray.500">Nenhum membro ainda</Text>
                  )}
                </VStack>
              </VStack>
            </Box>

            {/* Candidatura */}
            {usuario?.tipo === 'aluno' && projeto.status === 'aberto' && (
              <Box
                bg="rgba(26, 32, 44, 0.5)"
                border="1px solid rgba(255,255,255,0.06)"
                borderRadius="2xl"
                p={6}
              >
                <VStack spacing={4} align="stretch">
                  <Text fontWeight="700">Candidatar-se</Text>

                  {jaCandidatou && (
                    <Badge colorScheme="cyan" borderRadius="full" py={1} px={3} w="fit-content">
                      ✅ Candidatura enviada
                    </Badge>
                  )}

                  {jaNoTime && (
                    <Badge colorScheme="green" borderRadius="full" py={1} px={3} w="fit-content">
                      ✅ Você está no time!
                    </Badge>
                  )}

                  {!jaCandidatou && !jaNoTime && (
                    <>
                      <Textarea
                        placeholder="Conte por que você é ideal para este projeto..."
                        value={mensagem}
                        onChange={(e) => setMensagem(e.target.value)}
                        bg="rgba(255,255,255,0.03)"
                        border="1px solid rgba(255,255,255,0.08)"
                        borderRadius="xl"
                        size="sm"
                        rows={3}
                        isDisabled={!podeCandidar}
                      />
                      <Tooltip
                        label={usuario.em_projeto ? 'Você já está em um projeto ativo' : vagasRestantes <= 0 ? 'Vagas preenchidas' : ''}
                        isDisabled={podeCandidar}
                      >
                        <Button
                          variant="brand"
                          onClick={handleCandidatar}
                          isDisabled={!podeCandidar}
                          w="100%"
                        >
                          {usuario.em_projeto ? '🔒 Você já está em um projeto' : 'Enviar Candidatura'}
                        </Button>
                      </Tooltip>
                    </>
                  )}
                </VStack>
              </Box>
            )}

            {/* Entregas */}
            {/* <Box
              bg="rgba(26, 32, 44, 0.5)"
              border="1px solid rgba(255,255,255,0.06)"
              borderRadius="2xl"
              p={6}
            >
              <VStack spacing={4} align="stretch">
                <Text fontWeight="700">Entregas do Projeto</Text>
                {projeto.entregas.map((entrega) => (
                  <HStack
                    key={entrega.id}
                    spacing={3}
                    p={3}
                    bg="rgba(255,255,255,0.02)"
                    borderRadius="xl"
                  >
                    <Text fontSize="lg">{entrega.concluido ? '✅' : '⬜'}</Text>
                    <Text
                      fontSize="sm"
                      color={entrega.concluido ? 'gray.400' : 'gray.200'}
                      textDecoration={entrega.concluido ? 'line-through' : 'none'}
                    >
                      {entrega.titulo}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            </Box> */}
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
}
