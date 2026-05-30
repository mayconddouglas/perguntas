export type QuestionType = 'text' | 'textarea' | 'radio' | 'checkbox';

export interface Question {
  id: string;
  label: string;
  type: QuestionType;
  options?: string[];
  placeholder?: string;
}

export interface Category {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

export const briefingData: Category[] = [
  {
    id: 'empresa',
    title: 'Sobre a Empresa',
    description: 'Vamos começar conhecendo a essência do seu negócio.',
    questions: [
      { id: 'nome', label: 'Qual é o nome da empresa?', type: 'text', placeholder: 'Ex: Brazeo AI' },
      { id: 'slogan', label: 'A empresa possui slogan?', type: 'text', placeholder: 'Se sim, qual?' },
      { id: 'historia_surgimento', label: 'Como surgiu a empresa?', type: 'textarea', placeholder: 'Conte um pouco da história de fundação...' },
      { id: 'tempo_existencia', label: 'Há quanto tempo ela existe?', type: 'text' },
      { id: 'missao', label: 'Qual é a missão da empresa?', type: 'textarea' },
      { id: 'valores', label: 'Quais valores a empresa defende?', type: 'textarea' },
      { id: 'diferencial', label: 'O que diferencia vocês dos concorrentes?', type: 'textarea' },
      { id: 'problema_resolve', label: 'Qual problema principal vocês resolvem?', type: 'textarea' },
      { id: 'percepcao', label: 'Como vocês querem ser percebidos pelos clientes?', type: 'textarea' },
      { id: 'historia_forte', label: 'Existe alguma história forte ou interessante da empresa?', type: 'textarea' },
    ]
  },
  {
    id: 'objetivo',
    title: 'Objetivo do Site',
    description: 'Isso é CRÍTICO. O que o site precisa fazer por você?',
    questions: [
      { 
        id: 'principal_objetivo', 
        label: 'Qual o principal objetivo do site?', 
        type: 'checkbox',
        options: [
          'Gerar vendas diretas', 'Captar leads (contatos)', 'Mostrar autoridade', 
          'Atrair clientes locais', 'Agendamentos', 'Catálogo de Produtos', 
          'Portfólio', 'Divulgação institucional', 'Atendimento automático'
        ]
      },
      { id: 'acao_visitante', label: 'O que você espera que o visitante faça ao entrar no site?', type: 'textarea', placeholder: 'Ex: Preencher um formulário, chamar no WhatsApp...' },
      { id: 'site_perfeito', label: 'Qual seria um "site perfeito" pra você?', type: 'textarea' },
    ]
  },
  {
    id: 'publico',
    title: 'Público-Alvo',
    description: 'Sem isso o design vira "achismo". Quem nós queremos atingir?',
    questions: [
      { id: 'cliente_ideal', label: 'Quem é o cliente ideal?', type: 'textarea' },
      { id: 'faixa_etaria', label: 'Faixa etária predominante?', type: 'text', placeholder: 'Ex: 25 a 45 anos' },
      { id: 'genero', label: 'Gênero prioritário?', type: 'radio', options: ['Homem', 'Mulher', 'Ambos na mesma proporção', 'Foco mais B2B (Empresas)'] },
      { id: 'regiao', label: 'Qual cidade/região ou estado vocês atendem?', type: 'text' },
      { id: 'classe_social', label: 'Qual classe social predominante?', type: 'text' },
      { id: 'perfil_compra', label: 'O cliente costuma comprar rápido ou pesquisar bastante?', type: 'radio', options: ['Compra por impulso/rápida', 'Pesquisa muito antes', 'Depende do ticket'] },
      { id: 'dores', label: 'Quais dores (problemas) o cliente geralmente tem antes de te procurar?', type: 'textarea' },
      { id: 'motivo_confianca', label: 'O que faz o cliente confiar em vocês?', type: 'textarea' },
      { id: 'impedimento_compra', label: 'O que normalmente impede alguém de comprar (objeção)?', type: 'textarea' },
      { id: 'estilo_publico', label: 'O público é mais:', type: 'radio', options: ['Conservador', 'Moderno', 'Premium/Luxo', 'Popular/Acessível'] },
    ]
  },
  {
    id: 'produtos_servicos',
    title: 'Produtos ou Serviços',
    description: 'O que e como você vende.',
    questions: [
      { id: 'lista_produtos', label: 'Quais serviços/produtos vocês oferecem?', type: 'textarea' },
      { id: 'produto_principal', label: 'Qual é o serviço/produto principal (carro-chefe)?', type: 'text' },
      { id: 'produto_lucrativo', label: 'Qual o mais lucrativo?', type: 'text' },
      { id: 'produto_destaque', label: 'Existe algum que vocês querem destacar mais no site?', type: 'text' },
      { id: 'processo_compra', label: 'Como funciona o processo de compra ou contratação?', type: 'textarea' },
      { id: 'trabalha_orcamento', label: 'Vocês trabalham com orçamento personalizado?', type: 'radio', options: ['Sim', 'Não, preço fixo e aberto', 'Depende do serviço'] },
      { id: 'formato_atendimento', label: 'Atendimento:', type: 'radio', options: ['100% Online', 'Presencial', 'Híbrido'] },
      { id: 'prazo_entrega', label: 'Existe prazo médio de entrega/execução?', type: 'text' },
      { id: 'garantia', label: 'Existe garantia?', type: 'text' },
      { id: 'faq_clientes', label: 'Quais perguntas os clientes mais fazem no atendimento?', type: 'textarea' },
    ]
  },
  {
    id: 'concorrencia',
    title: 'Concorrência',
    description: 'Muito importante para o posicionamento e diferenciação.',
    questions: [
      { id: 'concorrentes_diretos', label: 'Quem vocês consideram concorrentes diretos?', type: 'textarea' },
      { id: 'sites_aprovados', label: 'Quais sites de concorrentes vocês acham bons/gostam?', type: 'textarea' },
      { id: 'sites_reprovados', label: 'O que vocês NÃO gostam em sites de concorrentes?', type: 'textarea' },
      { id: 'empresa_admirada', label: 'Existe alguma empresa (mesmo de outro setor) que vocês admiram muito?', type: 'textarea' },
      { id: 'vantagem_competitiva', label: 'O que vocês fazem comprovadamente melhor que os concorrentes?', type: 'textarea' },
    ]
  },
  {
    id: 'visual',
    title: 'Identidade Visual',
    description: 'A cara da sua marca na internet.',
    questions: [
      { id: 'tem_logotipo', label: 'Já possuem logotipo em alta resolução?', type: 'radio', options: ['Sim', 'Não', 'Sim, mas queremos refazer'] },
      { id: 'manual_marca', label: 'Possuem manual da marca (Brandbook)?', type: 'radio', options: ['Sim', 'Não'] },
      { id: 'cores', label: 'Quais cores representam a empresa hoje?', type: 'text' },
      { id: 'estilo_visual', label: 'O estilo visual do site deve ser (múltipla escolha):', type: 'checkbox', options: ['Moderno', 'Minimalista', 'Premium', 'Agressivo', 'Elegante', 'Corporativo', 'Jovem', 'Tecnológico'] },
      { id: 'banco_midia', label: 'Possuem fotos e vídeos profissionais da estrutura/equipe?', type: 'radio', options: ['Sim, fotos e vídeos bons', 'Temos algumas amadoras', 'Não temos nada ainda'] },
    ]
  },
  {
    id: 'estrutura',
    title: 'Estrutura do Site',
    description: 'A fundação da casa.',
    questions: [
      { id: 'paginas_desejadas', label: 'Quais páginas vocês imaginam pro site?', type: 'checkbox', options: ['Home (Página Inicial)', 'Sobre Nós', 'Serviços/Produtos', 'Blog', 'Contato', 'FAQ / Dúvidas', 'Portfólio', 'Depoimentos', 'Landing Page única (Menu âncora)'] },
      { id: 'recursos_extras', label: 'Quais integrações/recursos serão necessários?', type: 'checkbox', options: ['Área de Login/Membros', 'Botão WhatsApp', 'Formulário de Contato', 'Integração de Feed do Instagram', 'Sistema de Agendamento Online', 'E-commerce / Pagamentos Online'] },
    ]
  },
  {
    id: 'conteudo',
    title: 'Conteúdo (Textos e Imagens)',
    description: 'Isso evita muito retrabalho.',
    questions: [
      { id: 'tem_textos', label: 'Vocês já possuem todos os textos que vão no site?', type: 'radio', options: ['Sim, tudo pronto', 'Temos uma base, precisa melhorar', 'Não, precisarei que você/copywriter escreva'] },
      { id: 'banco_imagens', label: 'Precisam que usemos banco de imagens para ilustrar?', type: 'radio', options: ['Sim', 'Não, usaremos apenas fotos próprias'] },
      { id: 'provas_sociais', label: 'Possuem material para prova social?', type: 'checkbox', options: ['Depoimentos em texto/print', 'Vídeos de clientes', 'Cases de sucesso analisados', 'Nenhum ainda'] },
    ]
  },
  {
    id: 'seo',
    title: 'SEO e Marketing',
    description: 'Como as pessoas vão encontrar esse site.',
    questions: [
      { id: 'palavras_chave', label: 'Quais palavras os clientes pesquisariam no Google pra encontrar vocês?', type: 'textarea', placeholder: 'Ex: "escritório de advocacia em SP", "comprar peças de moto"' },
      { id: 'google_meu_negocio', label: 'Já tem e usam o Google Meu Negócio / Maps?', type: 'radio', options: ['Sim, bem ativo', 'Temos feito mas parado', 'Não temos'] },
      { id: 'trafego_pago', label: 'Já fazem ou vão fazer Tráfego Pago (Ads)?', type: 'radio', options: ['Sim', 'Não', 'Em breve'] },
      { id: 'captacao', label: 'Existe estratégia de captação de leads (Isca digital, e-book, newsletter)?', type: 'textarea' },
    ]
  },
  {
    id: 'autoridade',
    title: 'Autoridade e Provas Sociais',
    description: 'Passos para gerar extrema confiança.',
    questions: [
      { id: 'avaliacoes_google', label: 'Como estão as avaliações de vocês no Google?', type: 'text', placeholder: 'Ex: "Temos 150 avaliações com nota 4.9"' },
      { id: 'numeros_relevantes', label: 'Quais números podem impressionar no site?', type: 'textarea', placeholder: 'Ex: "+5.000 clientes atendidos", "10 anos de mercado"...' },
      { id: 'certificacoes', label: 'Possuem parceiros de peso, certificações ou prêmios que merecem destaque?', type: 'textarea' },
    ]
  },
  {
    id: 'tecnica',
    title: 'Estrutura Técnica',
    description: 'Configurações de servidor.',
    questions: [
      { id: 'dominio', label: 'Já possuem Domínio registrado (www.suaempresa.com.br)?', type: 'radio', options: ['Sim', 'Não'] },
      { id: 'hospedagem', label: 'Já possuem plano de hospedagem contratado?', type: 'radio', options: ['Sim', 'Não'] },
      { id: 'manutencao', label: 'Quem será o responsável por manter/atualizar o site na empresa?', type: 'text' },
    ]
  },
  {
    id: 'conversao',
    title: 'Conversão e Estratégia',
    description: 'Voltando ao que interessa: resultados.',
    questions: [
      { id: 'principal_conversao', label: 'Como o cliente fecha negócio com vocês hoje?', type: 'radio', options: ['Pelo WhatsApp', 'Ligação / Telefone', 'Preenchendo Formulário', 'Checkout direto (E-commerce)', 'Reunião Presencial'] },
      { id: 'gatilho_confianca', label: 'Qual o principal gatilho que vira o jogo com um cliente indeciso?', type: 'textarea' },
      { id: 'nao_pode_faltar', label: 'Se o site tivesse só uma coisa, o que NÃO pode faltar de jeito nenhum?', type: 'textarea' },
    ]
  },
  {
    id: 'referencias',
    title: 'Referências Visuais',
    description: 'Para alinhar a expectativa estética.',
    questions: [
      { id: 'sites_inspira', label: 'Cole aqui os links de sites que você gosta visualmente e explica o porquê:', type: 'textarea' },
      { id: 'tecnologia_vs_humano', label: 'Prefere um viés mais tecnológico (moderno, frio, clean) ou mais humano (caloroso, fotos de pessoas, empatia)?', type: 'textarea' },
    ]
  },
  {
    id: 'logistica',
    title: 'Logística e Operação',
    description: 'Como o seu comercial lida com quem vem do site.',
    questions: [
      { id: 'horario_atendimento', label: 'Qual seu horário de atendimento?', type: 'text' },
      { id: 'tempo_resposta', label: 'Qual o tempo médio que sua equipe leva pra responder um contato que vem do site?', type: 'text' },
      { id: 'equipe_comercial', label: 'Existe equipe comercial dedicada recebendo esses contatos?', type: 'radio', options: ['Sim', 'Sou eu mesmo que atendo', 'Não, cai no atendimento geral'] },
    ]
  },
  {
    id: 'futuro',
    title: 'Planejamento Futuro',
    description: 'Para não precisar refazer o site daqui a 6 meses.',
    questions: [
      { id: 'visao_futuro', label: 'Onde a empresa quer estar em 1 a 2 anos?', type: 'textarea' },
      { id: 'expansao_tech', label: 'Pretendem adicionar algo desses no futuro?', type: 'checkbox', options: ['Vender online (E-commerce)', 'Área de Membros/Cursos', 'Sistema multi-idiomas', 'Blog robusto'] },
    ]
  },
  {
    id: 'extras',
    title: 'Perguntas Extras (Ouro)',
    description: 'Para eu entender o negócio como um sócio.',
    questions: [
      { id: 'dor_de_cabeca', label: 'O que mais gera dor de cabeça hoje na aquisição de clientes?', type: 'textarea' },
      { id: 'lucro_vs_trabalho', label: 'Qual serviço/produto dá mais dinheiro com o menor esforço hoje?', type: 'textarea' },
      { id: 'educacao_cliente', label: 'O que vocês mais perdem tempo tendo que explicar pros clientes, que o site já poderia deixar claro?', type: 'textarea' },
      { id: 'personalidade_marca', label: 'Se a marca fosse uma pessoa famosa ou personagem, quem ela seria no seu tom de voz?', type: 'text' },
    ]
  }
];
