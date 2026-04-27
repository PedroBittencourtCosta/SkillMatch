import { createContext, useContext, useState, useEffect } from 'react';
import { EMPRESAS, ALUNOS, PROJETOS } from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Inicializa com localStorage ou dados mockados
  const [empresas] = useState(() => {
    const saved = localStorage.getItem('sm_empresas');
    return saved ? JSON.parse(saved) : EMPRESAS;
  });

  const [alunos, setAlunos] = useState(() => {
    const saved = localStorage.getItem('sm_alunos');
    return saved ? JSON.parse(saved) : ALUNOS;
  });

  const [projetos, setProjetos] = useState(() => {
    const saved = localStorage.getItem('sm_projetos');
    return saved ? JSON.parse(saved) : PROJETOS;
  });

  const [usuario, setUsuario] = useState(() => {
    const saved = localStorage.getItem('sm_usuario');
    return saved ? JSON.parse(saved) : null;
  });

  const [mensagens, setMensagens] = useState(() => {
    const saved = localStorage.getItem('sm_mensagens');
    return saved ? JSON.parse(saved) : [];
  });

  // Persiste no localStorage
  useEffect(() => {
    localStorage.setItem('sm_alunos', JSON.stringify(alunos));
  }, [alunos]);

  useEffect(() => {
    localStorage.setItem('sm_projetos', JSON.stringify(projetos));
  }, [projetos]);

  useEffect(() => {
    if (usuario) {
      localStorage.setItem('sm_usuario', JSON.stringify(usuario));
    } else {
      localStorage.removeItem('sm_usuario');
    }
  }, [usuario]);

  useEffect(() => {
    localStorage.setItem('sm_mensagens', JSON.stringify(mensagens));
  }, [mensagens]);

  // ===== AÇÕES =====

  // Login mockado
  function login(tipo, id) {
    if (tipo === 'aluno') {
      const aluno = alunos.find((a) => a.id === id);
      setUsuario({ tipo: 'aluno', ...aluno });
    } else {
      const empresa = empresas.find((e) => e.id === id);
      setUsuario({ ...empresa, tipo: 'empresa', tipo_negocio: empresa.tipo });
    }
  }

  function logout() {
    setUsuario(null);
    localStorage.removeItem('sm_usuario');
  }

  // Resetar dados para demonstração
  function resetData() {
    setAlunos(ALUNOS);
    setProjetos(PROJETOS);
    setMensagens([]);
    setUsuario(null);
    localStorage.clear();
  }

  // Candidatar-se a um projeto
  function candidatar(projetoId, mensagem) {
    if (!usuario || usuario.tipo !== 'aluno') return;
    if (usuario.em_projeto) return;

    setProjetos((prev) =>
      prev.map((p) => {
        if (p.id !== projetoId) return p;
        // Verifica se já se candidatou
        if (p.candidaturas.some((c) => c.aluno_id === usuario.id)) return p;
        // Verifica se vagas estão preenchidas
        if (p.time.length >= p.vagas) return p;
        return {
          ...p,
          candidaturas: [
            ...p.candidaturas,
            { aluno_id: usuario.id, data: new Date().toISOString().split('T')[0], mensagem },
          ],
        };
      })
    );
  }

  // Empresa aceita candidato
  function aceitarCandidato(projetoId, alunoId) {
    setProjetos((prev) =>
      prev.map((p) => {
        if (p.id !== projetoId) return p;
        if (p.time.length >= p.vagas) return p;
        const novoTime = [...p.time, alunoId];
        const novasCandidaturas = p.candidaturas.filter((c) => c.aluno_id !== alunoId);
        const novoStatus = novoTime.length >= p.vagas ? 'em_andamento' : p.status;
        return { ...p, time: novoTime, candidaturas: novasCandidaturas, status: novoStatus };
      })
    );

    setAlunos((prev) =>
      prev.map((a) => {
        if (a.id !== alunoId) return a;
        return { ...a, em_projeto: true, projeto_ativo_id: projetoId };
      })
    );

    // Atualiza usuario se for o aluno aceito
    if (usuario && usuario.id === alunoId) {
      setUsuario((prev) => ({ ...prev, em_projeto: true, projeto_ativo_id: projetoId }));
    }
  }

  // Empresa rejeita candidato
  function rejeitarCandidato(projetoId, alunoId) {
    setProjetos((prev) =>
      prev.map((p) => {
        if (p.id !== projetoId) return p;
        return {
          ...p,
          candidaturas: p.candidaturas.filter((c) => c.aluno_id !== alunoId),
        };
      })
    );
  }

  // Marcar entrega como concluída
  function toggleEntrega(projetoId, entregaId) {
    setProjetos((prev) =>
      prev.map((p) => {
        if (p.id !== projetoId) return p;
        return {
          ...p,
          entregas: p.entregas.map((e) =>
            e.id === entregaId ? { ...e, concluido: !e.concluido } : e
          ),
        };
      })
    );
  }

  // Concluir projeto
  function concluirProjeto(projetoId) {
    const projeto = projetos.find((p) => p.id === projetoId);
    if (!projeto) return;

    setProjetos((prev) =>
      prev.map((p) => (p.id === projetoId ? { ...p, status: 'concluido' } : p))
    );

    // Libera todos os alunos do time
    setAlunos((prev) =>
      prev.map((a) => {
        if (!projeto.time.includes(a.id)) return a;
        return { ...a, em_projeto: false, projeto_ativo_id: null };
      })
    );

    if (usuario && usuario.tipo === 'aluno' && projeto.time.includes(usuario.id)) {
      setUsuario((prev) => ({ ...prev, em_projeto: false, projeto_ativo_id: null }));
    }
  }

  // Criar novo projeto (empresa)
  function criarProjeto(dadosProjeto) {
    if (!usuario || usuario.tipo !== 'empresa') return;

    const novoProjeto = {
      id: `proj_${Date.now()}`,
      empresa_id: usuario.id,
      titulo: dadosProjeto.titulo,
      descricao: dadosProjeto.descricao,
      categoria: dadosProjeto.categoria,
      nivel_requerido: dadosProjeto.nivel_requerido,
      vagas: dadosProjeto.vagas,
      vagas_detalhes: dadosProjeto.vagas_detalhes || [],
      time: [],
      candidaturas: [],
      status: 'aberto',
      entregas: dadosProjeto.entregas || [],
      tecnologias: dadosProjeto.tecnologias || [],
      data_criacao: new Date().toISOString().split('T')[0],
    };

    setProjetos((prev) => [...prev, novoProjeto]);
    return novoProjeto;
  }

  // Adicionar projeto externo ao portfólio
  function addProjetoExterno(projetoExterno) {
    if (!usuario || usuario.tipo !== 'aluno') return;

    setAlunos((prev) =>
      prev.map((a) => {
        if (a.id !== usuario.id) return a;
        return {
          ...a,
          portfolio_externo: [
            ...a.portfolio_externo,
            { ...projetoExterno, id: `pe_${Date.now()}` },
          ],
        };
      })
    );
  }

  // Remover projeto externo
  function removeProjetoExterno(projetoExternoId) {
    if (!usuario || usuario.tipo !== 'aluno') return;

    setAlunos((prev) =>
      prev.map((a) => {
        if (a.id !== usuario.id) return a;
        return {
          ...a,
          portfolio_externo: a.portfolio_externo.filter((pe) => pe.id !== projetoExternoId),
        };
      })
    );
  }

  // ===== CHAT / MENSAGENS =====

  // Gera um ID de conversa consistente entre dois usuários
  function getConversaId(userId1, userId2) {
    return [userId1, userId2].sort().join('_');
  }

  // Envia uma mensagem
  function enviarMensagem(destinatarioId, texto) {
    if (!usuario || !texto.trim()) return;

    const novaMensagem = {
      id: `msg_${Date.now()}`,
      conversa_id: getConversaId(usuario.id, destinatarioId),
      remetente_id: usuario.id,
      destinatario_id: destinatarioId,
      texto: texto.trim(),
      timestamp: new Date().toISOString(),
      lida: false,
    };

    setMensagens((prev) => [...prev, novaMensagem]);
  }

  // Marca mensagens de uma conversa como lidas
  function marcarComoLida(conversaId) {
    if (!usuario) return;
    setMensagens((prev) =>
      prev.map((m) =>
        m.conversa_id === conversaId && m.destinatario_id === usuario.id && !m.lida
          ? { ...m, lida: true }
          : m
      )
    );
  }

  // Retorna todas as conversas do usuário logado
  function getConversas() {
    if (!usuario) return [];

    const conversasMap = {};
    mensagens.forEach((m) => {
      if (m.remetente_id !== usuario.id && m.destinatario_id !== usuario.id) return;
      const outroId = m.remetente_id === usuario.id ? m.destinatario_id : m.remetente_id;
      const conversaId = m.conversa_id;

      if (!conversasMap[conversaId]) {
        conversasMap[conversaId] = {
          id: conversaId,
          outroUsuarioId: outroId,
          ultimaMensagem: m,
          naoLidas: 0,
        };
      }

      // Atualiza última mensagem se for mais recente
      if (new Date(m.timestamp) > new Date(conversasMap[conversaId].ultimaMensagem.timestamp)) {
        conversasMap[conversaId].ultimaMensagem = m;
      }

      // Conta não lidas
      if (m.destinatario_id === usuario.id && !m.lida) {
        conversasMap[conversaId].naoLidas++;
      }
    });

    return Object.values(conversasMap).sort(
      (a, b) => new Date(b.ultimaMensagem.timestamp) - new Date(a.ultimaMensagem.timestamp)
    );
  }

  // Retorna mensagens de uma conversa específica
  function getMensagensConversa(conversaId) {
    return mensagens
      .filter((m) => m.conversa_id === conversaId)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }

  // Total de mensagens não lidas
  function getTotalNaoLidas() {
    if (!usuario) return 0;
    return mensagens.filter((m) => m.destinatario_id === usuario.id && !m.lida).length;
  }

  // Helpers
  function getEmpresa(id) {
    return empresas.find((e) => e.id === id);
  }

  function getAluno(id) {
    return alunos.find((a) => a.id === id);
  }

  function getProjetosDoAluno(alunoId) {
    return projetos.filter((p) => p.time.includes(alunoId));
  }

  function getProjetosDaEmpresa(empresaId) {
    return projetos.filter((p) => p.empresa_id === empresaId);
  }

  const value = {
    empresas,
    alunos,
    projetos,
    usuario,
    login,
    logout,
    resetData,
    candidatar,
    aceitarCandidato,
    rejeitarCandidato,
    toggleEntrega,
    concluirProjeto,
    addProjetoExterno,
    removeProjetoExterno,
    getEmpresa,
    getAluno,
    getProjetosDoAluno,
    getProjetosDaEmpresa,
    criarProjeto,
    enviarMensagem,
    marcarComoLida,
    getConversas,
    getMensagensConversa,
    getConversaId,
    getTotalNaoLidas,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp deve ser usado dentro de AppProvider');
  return context;
}
