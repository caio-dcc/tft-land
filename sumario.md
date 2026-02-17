# Sumário do Projeto TFT Next.js

Este projeto é uma aplicação web construída com **Next.js (App Router)** e **TypeScript**, projetada para consumir a **API oficial da Riot Games (TFT)** de forma segura e escalável.

## 🚀 Como Rodar Localmente

1.  **Pré-requisitos**:
    - Node.js instalado (v18+ recomendado).
    - Uma chave de API da Riot (Riot Development API Key). Obtenha em [developer.riotgames.com](https://developer.riotgames.com/).

2.  **Configuração de Ambiente**:
    - Crie um arquivo `.env.local` na raiz do projeto (`d:/tft-list/`).
    - Adicione sua chave de API:
      ```env
      RIOT_API_KEY=RGAPI-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
      ```

3.  **Instalação e Execução**:

    ```bash
    npm install
    npm run dev
    ```

    - Acesse `http://localhost:3000`.
    - Verifique o **terminal onde o servidor está rodando** para ver o log da resposta da API (JSON).

## 📂 Arquitetura de Pastas

A estrutura foi pensada para separar responsabilidades e facilitar a manutenção:

- **`src/app/`**: Contém as rotas e páginas do Next.js (App Router).
  - `page.tsx`: Página inicial com busca de invocador.
  - `profile/[riotId]/page.tsx`: Página de perfil dinâmica (exibe ícone, nível e ID).
- **`src/services/`**: Camada de comunicação com APIs externas.
  - `riotApi.ts`: Centraliza a lógica de requisição para a Riot, incluindo tratamento de erros e injeção segura da API Key.
- **`src/types/`**: Definições de tipos TypeScript.
  - `tft.ts`: Interfaces que modelam as respostas da API do TFT (ex: `PlatformDataDTO`, `SummonerDTO`).
- **`src/components/`**: (Preparado) Para componentes de UI reutilizáveis.

## 📈 Diretrizes de Escalabilidade

### Adicionando Novos Endpoints

1.  Verifique a documentação da Riot para o novo endpoint.
2.  Crie as interfaces correspondentes em `src/types/tft.ts`.
3.  Adicione uma função exportada em `src/services/riotApi.ts` que utiliza `fetchRiotApi`.

### Gerenciamento de Estado

Para funcionalidades futuras complexas (ex: Builder de comps, Filtros):

- Prefira **Server Actions** ou **URL Search Params** para estado compartilhável via URL.
- Use `Context API` ou bibliotecas como **Zustand** apenas se necessário para estado global do cliente (ex: carrinho, preferências de usuário).

### Cache e Rate Limiting

- **Next.js Cache**: O `fetch` do Next.js já suporta cache. Configure `revalidate` nas opções do fetch em `riotApi.ts` para dados que mudam pouco (ex: Status).
- **Riot Rate Limits**: A estrutura atual prepara o terreno para adicionar um "Leaky Bucket" ou fila de requisições em `riotApi.ts` se o tráfego aumentar, respeitando os headers `X-App-Rate-Limit`.

## 🔒 Boas Práticas de Segurança (AppSec)

1.  **API Key Oculta**: A `RIOT_API_KEY` é lida via `process.env` apenas no servidor. O código em `riotApi.ts` lança erro se executado no browser (`typeof window !== 'undefined'`).
2.  **Proxy Server-Side**: O cliente (browser) nunca chama a Riot diretamente. O Next.js atua como proxy, protegendo a credencial.
3.  **Validação de Tipos**: O uso de TypeScript garante que os dados manipulados estejam conformes com o esperado, reduzindo erros de runtime.
