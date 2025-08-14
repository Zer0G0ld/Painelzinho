# 🧃 Painelzinho – Painelzinhos Animado para OBS

O **Painelzinho** é um plugin leve e personalizável para o OBS Studio que permite adicionar _Painelzinhos_ animados (barras informativas) com controle total por um painel dockável dentro do OBS.

Inspirado em projetos como o *Animated Lower Thirds*, mas com uma pegada única, visual mais moderno, suporte a temas e melhorias pensadas para streamers e produtores de conteúdo em PT-BR e além.

---

## ✨ Funcionalidades

- 🎬 Painelzinhos animados com estilos variados
- 🎛️ Painel de controle dockável no OBS (HTML/CSS/JS)
- 🎨 Suporte a temas personalizados (dark, light, etc)
- 🔠 Personalização de texto, cores, ícones e logos
- 🎹 Suporte a atalhos de teclado (hotkeys)
- ⚙️ Leve, sem dependências externas ou instalações complicadas

---

## Links Uteis

- [Documentação](./docs/)
- [Browser Source](./docs/Browser_Source.md)
- [Estruturaa do Projeto](./docs/Estrutura_Projeto.md)

---

## 🚀 Como instalar

1. Baixe o arquivo `.zip` com os arquivos do Painelzinho.
2. Extraia para uma pasta de fácil acesso.
3. No OBS, vá em **Ferramentas > Scripts** e adicione o `painelzinho.lua`.
4. Para o painel dockável, vá em **Janela > Docks > Painelzinho** e abra o `control-panel.html`.
5. Para usar como fonte, adicione uma **Fonte de Navegador** apontando para o `browser-source.html`.

---

## 📁 Estrutura

Tudo explicado melhor aqui [PROJECT_STRUCTURE](./docs/Estrutura_Projeto.md)

```bash

Painelzinho/
├── common/                              # Arquivos compartilhados que não pertencem diretamente à lógica do Painelzinho, mas são utilitários ou recursos globais
│   ├── css/                             # estilos globais e ícones usados em várias partes do projeto
│   │   ├── cp-icons.css                 # ícones customizados para o painel e botões
│   │   ├── style-control_panel.css      # estilo base do painel dockável
│   │   ├── style-source.css             # estilo da fonte do navegador/browser-source
│   │   └── themes/                      # temas pré-definidos
│   │       ├── acri/
│   │       │   └── theme.css
│   │       ├── dark/
│   │       │   └── theme.css
│   │       └── rachni/
│   │           └── theme.css
│   └── js/                              # scripts utilitários globais
│       ├── hotkeys.js
│       ├── jquery.js
│       ├── jquery-ui.js
│       └── jscolor.js
├── docs/                                # Documentação do projeto
│   └── Browser_Source.md                # explica como usar a browser source do Painelzinho no OBS
│   └── Estrutura_Projeto.md             # explica a estrutura atual e atualiza com novas funções
├── index.html
├── LICENSE                              # Arquivo de licença do projeto (GNU GPL v3).
├── logos/                               # Imagens de logos que podem ser usadas no painel ou nos Painelzinhos
│   ├── logo_1.png
│   ├── logo_2.png
│   ├── logo_3.png
│   └── logo_4.png
├── Painelzinho/                         # Código principal do Painelzinho
│   ├── browser-source.html             # fonte de navegador que exibe os Painelzinhos na cena do OBS
│   ├── control.html
│   ├── control-panel.html              # painel dockável no OBS, interface principal de controle
│   ├── css/
│   │   ├── browser-source.css
│   │   └── control-panel.css
│   ├── js/
│   │   ├── browser-source.js           # lógica de exibição e animação no browser-source
│   │   ├── control-panel.js            # lógica do painel dockável (chama módulos do controlUtils)
│   │   └── controlUtils/                # módulo central de utilitários JS, organizado por tema
│   │       ├── themeManager.js          # seleção e aplicação de temas
│   │       ├── channels.js              # gerenciamento de canais ou streams
│   │       ├── index.js                 # hub que reexporta todos os módulos do controlUtils
│   │       ├── core/                    # funcionalidades centrais do painel
│   │       │   ├── defaults.js          # configurações padrão do painel
│   │       │   ├── settings.js          # gerencia as configurações globais
│   │       │   ├── slot-navigation.js   # navegação entre slots de Painelzinhos
│   │       │   ├── state.js             # estado do painel, memória temporária
│   │       │   └── storage.js           # persistência no localStorage
│   │       ├── fonts/                   # gerenciamento de fontes
│   │       │   ├── fonts-manager.js     # funções de manipulação de listas de fontes
│   │       │   └── fontsUI.js           # interação da UI com fontes, eventos e sortable
│   │       ├── hotkeys/                 # atalhos de teclado
│   │       │   ├── hotkeys-core.js      # lógica central de hotkeys
│   │       │   ├── hotkeys.js           # atalhos padrões do painel
│   │       │   └── hotkeys-ui.js        # integração dos atalhos com a interface
│   │       ├── slots/                   # slots de Painelzinhos
│   │       │   ├── memory-slots.js      # armazenamento temporário de slots
│   │       │   └── slots.js             # criação e manipulação de slots
│   │       └── ui/                      # funções de interface
│   │           ├── accordion.js         # abas/accordion do painel
│   │           ├── appearance.js        # mudanças visuais (cores, tamanhos)
│   │           ├── popup-logos.js       # gerencia janelas popup com logos
│   │           ├── preview.js           # preview de Painelzinhos antes de exibir
│   │           └── ui-utils.js          # funções utilitárias gerais da UI
│   └── painelzinho_hotkeys.lua          # script do OBS para integrar hotkeys do Painelzinho com a API Lua do OBS
└── README.md                            # Arquivo de documentação principal do projeto, explicando instalação, uso e contribuições


```

---

## 🛠️ Requisitos

- OBS Studio 27+
- Sistema operacional: Windows / macOS / Linux
- Navegador interno do OBS habilitado

---

## 📦 Planejamento futuro

- 💡 Múltiplos perfis e presets salvos
- 🌐 Traduções (PT-BR / EN / ES)
- 🔔 Integrações com alertas (Twitch, YouTube, etc)
- 🧩 Plugin instalável via OBS Plugin Manager (futuramente)

---

## 📜 Licença

Distribuído sob a [GNU GPL v3](LICENSE). Você pode usar, estudar, modificar e redistribuir, desde que mantenha os créditos e a liberdade do código.

Licença MIT para código original [Animated Lower Thirds](https://obsproject.com/forum/resources/animated-lower-thirds-with-dockable-control-panel.1057/)  
Licença GPLv3 para código original Painelzinho

---

## 💬 Contribuição

Pull requests são bem-vindos! Envie ideias, temas ou melhorias. Vamos construir juntos algo útil e bonito pra galera do streaming 🎥

---

## 🙋‍♂️ Autor

Feito com carinho por **[Zer0G0ld]**  
🛠️ GitHub: [github.com/Zer0G0ld](https://github.com/Zer0G0ld)

