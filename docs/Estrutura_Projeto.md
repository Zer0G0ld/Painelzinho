# 🗂️ Estrutura do Projeto Painelzinho

Este documento descreve a estrutura de pastas e arquivos do **Painelzinho**, um plugin animado para OBS Studio, explicando o papel de cada item no projeto.

---

## **common/**  
Recursos compartilhados globalmente e utilitários.

- **css/** – estilos globais e ícones:
  - `cp-icons.css` – ícones customizados para o painel.  
  - `style-control_panel.css` – estilo base do painel dockável.  
  - `style-source.css` – estilo do browser-source.  
  - **themes/** – temas pré-definidos:
    - `acri/theme.css` – tema “acri”.  
    - `dark/theme.css` – tema escuro padrão.  
    - `rachni/theme.css` – tema “rachni”.  

- **js/** – scripts utilitários globais:
  - `hotkeys.js` – funções de suporte para hotkeys.  
  - `jquery.js` – biblioteca jQuery.  
  - `jquery-ui.js` – biblioteca jQuery UI (sortable, drag & drop, etc).  
  - `jscolor.js` – biblioteca de seleção de cores.  

---

## **docs/**  
Documentação do projeto.

- `browser-source.md` – instruções de uso da browser source no OBS.

---

## **index.html**  
Página inicial ou demo do Painelzinho fora do OBS.

---

## **LICENSE**  
Arquivo de licença do projeto (GNU GPL v3).

---

## **logos/**  
Imagens de logos para os Painelzinhos.  

- `logo_1.png`  
- `logo_2.png`  
- `logo_3.png`  
- `logo_4.png`  

---

## **Painelzinho/**  
Código principal do plugin.

### HTML
- `browser-source.html` – fonte de navegador que exibe os Painelzinhos no OBS.  
- `control.html` – painel de controle simples.  
- `control-panel.html` – painel dockável dentro do OBS.  

### CSS
- `browser-source.css` – estilos para browser-source.  
- `control-panel.css` – estilos para painel dockável.  

### JS
- `browser-source.js` – animação e exibição dos Painelzinhos.  
- `control-panel.js` – lógica do painel dockável, integra todos os módulos do `controlUtils`.  

#### **controlUtils/** – módulos utilitários JS
- **core/** – funcionalidades centrais:
  - `defaults.js` – configurações padrão.  
  - `settings.js` – gerenciamento de configurações globais.  
  - `slot-navigation.js` – navegação entre slots.  
  - `state.js` – estado interno do painel.  
  - `storage.js` – persistência em `localStorage`.  

- **fonts/** – gerenciamento de fontes:
  - `fonts-manager.js` – funções para manipular listas de fontes.  
  - `fontsUI.js` – integração UI, eventos e sortable de fontes.  

- **hotkeys/** – atalhos de teclado:
  - `hotkeys-core.js` – lógica central de hotkeys.  
  - `hotkeys.js` – atalhos padrões do painel.  
  - `hotkeys-ui.js` – integração com a interface.  

- **slots/** – gerenciamento de slots:
  - `slots.js` – criação e manipulação de slots.  
  - `memory-slots.js` – armazenamento temporário dos slots.  

- **ui/** – interface do painel:
  - `accordion.js` – abas/accordion do painel.  
  - `appearance.js` – ajustes visuais.  
  - `popup-logos.js` – gerencia janelas popup de logos.  
  - `preview.js` – preview dos Painelzinhos antes de exibir.  
  - `ui-utils.js` – funções utilitárias da UI.  

- `channels.js` – gerenciamento de canais ou streams.  
- `themeManager.js` – gerenciamento e aplicação de temas.  
- `index.js` – hub que reexporta todos os módulos do `controlUtils`.  

### Lua
- `painelzinho_hotkeys.lua` – script para integrar hotkeys do Painelzinho com OBS via Lua.

---

## **README.md**  
Documentação principal do projeto, instalação, uso e contribuições.

---

## 💡 Observações
1. Todos os módulos JS exportam suas funções e constantes individualmente.  
2. `index.js` no `controlUtils` funciona como hub, facilitando importações únicas no `control-panel.js`.  
3. Estrutura modular facilita manutenção, escalabilidade e adição de novos recursos.

---

