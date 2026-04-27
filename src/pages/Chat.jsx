import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Flex,
  Input,
  IconButton,
  Badge,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiPaperAirplane, HiArrowLeft, HiChat } from 'react-icons/hi';
import { useApp } from '../context/AppContext';


export default function Chat() {
  const { conversaId } = useParams();
  const navigate = useNavigate();
  const {
    usuario,
    alunos,
    empresas,
    getAluno,
    getEmpresa,
    getConversas,
    getMensagensConversa,
    enviarMensagem,
    marcarComoLida,
    getConversaId,
  } = useApp();

  const [mensagemTexto, setMensagemTexto] = useState('');
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!usuario) {
      navigate('/login');
    }
  }, [usuario, navigate]);

  // Marca como lida ao abrir a conversa
  useEffect(() => {
    if (conversaId) {
      marcarComoLida(conversaId);
    }
  }, [conversaId, getMensagensConversa]);

  // Scroll para o fim ao receber mensagem nova (só dentro do container de mensagens)
  const mensagensCount = conversaId ? getMensagensConversa(conversaId).length : 0;
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [mensagensCount, conversaId]);

  if (!usuario) return null;

  const conversas = getConversas();
  const conversaAtual = conversaId || null;
  const mensagensConversa = conversaAtual ? getMensagensConversa(conversaAtual) : [];

  // Descobre o outro usuário da conversa ativa
  const getOutroUsuario = (outroId) => {
    const aluno = getAluno(outroId);
    if (aluno) return { ...aluno, tipo: 'aluno' };
    const empresa = getEmpresa(outroId);
    if (empresa) return { ...empresa, tipo: 'empresa' };
    return null;
  };

  // Pega o outro usuário da conversa ativa
  let outroUsuarioAtivo = null;
  if (conversaAtual) {
    const conversa = conversas.find((c) => c.id === conversaAtual);
    if (conversa) {
      outroUsuarioAtivo = getOutroUsuario(conversa.outroUsuarioId);
    } else {
      // Conversa nova (sem mensagens ainda), extrair ID do parâmetro
      const ids = conversaAtual.split('_');
      const outroId = ids.find((id) => id !== usuario.id);
      if (outroId) {
        outroUsuarioAtivo = getOutroUsuario(outroId);
      }
    }
  }

  const handleEnviar = (e) => {
    e.preventDefault();
    if (!mensagemTexto.trim() || !outroUsuarioAtivo) return;
    enviarMensagem(outroUsuarioAtivo.id, mensagemTexto);
    setMensagemTexto('');
    inputRef.current?.focus();
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    if (isToday) return time;
    return `${date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} ${time}`;
  };

  // Lista de contatos possíveis (para iniciar nova conversa)
  const contatosPossiveis = usuario.tipo === 'aluno'
    ? empresas.map((e) => ({ ...e, tipo: 'empresa' }))
    : alunos.map((a) => ({ ...a, tipo: 'aluno' }));

  // Filtra contatos que ainda não têm conversa
  const contatosSemConversa = contatosPossiveis.filter((c) => {
    const cId = getConversaId(usuario.id, c.id);
    return !conversas.some((conv) => conv.id === cId);
  });

  return (
    <Box h="calc(100vh - 70px)">
      <Container maxW="1200px" h="100%" py={4}>
        <Flex
          h="100%"
          bg="rgba(26, 32, 44, 0.5)"
          border="1px solid rgba(255,255,255,0.06)"
          borderRadius="2xl"
          overflow="hidden"
        >
          {/* Sidebar - Lista de conversas */}
          <Box
            w={{ base: conversaAtual ? '0' : '100%', md: '340px' }}
            display={{ base: conversaAtual ? 'none' : 'block', md: 'block' }}
            borderRight="1px solid rgba(255,255,255,0.06)"
            overflowY="auto"
            flexShrink={0}
          >
            <VStack spacing={0} align="stretch">
              {/* Header sidebar */}
              <Box p={4} borderBottom="1px solid rgba(255,255,255,0.06)">
                <HStack spacing={2}>
                  <HiChat size={18} color="var(--chakra-colors-cyan-400)" />
                  <Heading fontSize="md" fontWeight="700">
                    Mensagens
                  </Heading>
                  {conversas.reduce((acc, c) => acc + c.naoLidas, 0) > 0 && (
                    <Badge colorScheme="red" borderRadius="full" fontSize="xs">
                      {conversas.reduce((acc, c) => acc + c.naoLidas, 0)}
                    </Badge>
                  )}
                </HStack>
              </Box>

              {/* Conversas existentes */}
              {conversas.map((conversa) => {
                const outro = getOutroUsuario(conversa.outroUsuarioId);
                if (!outro) return null;
                const isAtiva = conversaAtual === conversa.id;

                return (
                  <Box
                    key={conversa.id}
                    px={4}
                    py={3}
                    cursor="pointer"
                    bg={isAtiva ? 'rgba(0,198,255,0.08)' : 'transparent'}
                    borderLeft={isAtiva ? '3px solid' : '3px solid transparent'}
                    borderLeftColor={isAtiva ? 'cyan.400' : 'transparent'}
                    transition="all 0.2s ease"
                    _hover={{ bg: 'rgba(255,255,255,0.04)' }}
                    onClick={() => navigate(`/chat/${conversa.id}`)}
                  >
                    <HStack spacing={3}>
                      <Flex
                        w="40px"
                        h="40px"
                        bg="rgba(0,198,255,0.1)"
                        borderRadius="xl"
                        align="center"
                        justify="center"
                        fontSize="lg"
                        flexShrink={0}
                      >
                        {outro.avatar}
                      </Flex>
                      <VStack align="start" spacing={0} flex={1} overflow="hidden">
                        <HStack w="100%" justify="space-between">
                          <Text fontWeight="600" fontSize="sm" color="white" noOfLines={1}>
                            {outro.nome}
                          </Text>
                          <Text fontSize="xs" color="gray.500" flexShrink={0}>
                            {formatTime(conversa.ultimaMensagem.timestamp)}
                          </Text>
                        </HStack>
                        <HStack w="100%" justify="space-between">
                          <Text fontSize="xs" color="gray.500" noOfLines={1} flex={1}>
                            {conversa.ultimaMensagem.remetente_id === usuario.id ? 'Você: ' : ''}
                            {conversa.ultimaMensagem.texto}
                          </Text>
                          {conversa.naoLidas > 0 && (
                            <Badge
                              bg="cyan.500"
                              color="white"
                              borderRadius="full"
                              minW="20px"
                              h="20px"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              fontSize="xs"
                              flexShrink={0}
                            >
                              {conversa.naoLidas}
                            </Badge>
                          )}
                        </HStack>
                      </VStack>
                    </HStack>
                  </Box>
                );
              })}

              {/* Contatos disponíveis para nova conversa */}
              {contatosSemConversa.length > 0 && (
                <>
                  <Box px={4} py={2} borderTop="1px solid rgba(255,255,255,0.06)" mt={2}>
                    <Text fontSize="xs" color="gray.500" fontWeight="600" textTransform="uppercase">
                      Iniciar conversa
                    </Text>
                  </Box>
                  {contatosSemConversa.map((contato) => {
                    const cId = getConversaId(usuario.id, contato.id);

                    return (
                      <Box
                        key={contato.id}
                        px={4}
                        py={3}
                        cursor="pointer"
                        transition="all 0.2s ease"
                        _hover={{ bg: 'rgba(255,255,255,0.04)' }}
                        onClick={() => navigate(`/chat/${cId}`)}
                      >
                        <HStack spacing={3}>
                          <Flex
                            w="40px"
                            h="40px"
                            bg="rgba(255,255,255,0.04)"
                            borderRadius="xl"
                            align="center"
                            justify="center"
                            fontSize="lg"
                            flexShrink={0}
                            border="1px dashed rgba(255,255,255,0.1)"
                          >
                            {contato.avatar}
                          </Flex>
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="600" fontSize="sm" color="gray.300">
                              {contato.nome}
                            </Text>
                            <Text fontSize="xs" color="gray.600">
                              {contato.tipo === 'empresa'
                                ? `${contato.tipo_negocio || contato.tipo} • ${contato.cidade}`
                                : contato.nivel}
                            </Text>
                          </VStack>
                        </HStack>
                      </Box>
                    );
                  })}
                </>
              )}

              {conversas.length === 0 && contatosSemConversa.length === 0 && (
                <VStack py={12} spacing={3}>
                  <Text fontSize="3xl">💬</Text>
                  <Text color="gray.500" fontSize="sm" textAlign="center" px={4}>
                    Nenhum contato disponível.
                  </Text>
                </VStack>
              )}
            </VStack>
          </Box>

          {/* Área de chat */}
          <Flex
            flex={1}
            direction="column"
            display={{ base: conversaAtual ? 'flex' : 'none', md: 'flex' }}
          >
            {conversaAtual && outroUsuarioAtivo ? (
              <>
                {/* Header do chat */}
                <Box
                  px={4}
                  py={3}
                  borderBottom="1px solid rgba(255,255,255,0.06)"
                  bg="rgba(255,255,255,0.02)"
                >
                  <HStack spacing={3}>
                    <IconButton
                      icon={<HiArrowLeft />}
                      variant="ghost"
                      size="sm"
                      display={{ base: 'flex', md: 'none' }}
                      onClick={() => navigate('/chat')}
                      color="gray.400"
                      _hover={{ color: 'cyan.400' }}
                      aria-label="Voltar"
                    />
                    <Flex
                      w="36px"
                      h="36px"
                      bg="rgba(0,198,255,0.1)"
                      borderRadius="lg"
                      align="center"
                      justify="center"
                      fontSize="lg"
                    >
                      {outroUsuarioAtivo.avatar}
                    </Flex>
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="700" fontSize="sm" color="white">
                        {outroUsuarioAtivo.nome}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {outroUsuarioAtivo.tipo === 'empresa'
                          ? `🏢 Empresa`
                          : `👩‍💻 Freelancer • ${outroUsuarioAtivo.nivel}`}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>

                {/* Mensagens */}
                <Box ref={messagesContainerRef} flex={1} overflowY="auto" px={4} py={4}>
                  <VStack spacing={3} align="stretch">
                    {mensagensConversa.length === 0 && (
                      <VStack py={16} spacing={3}>
                        <Text fontSize="3xl">👋</Text>
                        <Text color="gray.500" fontSize="sm" textAlign="center">
                          Nenhuma mensagem ainda.
                          <br />
                          Diga olá para {outroUsuarioAtivo.nome}!
                        </Text>
                      </VStack>
                    )}

                    {mensagensConversa.map((msg) => {
                      const isMinha = msg.remetente_id === usuario.id;

                      return (
                        <Flex
                          key={msg.id}
                          justify={isMinha ? 'flex-end' : 'flex-start'}
                        >
                          <Box
                            maxW="75%"
                            bg={
                              isMinha
                                ? 'linear-gradient(135deg, rgba(0,198,255,0.2), rgba(0,114,255,0.2))'
                                : 'rgba(255,255,255,0.06)'
                            }
                            border="1px solid"
                            borderColor={
                              isMinha
                                ? 'rgba(0,198,255,0.15)'
                                : 'rgba(255,255,255,0.06)'
                            }
                            borderRadius={
                              isMinha ? '18px 18px 4px 18px' : '18px 18px 18px 4px'
                            }
                            px={4}
                            py={2.5}
                          >
                            <Text fontSize="sm" color="white" whiteSpace="pre-wrap">
                              {msg.texto}
                            </Text>
                            <Text
                              fontSize="xs"
                              color="gray.500"
                              mt={1}
                              textAlign={isMinha ? 'right' : 'left'}
                            >
                              {formatTime(msg.timestamp)}
                            </Text>
                          </Box>
                        </Flex>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </VStack>
                </Box>

                {/* Input de mensagem */}
                <Box
                  px={4}
                  py={3}
                  borderTop="1px solid rgba(255,255,255,0.06)"
                  bg="rgba(255,255,255,0.02)"
                >
                  <form onSubmit={handleEnviar}>
                    <InputGroup>
                      <Input
                        ref={inputRef}
                        placeholder="Digite uma mensagem..."
                        value={mensagemTexto}
                        onChange={(e) => setMensagemTexto(e.target.value)}
                        bg="rgba(255,255,255,0.04)"
                        border="1px solid rgba(255,255,255,0.08)"
                        borderRadius="xl"
                        _hover={{ borderColor: 'rgba(0,198,255,0.3)' }}
                        _focus={{ borderColor: 'cyan.500', boxShadow: 'none' }}
                        _placeholder={{ color: 'gray.500' }}
                        pr="48px"
                      />
                      <InputRightElement>
                        <IconButton
                          type="submit"
                          icon={<HiPaperAirplane style={{ transform: 'rotate(90deg)' }} />}
                          variant="ghost"
                          size="sm"
                          color={mensagemTexto.trim() ? 'cyan.400' : 'gray.600'}
                          _hover={{ color: 'cyan.300' }}
                          isDisabled={!mensagemTexto.trim()}
                          aria-label="Enviar"
                        />
                      </InputRightElement>
                    </InputGroup>
                  </form>
                </Box>
              </>
            ) : (
              /* Estado vazio - nenhuma conversa selecionada */
              <Flex
                flex={1}
                align="center"
                justify="center"
                display={{ base: 'none', md: 'flex' }}
              >
                <VStack spacing={4}>
                  <Box
                    w="80px"
                    h="80px"
                    bg="rgba(0,198,255,0.08)"
                    borderRadius="2xl"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="3xl"
                  >
                    💬
                  </Box>
                  <VStack spacing={1}>
                    <Text fontWeight="700" color="gray.300">
                      Suas mensagens
                    </Text>
                    <Text fontSize="sm" color="gray.500" textAlign="center" maxW="300px">
                      Selecione uma conversa ou inicie uma nova para começar a trocar mensagens.
                    </Text>
                  </VStack>
                </VStack>
              </Flex>
            )}
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}

