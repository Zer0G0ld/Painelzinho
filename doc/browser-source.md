# Documentação do arquivo `browser-source.js`

## Sumário

1. [Visão Geral](#visão-geral)
2. [Estrutura do Arquivo](#estrutura-do-arquivo)
3. [Descrição das Seções](#descrição-das-seções)

   * Funções Utilitárias
   * Configuração Inicial e Variáveis Globais
   * Funções de Animação
   * Controle de Tempo dos Painelzinhos
   * Manipulação de Logos
   * Recepção de Dados dos Canais
   * Atualização de Estilos e Propriedades CSS
   * Envio de Dados para o Painel de Controle
   * Loop de Atualização
   * Finalização e Limpeza
4. [Comunicação via BroadcastChannel](#comunicação-via-broadcastchannel)
5. [Uso de Variáveis CSS Custom Properties](#uso-de-variáveis-css-custom-properties)
6. [Observações](#observações)

---

## Visão Geral

O arquivo `browser-source.js` é responsável por gerenciar a interface dinâmica dos *Painelzinhos* (sobreposições inferiores) usados em transmissões OBS. Ele recebe dados via `BroadcastChannel`, processa e atualiza elementos visuais, animações, tempos e estilos CSS de forma dinâmica.

---

## Estrutura do Arquivo

O arquivo está organizado em seções numeradas e comentadas, que facilitam a leitura e manutenção:

| Seção                                        | Descrição                                                       |
| -------------------------------------------- | --------------------------------------------------------------- |
| 1. Funções Utilitárias                       | Funções auxiliares genéricas, ex: leitura de parâmetros de URL. |
| 2. Configuração Inicial e Variáveis Globais  | Inicialização de variáveis, canais e estruturas de estado.      |
| 3. Funções de Animação                       | Controle das classes de animação dos elementos.                 |
| 4. Controle de Tempo dos Painelzinhos        | Lógica para temporização de exibição ativa e inativa.           |
| 5. Manipulação de Logos                      | Funções para mostrar/esconder logos e carregar imagens.         |
| 6. Recepção de Dados dos Canais              | Processamento dos dados recebidos via BroadcastChannel.         |
| 7. Atualização de Estilos e Propriedades CSS | Atualização das variáveis CSS custom properties dinamicamente.  |
| 8. Envio de Dados para o Painel de Controle  | Envio periódico do estado atual para controle externo.          |
| 9. Loop de Atualização                       | Timer para atualização periódica e reenvio inicial de dados.    |
| 10. Finalização e Limpeza                    | Limpeza dos canais e timers ao fechar a página.                 |

---

## Descrição das Seções

### 1. Funções Utilitárias

* `getUrlParameter(sParam)`
  Recupera parâmetros da URL da página. Retorna `undefined` se não existe, `true` se existe sem valor e o valor se existe.

---

### 2. Configuração Inicial e Variáveis Globais

* Variável `mode` obtém o parâmetro `mode` da URL para definir modo `preview`.
* Inicializa canais de comunicação (`BroadcastChannel`).
* Define a estrutura `alts` para armazenar estado interno de cada Painelzinho (ex: contadores, flags).

---

### 3. Funções de Animação

* `animationIn(id)` e `animationOut(id)` adicionam/removem classes para controlar animações CSS.

---

### 4. Controle de Tempo dos Painelzinhos

* Estrutura `lowerThirds` para cada Painelzinho armazenar contadores, timers e flags de estado.
* Funções recursivas `activeCount` e `inactiveCount` controlam o tempo de exibição ativa e inativa.
* Funções `startActiveCount`, `startInactiveCount` e `stopTimeCount` para iniciar e parar contagem e animações.

---

### 5. Manipulação de Logos

* `changeLogoVisibility(...)` controla se o logo de cada Painelzinho será mostrado ou não.
* `loadLogo(alt, logo)` carrega a imagem do logo no elemento indicado.

---

### 6. Recepção de Dados dos Canais

* Evento `bcp.onmessage` recebe dados dos canais.
* Função `processAlt(i)` processa os dados recebidos para o Painelzinho `i`, extraindo propriedades e atualizando UI.
* Atualiza textos, classes CSS, logos e estados conforme dados recebidos.
* Aplica variáveis CSS custom properties para controlar estilos visuais.

---

### 7. Atualização de Estilos e Propriedades CSS

* Dentro do processamento de dados, atualiza dinamicamente variáveis CSS no `document.documentElement.style` usando `setProperty`.

---

### 8. Envio de Dados para o Painel de Controle

* Função `function_send()` monta e envia dados de tempo (ativo e inativo) e flags para o painel de controle via BroadcastChannel `bcr`.
* Função `refreshData()` chama `function_send` periodicamente, exceto no modo preview.

---

### 9. Loop de Atualização

* Configura `setInterval` para chamar `refreshData` a cada 1 segundo.
* Envia mensagem inicial para solicitar reenvio de dados.

---

### 10. Finalização e Limpeza

* Função `cleanup()` limpa intervalos e fecha canais para evitar vazamento de recursos.
* Associada ao evento `beforeunload` para garantir execução ao fechar a página.

---

## Comunicação via BroadcastChannel

| Canal                       | Propósito                                |
| --------------------------- | ---------------------------------------- |
| `obs-painelzinhos-channel`  | Receber dados do painel de controle      |
| `obs-painelzinhos-channel2` | Enviar dados para o painel de controle   |
| `obs-painelzinhos-fonts`    | Receber atualizações de fontes dinâmicas |

---

## Uso de Variáveis CSS Custom Properties

O arquivo define muitas variáveis CSS customizadas no formato `--alt-<n>-<propriedade>`, usadas para controlar tamanhos, cores, margens, fontes, animações e sombras de cada Painelzinho, permitindo ajustes dinâmicos sem alterar diretamente o CSS estático.

---

## Observações

* O código usa jQuery para manipulação básica do DOM e alteração de atributos.
* O uso do modo `preview` altera o comportamento dos timers e exibições para facilitar testes.
* Muitas propriedades são configuráveis via dados recebidos, permitindo personalização visual completa.
* A estrutura facilita suporte para até 4 Painelzinhos simultâneos.
