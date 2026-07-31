# 🏆 Tabela ACFDV

Site para organizar campeonatos de e-futebol (FIFA/EA Sports FC, eFootball) do zero: sorteio automático de grupos e mata-mata, tabelas de classificação, chaveamento visual, critérios de desempate configuráveis e suporte a jogos de ida e volta. Tudo salvo direto no navegador, sem backend.

[![Netlify Status](https://img.shields.io/badge/deploy-netlify-00C7B7?style=flat-square&logo=netlify&logoColor=white)](https://brunokobi.netlify.app/)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Zustand](https://img.shields.io/badge/state-zustand-443E38?style=flat-square)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)

## ✨ Funcionalidades

- **Sorteio automático** de equipes nos grupos e do chaveamento do mata-mata.
- **Fase de grupos**: tabela de classificação calculada automaticamente (pontos, saldo de gols, gols pró, confronto direto, ordem alfabética — critérios reordenáveis).
- **Mata-mata**: visão em tabela e visão em chaveamento (bracket), com W.O. automático quando o número de classificados não fecha em potência de 2, e W.O. manual em qualquer partida.
- **Ida e volta** configurável de forma independente para fase de grupos e mata-mata, com pênaltis quando o agregado empata.
- **Plataforma** (PS4 / PS5) e **jogo** (EA Sports FC 26 / eFootball) selecionáveis, com logo.
- **Persistência local**: tudo salvo automaticamente no `localStorage` do navegador. Botão de "Apagar tudo" na Configuração para zerar o campeonato.

## 🖥️ Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) como build tool
- [Tailwind CSS 4](https://tailwindcss.com/) para estilos
- [Zustand](https://github.com/pmndrs/zustand) para estado global, com persistência em `localStorage`
- [lucide-react](https://lucide.dev/) para ícones

## 🚀 Rodando localmente

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173` (ou a próxima porta livre).

Outros comandos:

```bash
npm run lint    # eslint
npm run build   # type-check (tsc) + build de produção
npm run preview # serve o build de produção localmente
```

## 📦 Deploy

Configurado para deploy estático direto no [Netlify](https://www.netlify.com/) (ver `netlify.toml`): build `npm run build`, publica a pasta `dist`.

## 📁 Estrutura

```
src/
  types.ts                 # modelo de domínio (times, grupos, partidas, config)
  lib/                     # lógica pura: round-robin, classificação, chaveamento
  store/                   # estado global (zustand + persist)
  components/
    config/                # configuração do campeonato
    groups/                # fase de grupos
    knockout/               # mata-mata (tabela + chaveamento)
    layout/                 # header, navegação, background, footer
    shared/                 # componentes reutilizáveis (score input, logo)
```

---

© 2026 [Bruno Kobi](https://brunokobi.netlify.app/). Todos os direitos reservados.
