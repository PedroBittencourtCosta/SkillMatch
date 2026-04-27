import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Button,
  Input,
  Textarea,
  Badge,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  useToast,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiPlus } from 'react-icons/hi';
import { useApp } from '../context/AppContext';
import PortfolioItem from '../components/PortfolioItem';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export default function Portfolio() {
  const { usuario, alunos, projetos, getEmpresa, addProjetoExterno, removeProjetoExterno } = useApp();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [novoTitulo, setNovoTitulo] = useState('');
  const [novaDescricao, setNovaDescricao] = useState('');
  const [novoLink, setNovoLink] = useState('');
  const [novaImagem, setNovaImagem] = useState('');
  const [novasTecnologias, setNovasTecnologias] = useState('');

  if (!usuario || usuario.tipo !== 'aluno') {
    navigate('/login');
    return null;
  }

  // Pega dados atualizados do aluno
  const alunoAtual = alunos.find((a) => a.id === usuario.id);

  // Projetos concluídos na plataforma
  const projetosInternos = projetos
    .filter((p) => p.status === 'concluido' && p.time.includes(usuario.id))
    .map((p) => ({
      id: p.id,
      titulo: p.titulo,
      descricao: p.descricao,
      tecnologias: p.tecnologias,
      imagem: null,
      link: null,
      empresa: getEmpresa(p.empresa_id)?.nome,
    }));

  const handleAdd = () => {
    if (!novoTitulo.trim()) return;

    addProjetoExterno({
      titulo: novoTitulo,
      descricao: novaDescricao,
      link: novoLink,
      imagem: novaImagem,
      tecnologias: novasTecnologias.split(',').map((t) => t.trim()).filter(Boolean),
    });

    toast({
      title: '✅ Projeto adicionado ao portfólio!',
      status: 'success',
      duration: 2000,
      position: 'top',
    });

    setNovoTitulo('');
    setNovaDescricao('');
    setNovoLink('');
    setNovaImagem('');
    setNovasTecnologias('');
    onClose();
  };

  const handleRemove = (projetoExternoId) => {
    removeProjetoExterno(projetoExternoId);
    toast({
      title: 'Projeto removido.',
      status: 'info',
      duration: 2000,
      position: 'top',
    });
  };

  const inputStyles = {
    bg: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 'xl',
    _hover: { borderColor: 'rgba(0,198,255,0.3)' },
    _focus: { borderColor: 'cyan.500', boxShadow: 'none' },
    size: 'sm',
  };

  return (
    <Box minH="calc(100vh - 70px)" py={8}>
      <Container maxW="1000px">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <VStack spacing={8} align="stretch">
            {/* Header */}
            <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
              <VStack align="start" spacing={1}>
                <Heading fontSize="2xl" fontWeight="800">Meu Portfólio</Heading>
                <Text color="gray.400" fontSize="sm">
                  {alunoAtual?.avatar} {alunoAtual?.nome} • {projetosInternos.length + (alunoAtual?.portfolio_externo?.length || 0)} projetos
                </Text>
              </VStack>
              <Button
                variant="brand"
                size="sm"
                leftIcon={<HiPlus />}
                onClick={onOpen}
              >
                Adicionar Projeto
              </Button>
            </Flex>

            {/* Tabs */}
            <Tabs variant="soft-rounded" colorScheme="cyan">
              <TabList>
                <Tab
                  fontSize="sm"
                  _selected={{ bg: 'rgba(0,198,255,0.15)', color: 'cyan.300' }}
                >
                  Todos ({projetosInternos.length + (alunoAtual?.portfolio_externo?.length || 0)})
                </Tab>
                <Tab
                  fontSize="sm"
                  _selected={{ bg: 'rgba(0,198,255,0.15)', color: 'cyan.300' }}
                >
                  SkillMatch ({projetosInternos.length})
                </Tab>
                <Tab
                  fontSize="sm"
                  _selected={{ bg: 'rgba(0,198,255,0.15)', color: 'cyan.300' }}
                >
                  Externos ({alunoAtual?.portfolio_externo?.length || 0})
                </Tab>
              </TabList>

              <TabPanels>
                {/* Todos */}
                <TabPanel px={0}>
                  {projetosInternos.length === 0 && (alunoAtual?.portfolio_externo?.length || 0) === 0 ? (
                    <VStack py={12} spacing={4}>
                      <Text fontSize="4xl">📂</Text>
                      <Text color="gray.500" fontSize="sm">Seu portfólio está vazio. Conclua projetos ou adicione projetos externos.</Text>
                    </VStack>
                  ) : (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mt={4}>
                      {projetosInternos.map((item) => (
                        <PortfolioItem key={item.id} item={item} isInternal />
                      ))}
                      {(alunoAtual?.portfolio_externo || []).map((item) => (
                        <PortfolioItem
                          key={item.id}
                          item={item}
                          isEditable
                          onRemove={handleRemove}
                        />
                      ))}
                    </SimpleGrid>
                  )}
                </TabPanel>

                {/* SkillMatch */}
                <TabPanel px={0}>
                  {projetosInternos.length === 0 ? (
                    <VStack py={12} spacing={4}>
                      <Text fontSize="4xl">💼</Text>
                      <Text color="gray.500" fontSize="sm">Nenhum projeto concluído na plataforma ainda.</Text>
                    </VStack>
                  ) : (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mt={4}>
                      {projetosInternos.map((item) => (
                        <PortfolioItem key={item.id} item={item} isInternal />
                      ))}
                    </SimpleGrid>
                  )}
                </TabPanel>

                {/* Externos */}
                <TabPanel px={0}>
                  {(alunoAtual?.portfolio_externo?.length || 0) === 0 ? (
                    <VStack py={12} spacing={4}>
                      <Text fontSize="4xl">🚀</Text>
                      <Text color="gray.500" fontSize="sm">Nenhum projeto externo adicionado. Clique em "Adicionar Projeto" para começar.</Text>
                    </VStack>
                  ) : (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mt={4}>
                      {(alunoAtual?.portfolio_externo || []).map((item) => (
                        <PortfolioItem
                          key={item.id}
                          item={item}
                          isEditable
                          onRemove={handleRemove}
                        />
                      ))}
                    </SimpleGrid>
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </VStack>
        </MotionBox>
      </Container>

      {/* Modal Add Projeto */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(5px)" />
        <ModalContent bg="gray.800" borderRadius="2xl" border="1px solid rgba(255,255,255,0.06)">
          <ModalHeader fontWeight="700" fontSize="lg">Adicionar Projeto Externo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel fontSize="sm" color="gray.400">Título *</FormLabel>
                <Input
                  value={novoTitulo}
                  onChange={(e) => setNovoTitulo(e.target.value)}
                  placeholder="Ex: Meu App React"
                  {...inputStyles}
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm" color="gray.400">Descrição</FormLabel>
                <Textarea
                  value={novaDescricao}
                  onChange={(e) => setNovaDescricao(e.target.value)}
                  placeholder="Breve descrição do projeto"
                  {...inputStyles}
                  rows={2}
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm" color="gray.400">Link (GitHub, site, etc)</FormLabel>
                <Input
                  value={novoLink}
                  onChange={(e) => setNovoLink(e.target.value)}
                  placeholder="https://github.com/..."
                  {...inputStyles}
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm" color="gray.400">URL da Imagem</FormLabel>
                <Input
                  value={novaImagem}
                  onChange={(e) => setNovaImagem(e.target.value)}
                  placeholder="https://..."
                  {...inputStyles}
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm" color="gray.400">Tecnologias (separadas por vírgula)</FormLabel>
                <Input
                  value={novasTecnologias}
                  onChange={(e) => setNovasTecnologias(e.target.value)}
                  placeholder="React, Node.js, CSS"
                  {...inputStyles}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose} size="sm">Cancelar</Button>
            <Button variant="brand" onClick={handleAdd} size="sm" isDisabled={!novoTitulo.trim()}>
              Adicionar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
