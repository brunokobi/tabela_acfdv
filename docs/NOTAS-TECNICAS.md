# Notas técnicas

Conhecimento acumulado construindo este projeto — para consultar antes de mexer de novo
nessas áreas. Não é documentação de usuário (isso está no `README.md`).

## Ambiente de dev: WSL + Windows

O projeto mora dentro do filesystem do WSL (`\\wsl.localhost\Ubuntu-20.04\...`), mas o
Node/npm instalado no Windows **não consegue rodar `npm install`/`npm run` de forma
confiável** nesse caminho:

- `npm install` cria symlinks em `node_modules/.bin/` — o provedor de rede do Windows
  para o WSL (`\\wsl.localhost\...`) não lida bem com esses symlinks recém-criados e o
  npm quebra com `EISDIR`/`EPERM` no meio da instalação.
- `npm run <script>` no Windows invoca `cmd.exe`, que **não suporta UNC paths** como
  diretório de trabalho — falha silenciosamente ou com erro de path.
- Arquivos apagados via `wsl -d Ubuntu-20.04 -- rm ...` às vezes não "grudam" quando
  vistos pelo lado Windows logo em seguida (cache do redirector) — se um arquivo que
  deveria ter sumido ainda aparece, tente apagar de novo pelo lado Windows
  (`rm` no Git Bash ou `Remove-Item` no PowerShell) antes de investigar mais.

**Solução usada**: Node portátil instalado direto dentro do WSL, sem mexer no sistema:

```bash
# dentro da distro (uma vez só, já feito):
mkdir -p ~/.local && cd ~/.local
curl -sL https://nodejs.org/dist/v22.13.1/node-v22.13.1-linux-x64.tar.xz -o node.tar.xz
tar -xJf node.tar.xz && rm node.tar.xz && mv node-v22.13.1-linux-x64 node
```

Todo `npm install`/`npm run dev`/`npm run build`/`npm run lint` deve rodar **de dentro do
WSL**, não do Windows:

```bash
wsl -d Ubuntu-20.04 -- bash -lc 'export PATH="$HOME/.local/node/bin:$PATH"; cd /home/bruno/esports-bracket && npm run build'
```

Se estiver chamando isso a partir do Git Bash (Windows), prefixe com
`MSYS_NO_PATHCONV=1` e escreva o comando em um arquivo `.sh` antes de invocar via
`wsl -d Ubuntu-20.04 -- bash /caminho/para/o/script.sh` — passar comandos longos inline
para `wsl.exe` através do Git Bash costuma corromper paths com espaços/parênteses do
`PATH` do Windows herdado pela distro.

Edição de arquivos (Read/Write/Edit) funciona normalmente pelo caminho
`\\wsl.localhost\Ubuntu-20.04\...` — só operações de **execução de processos** (npm,
node) que precisam rodar de dentro da distro.

## Arquitetura: estado derivado, não duplicado

- **Classificação dos grupos** (`lib/standings.ts`): sempre calculada na hora a partir de
  `teams` + `groupMatches`, nunca guardada no store. Evita o estado ficar dessincronizado
  quando um placar antigo é corrigido.
- **Chaveamento do mata-mata** (`lib/bracket.ts`): a única coisa persistida é o sorteio da
  1ª rodada (`knockoutDraw.round1`, fixo) e os placares/pênaltis/W.O. digitados por
  partida (`knockoutRecords`, chaveados por `r{rodada}-m{indice}`). Quem joga em cada
  rodada seguinte é **sempre recalculado** a partir daí (`resolveTeams`/`resolveWinner`),
  nunca guardado como campo mutável. Isso é proposital: se alguém corrige um placar de
  uma rodada já "passada", a rodada seguinte recalcula sozinha, sem precisar de lógica de
  cascata/invalidação manual.

### Bug real encontrado e corrigido: bye vs. "ainda não decidido"

`resolveWinner` tinha uma regra "se um lado é null e o outro não, o outro venceu
automaticamente" — pensada só para os byes da rodada 1 (`round1` slot com `teamId: null`
é um bye de verdade, permanente). Só que essa mesma regra também disparava para
qualquer rodada seguinte cujo confronto anterior ainda não tinha vencedor definido
(nesse caso um lado é `null` só *temporariamente*, esperando resultado) — o time do outro
lado avançava sozinho **antes da hora**. Corrigido restringindo o auto-avanço de bye para
`round === 0` apenas; para as demais rodadas, os dois lados precisam estar resolvidos
antes de aplicar W.O./placar/pênaltis. Ver `resolveWinner` em `src/lib/bracket.ts`.

## Linhas do chaveamento (BracketView)

As linhas verdes conectando o time vencedor à vaga da próxima rodada **não são
calculadas por fórmula** — são medidas de verdade via `getBoundingClientRect()` de cada
linha de time (`TeamRow`), porque o layout usa `justify-content: space-around` (truque
leve de bracket sem lib externa), cujo espaçamento real não dá pra prever com matemática
simples. Ver `BracketView.tsx`: cada `TeamRow` registra sua posição num `Map` via ref
callback (`homeRowRef`/`awayRowRef` passados pelo `MatchCard`), e um `useLayoutEffect` +
`ResizeObserver` recalculam as linhas (SVG `<path>` em formato de cotovelo) sempre que os
dados ou o tamanho mudam. Só desenha a linha quando o confronto de origem já tem
vencedor definido — não linka para vagas ainda "A definir". A disputa de 3º lugar não
tem linha (a equipe que segue pra lá é a **perdedora**, não a vencedora, então não fazia
sentido reaproveitar a mesma lógica sem tratamento especial — ficou de fora por ora).

## Fundo "chuva matrix" (ParallaxBackground)

- Canvas 2D simples (`requestAnimationFrame`-like via `setInterval`), sem lib. Cada frame
  desenha um retângulo preto quase transparente por cima do anterior (cria o rastro que
  desaparece aos poucos) e depois um caractere novo por coluna.
- **Caracteres**: já passou por emoji de esporte (⚽🏆🎮🕹👟🥅🏅) e por katakana — o
  usuário preferiu katakana de volta. Se for trocar de novo, atenção: emoji colorido
  **ignora `ctx.fillStyle`** (sempre desenha com as cores nativas do emoji), então pra
  tingir de verde é preciso um filtro CSS no `<canvas>` (`grayscale + sepia + hue-rotate`,
  truque clássico de "duotone"). Texto simples (katakana/letras/números) já responde
  direto a `ctx.fillStyle`, sem precisar desse filtro.
- Densidade/velocidade são ajustáveis via as constantes no topo do arquivo
  (`FONT_SIZE`, `COLUMN_SPACING`, `FRAME_MS`, `DRAW_PROBABILITY`).
- O header é **opaco** (`bg-black` sólido) de propósito — já tentamos deixar translúcido
  pra chuva aparecer atrás e o usuário não gostou; reverter isso exigiria trocar o
  wrapper sticky em `App.tsx`.

## Tema: verde-matrix fixo, sem light/dark

O app não usa mais `prefers-color-scheme`/`dark:` do Tailwind — é um tema único e fixo
(preto + verde), decisão explícita do usuário pra ficar consistente com as outras páginas
dele. Cor de acento é `green-*` (era `indigo-*` antes do retema). Card de conteúdo
(`components/shared/Panel.tsx`) usa margem fixa `mx-[10%]` — não largura por conteúdo.

## Logos e favicon

`src/lib/catalog.ts` aponta pros arquivos reais em `public/logos/` (ps4.jpg, ps5.webp,
ec26.png, efootball.png) e `public/favicon.jpg` (logo da ACFDV, também usado no
cabeçalho). O componente `Logo.tsx` tenta carregar a imagem e cai pro ícone genérico
lucide-react só se o arquivo não existir — então dá pra trocar os arquivos em
`public/logos/` a qualquer momento sem mexer em código.
