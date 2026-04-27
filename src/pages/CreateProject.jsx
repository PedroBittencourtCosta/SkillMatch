import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Input,
  Textarea,
  Select,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Badge,
  Flex,
  useToast,
  Divider,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiPlus, HiTrash } from 'react-icons/hi';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const CATEGORIAS_OPCOES = ['Desenvolvimento Web', 'Marketing Digital', 'Design'];
const NIVEIS_OPCOES = ['Iniciante', 'Intermediário', 'Avançado'];

const TIPOS_VAGA_SUGESTOES = [
  'Desenvolvedor Front End',
  'Desenvolvedor Back End',
  'Desenvolvedor Full Stack',
  'Desenvolvedor Mobile',
  'Designer UI/UX',
  'Designer Gráfico',
  'Analista de Marketing',
  'Analista de SEO',
  'Gerente de Projeto',
];

const inputStyles = {
  bg: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 'xl',
  _hover: { borderColor: 'rgba(0,198,255,0.3)' },
  _focus: { borderColor: 'cyan.500', boxShadow: 'none' },
  _placeholder: { color: 'gray.500' },
};

export default function CreateProject() {
  const { usuario, criarProjeto } = useApp();
  const navigate = useNavigate();
  const toast = useToast();

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('Desenvolvimento Web');
  const [nivel, setNivel] = useState('Intermediário');
  const [vagaInput, setVagaInput] = useState('');
  const [vagas, setVagas] = useState([]);
  const [tecnologiasInput, setTecnologiasInput] = useState('');
  const [tecnologias, setTecnologias] = useState([]);
  const [entregaInput, setEntregaInput] = useState('');
  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!usuario || usuario.tipo !== 'empresa') {
      navigate('/login');
    }
  }, [usuario, navigate]);

  if (!usuario || usuario.tipo !== 'empresa') return null;

  const addVaga = () => {
    const tipo = vagaInput.trim();
    if (tipo) {
      setVagas([...vagas, { id: `v_${Date.now()}`, tipo }]);
      setVagaInput('');
    }
  };

  const removeVaga = (id) => {
    setVagas(vagas.filter((v) => v.id !== id));
  };

  const handleVagaKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addVaga();
    }
  };

  const addTecnologia = () => {
    const tech = tecnologiasInput.trim();
    if (tech && !tecnologias.includes(tech)) {
      setTecnologias([...tecnologias, tech]);
      setTecnologiasInput('');
    }
  };

  const removeTecnologia = (tech) => {
    setTecnologias(tecnologias.filter((t) => t !== tech));
  };

  const handleTechKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTecnologia();
    }
  };

  const addEntrega = () => {
    const entrega = entregaInput.trim();
    if (entrega) {
      setEntregas([
        ...entregas,
        { id: `e_${Date.now()}`, titulo: entrega, concluido: false },
      ]);
      setEntregaInput('');
    }
  };

  const removeEntrega = (id) => {
    setEntregas(entregas.filter((e) => e.id !== id));
  };

  const handleEntregaKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addEntrega();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!titulo.trim()) {
      toast({
        title: 'Título obrigatório',
        description: 'Informe o título do projeto.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!descricao.trim()) {
      toast({
        title: 'Descrição obrigatória',
        description: 'Descreva o projeto para os candidatos.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (vagas.length === 0) {
      toast({
        title: 'Adicione vagas',
        description: 'Informe pelo menos uma vaga com o tipo desejado.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (tecnologias.length === 0) {
      toast({
        title: 'Adicione tecnologias',
        description: 'Informe pelo menos uma tecnologia.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      criarProjeto({
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        categoria,
        nivel_requerido: nivel,
        vagas: vagas.length,
        vagas_detalhes: vagas.map((v) => v.tipo),
        tecnologias,
        entregas,
      });

      toast({
        title: '✅ Projeto criado com sucesso!',
        description: 'Seu projeto já está visível para freelancers.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setLoading(false);
      navigate('/empresa/dashboard');
    }, 600);
  };

  return (
    <Box minH="calc(100vh - 70px)" py={8}>
      <Container maxW="700px">
        <VStack spacing={8} align="stretch">
          {/* Voltar */}
          <MotionBox
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="ghost"
              leftIcon={<HiArrowLeft />}
              onClick={() => navigate('/empresa/dashboard')}
              color="gray.400"
              size="sm"
              _hover={{ color: 'cyan.400' }}
            >
              Voltar para Dashboard
            </Button>
          </MotionBox>

          {/* Header */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <VStack align="start" spacing={1}>
              <Heading fontSize="2xl" fontWeight="800">
                Novo Projeto
              </Heading>
              <Text color="gray.400" fontSize="sm">
                Preencha os dados do projeto para publicar no SkillMatch
              </Text>
            </VStack>
          </MotionBox>

          {/* Formulário */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Box
              bg="rgba(26, 32, 44, 0.5)"
              border="1px solid rgba(255,255,255,0.06)"
              borderRadius="2xl"
              p={8}
            >
              <form onSubmit={handleSubmit}>
                <VStack spacing={6}>
                  {/* Título */}
                  <FormControl>
                    <FormLabel fontSize="sm" color="gray.400" mb={1}>
                      Título do Projeto *
                    </FormLabel>
                    <Input
                      placeholder="Ex: Site Institucional, App Mobile, Identidade Visual..."
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      {...inputStyles}
                    />
                  </FormControl>

                  {/* Descrição */}
                  <FormControl>
                    <FormLabel fontSize="sm" color="gray.400" mb={1}>
                      Descrição *
                    </FormLabel>
                    <Textarea
                      placeholder="Descreva detalhadamente o projeto, objetivos, e o que espera dos freelancers..."
                      value={descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                      {...inputStyles}
                      rows={4}
                    />
                  </FormControl>

                  <Divider borderColor="rgba(255,255,255,0.06)" />

                  {/* Categoria e Nível */}
                  <HStack spacing={4} w="100%" flexDir={{ base: 'column', sm: 'row' }}>
                    <FormControl>
                      <FormLabel fontSize="sm" color="gray.400" mb={1}>
                        Categoria
                      </FormLabel>
                      <Select
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}
                        {...inputStyles}
                      >
                        {CATEGORIAS_OPCOES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel fontSize="sm" color="gray.400" mb={1}>
                        Nível Requerido
                      </FormLabel>
                      <Select
                        value={nivel}
                        onChange={(e) => setNivel(e.target.value)}
                        {...inputStyles}
                      >
                        {NIVEIS_OPCOES.map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                  </HStack>

                  {/* Vagas */}
                  <FormControl>
                    <FormLabel fontSize="sm" color="gray.400" mb={1}>
                      Vagas *
                      {vagas.length > 0 && (
                        <Badge ml={2} colorScheme="cyan" borderRadius="full" fontSize="xs">
                          {vagas.length} vaga{vagas.length > 1 ? 's' : ''}
                        </Badge>
                      )}
                    </FormLabel>
                    <HStack>
                      <Input
                        placeholder="Ex: Desenvolvedor Front End, Designer UI/UX..."
                        value={vagaInput}
                        onChange={(e) => setVagaInput(e.target.value)}
                        onKeyDown={handleVagaKeyDown}
                        list="sugestoes-vagas"
                        {...inputStyles}
                      />
                      <IconButton
                        icon={<HiPlus />}
                        onClick={addVaga}
                        variant="ghost"
                        color="cyan.400"
                        _hover={{ bg: 'rgba(0,198,255,0.1)' }}
                        aria-label="Adicionar vaga"
                        isDisabled={!vagaInput.trim()}
                      />
                    </HStack>
                    <datalist id="sugestoes-vagas">
                      {TIPOS_VAGA_SUGESTOES.map((s) => (
                        <option key={s} value={s} />
                      ))}
                    </datalist>
                    {vagas.length > 0 && (
                      <VStack spacing={2} mt={3} align="stretch">
                        {vagas.map((vaga, idx) => (
                          <Flex
                            key={vaga.id}
                            bg="rgba(255,255,255,0.03)"
                            border="1px solid rgba(255,255,255,0.06)"
                            borderRadius="lg"
                            px={4}
                            py={2}
                            align="center"
                            justify="space-between"
                          >
                            <HStack spacing={3}>
                              <Badge
                                bg="rgba(0,198,255,0.1)"
                                color="cyan.300"
                                borderRadius="full"
                                w="24px"
                                h="24px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                fontSize="xs"
                              >
                                {idx + 1}
                              </Badge>
                              <Text fontSize="sm" color="gray.300">
                                {vaga.tipo}
                              </Text>
                            </HStack>
                            <IconButton
                              icon={<HiTrash />}
                              variant="ghost"
                              size="xs"
                              color="gray.500"
                              _hover={{ color: 'red.400' }}
                              onClick={() => removeVaga(vaga.id)}
                              aria-label="Remover vaga"
                            />
                          </Flex>
                        ))}
                      </VStack>
                    )}
                    <Text fontSize="xs" color="gray.600" mt={1}>
                      Adicione cada vaga com o tipo de profissional desejado. Pressione Enter ou clique no +.
                    </Text>
                  </FormControl>

                  <Divider borderColor="rgba(255,255,255,0.06)" />

                  {/* Tecnologias */}
                  <FormControl>
                    <FormLabel fontSize="sm" color="gray.400" mb={1}>
                      Tecnologias *
                    </FormLabel>
                    <HStack>
                      <Input
                        placeholder="Ex: React, Node.js, Figma..."
                        value={tecnologiasInput}
                        onChange={(e) => setTecnologiasInput(e.target.value)}
                        onKeyDown={handleTechKeyDown}
                        {...inputStyles}
                      />
                      <IconButton
                        icon={<HiPlus />}
                        onClick={addTecnologia}
                        variant="ghost"
                        color="cyan.400"
                        _hover={{ bg: 'rgba(0,198,255,0.1)' }}
                        aria-label="Adicionar tecnologia"
                        isDisabled={!tecnologiasInput.trim()}
                      />
                    </HStack>
                    {tecnologias.length > 0 && (
                      <HStack spacing={2} flexWrap="wrap" gap={1} mt={3}>
                        {tecnologias.map((tech) => (
                          <Badge
                            key={tech}
                            bg="rgba(0, 198, 255, 0.1)"
                            color="cyan.300"
                            borderRadius="full"
                            px={3}
                            py={1}
                            fontSize="xs"
                            cursor="pointer"
                            transition="all 0.2s"
                            _hover={{
                              bg: 'rgba(255,100,100,0.15)',
                              color: 'red.300',
                            }}
                            onClick={() => removeTecnologia(tech)}
                          >
                            {tech} ×
                          </Badge>
                        ))}
                      </HStack>
                    )}
                    <Text fontSize="xs" color="gray.600" mt={1}>
                      Pressione Enter ou clique no + para adicionar. Clique na tag para remover.
                    </Text>
                  </FormControl>

                  <Divider borderColor="rgba(255,255,255,0.06)" />

                  {/* Entregas */}
                  <FormControl>
                    <FormLabel fontSize="sm" color="gray.400" mb={1}>
                      Entregas / Milestones
                    </FormLabel>
                    <HStack>
                      <Input
                        placeholder="Ex: Layout aprovado, API pronta, Deploy..."
                        value={entregaInput}
                        onChange={(e) => setEntregaInput(e.target.value)}
                        onKeyDown={handleEntregaKeyDown}
                        {...inputStyles}
                      />
                      <IconButton
                        icon={<HiPlus />}
                        onClick={addEntrega}
                        variant="ghost"
                        color="cyan.400"
                        _hover={{ bg: 'rgba(0,198,255,0.1)' }}
                        aria-label="Adicionar entrega"
                        isDisabled={!entregaInput.trim()}
                      />
                    </HStack>
                    {entregas.length > 0 && (
                      <VStack spacing={2} mt={3} align="stretch">
                        {entregas.map((entrega, idx) => (
                          <Flex
                            key={entrega.id}
                            bg="rgba(255,255,255,0.03)"
                            border="1px solid rgba(255,255,255,0.06)"
                            borderRadius="lg"
                            px={4}
                            py={2}
                            align="center"
                            justify="space-between"
                          >
                            <HStack spacing={3}>
                              <Badge
                                bg="rgba(0,198,255,0.1)"
                                color="cyan.300"
                                borderRadius="full"
                                w="24px"
                                h="24px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                fontSize="xs"
                              >
                                {idx + 1}
                              </Badge>
                              <Text fontSize="sm" color="gray.300">
                                {entrega.titulo}
                              </Text>
                            </HStack>
                            <IconButton
                              icon={<HiTrash />}
                              variant="ghost"
                              size="xs"
                              color="gray.500"
                              _hover={{ color: 'red.400' }}
                              onClick={() => removeEntrega(entrega.id)}
                              aria-label="Remover entrega"
                            />
                          </Flex>
                        ))}
                      </VStack>
                    )}
                    <Text fontSize="xs" color="gray.600" mt={1}>
                      Opcional. Defina marcos de entrega para acompanhar o progresso.
                    </Text>
                  </FormControl>

                  <Divider borderColor="rgba(255,255,255,0.06)" />

                  {/* Botões */}
                  <HStack w="100%" justify="flex-end" spacing={3} pt={2}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/empresa/dashboard')}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      bg="linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)"
                      color="white"
                      borderRadius="xl"
                      fontWeight="700"
                      fontSize="sm"
                      px={8}
                      _hover={{
                        opacity: 0.9,
                        transform: 'translateY(-1px)',
                      }}
                      _active={{ transform: 'translateY(0)' }}
                      transition="all 0.2s ease"
                      isLoading={loading}
                      loadingText="Criando..."
                    >
                      Publicar Projeto
                    </Button>
                  </HStack>
                </VStack>
              </form>
            </Box>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
}
