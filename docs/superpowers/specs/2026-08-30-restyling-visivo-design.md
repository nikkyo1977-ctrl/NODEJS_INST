# Restyling visivo — Node.js on FEM Workstation

**Data:** 2026-08-30
**Stato:** approvato, pronto per la pianificazione
**Perimetro:** restyling di sistema delle 7 scene Remotion, senza modifiche a testi e ordine narrativo

---

## 1. Motivazione

Il video funziona sul piano narrativo — problema, soluzione, prova, chiusura — ma il suo linguaggio visivo non è progettato: è emerso scena per scena. L'analisi del codice attuale ha rilevato otto difetti, in ordine di impatto:

1. **Le emoji sono il sistema iconografico** (`🛡️` a 200px, `✅/❌` nelle tabelle, nove emoji in Scena 6). Fanno scivolare il registro verso la presentazione da slide e, essendo disegnate dal font di sistema, rendono il render non riproducibile tra macchine.
2. **Nessun monospace e nessun terminale.** Il video parla di CLI agentica, Codex, `.inp`/`.py`/`.odb`, e non mostra mai un comando.
3. **Scala tipografica improvvisata:** quattordici corpi diversi su sette scene, con il titolo che cambia da 84 a 80 a 76 a 96 px.
4. **Vocabolario di movimento unico:** ogni elemento entra con `opacity 0→1 + translateY`, stessa easing; tutte e sei le transizioni sono `fade()` da 15 frame.
5. **Nessun sistema di spaziatura:** padding di scena a 60/70/80/100, griglia 2 colonne per nove item con riga orfana in Scena 6.
6. **Sfondi inerti** e nessun elemento visivo che tenga insieme gli 87 secondi.
7. **Nessun ancoraggio narrativo:** niente numerazione di scena né orientamento su sette capitoli.
8. **Nessuna metrica animata**, benché l'argomento centrale sia il risparmio di tempo.

A questi si aggiungono due difetti strutturali emersi leggendo il codice:

- Le durate delle scene sono **duplicate** tra `Root.tsx` e `NodeJDVideo.tsx`: due fonti di verità per lo stesso dato.
- In quasi ogni scena le animazioni terminano molto prima della scena stessa — Scena 3 completa a frame 285 su 540, **8,5 secondi di fermo immagine** — e nulla nel progetto misura questo scostamento.

## 2. Decisioni prese

| Ambito | Decisione |
|---|---|
| Ambizione | Restyling di sistema: nuovo design system, tutte e 7 le scene riallineate. Testi e ordine narrativo invariati. |
| Direzione estetica | **Engineering Console** — quasi-nero, accento singolo ciano, icone SVG a tratto, monospace per il registro tecnico, superfici a bordo hairline, griglia tecnica persistente. |
| Terminale | **Combinata**: finestra terminale piena in Scena 4, riga di comando ricorrente come filo conduttore dalle Scene 2 a 7. |
| Movimento | **Costruttivo**: wipe da sinistra per il testo, linee che si estendono, icone che si disegnano tratto per tratto, contatori numerici. |
| Durate | Riequilibrate scena per scena in funzione del contenuto. Totale da 87 a ~84 secondi. |

---

## 3. Design system

### 3.1 Struttura dei file

```
src/
  design/
    tokens.ts       colori, scala tipografica, spacing, tratti, raggi
    motion.ts       durate in frame, easing, stagger, helper di rivelazione
    timing.ts       durate delle scene — fonte di verità unica
    icons.tsx       set di icone SVG a tratto
  components/
    SceneFrame.tsx  telaio comune di ogni scena
    Terminal.tsx    finestra terminale con typing e output
    CommandLine.tsx riga di comando singola
    Metric.tsx      numero con contatore animato
    Reveal.tsx      wrapper di rivelazione
  scenes/           le 7 scene, riscritte come consumatrici dei componenti
  NodeJDVideo.tsx   struttura invariata, transizioni differenziate
  Root.tsx          durate importate da timing.ts
```

Vincoli di dipendenza: `design/` non importa da `components/` né da `scenes/`; `components/` non importa da `scenes/`. `SceneFrame` non conosce il proprio contenuto, `Terminal` non conosce la scena che lo ospita, `Reveal` non conosce ciò che rivela.

### 3.2 Colore

Un solo accento; il resto è scala di grigi. Rosso, verde e ambra tornano segnali di stato e non sono mai decorativi.

| Token | Valore | Uso |
|---|---|---|
| `bg` | `#08090b` | fondo scena |
| `surface` | `#0c0f14` | riquadri, chrome del terminale |
| `line` | `#191d24` | bordi hairline |
| `lineStrong` | `#232936` | separatori marcati |
| `text` | `#eef1f5` | testo primario |
| `textMute` | `#8b95a3` | testo secondario |
| `textFaint` | `#4d5765` | eyebrow, metadati |
| `accent` | `#22d3ee` | unico accento |
| `accentDim` | `#1d3d47` | glow, tracce, stati intermedi |
| `ok` | `#3fb27f` | stato positivo |
| `warn` | `#d99a3e` | stato di attenzione |
| `bad` | `#b4555f` | stato negativo |

I valori attuali `#ef4444` e `#10b981` sono troppo saturi per reggere blocchi di testo interi e vengono sostituiti dalle versioni desaturate qui sopra.

### 3.3 Tipografia

Sette gradi. Inter per il testo, JetBrains Mono per il registro tecnico.

| Token | px | Peso | Tracking | Uso |
|---|---|---|---|---|
| `display` | 104 | 700 | −0.04em | solo Scena 7 |
| `h1` | 72 | 700 | −0.03em | titolo di scena, **identico in tutte e 7** |
| `h2` | 44 | 600 | −0.02em | intestazioni di colonna |
| `bodyLg` | 36 | 400 | — | voci principali |
| `body` | 30 | 400 | — | voci di lista, celle di tabella |
| `small` | 24 | 400 | — | note |
| `label` | 20 | 600 | +0.22em, maiuscolo, mono | eyebrow, intestazioni tabella |
| `metric` | 128 | 700 | −0.04em | numeri animati |

I font sono caricati con `@remotion/google-fonts` e attesi con `waitForFonts()`. Il pacchetto li serve self-hosted: nessuna richiesta di rete durante il render.

### 3.4 Spaziatura

Scala da 8: `8 16 24 32 48 64 80 96 128`. Padding di scena unico per tutte e sette: **96 orizzontali, 80 verticali**. Griglia a 12 colonne con gutter 32.

### 3.5 Movimento

Durate in frame a 30 fps: `micro 6`, `fast 9`, `base 15`, `slow 24`.
Scala di stagger, anch'essa in frame: `xtight 4`, `tight 6`, `base 8`, `loose 12`. Le scene scelgono un grado della scala in funzione di quanti elementi devono entrare — non un numero arbitrario.
Easing di ingresso unica: `cubic-bezier(0.22, 1, 0.36, 1)`. Le spring restano solo dove un rimbalzo è dichiarato.

Quattro helper incarnano il movimento costruttivo, e le scene smettono di chiamare `interpolate` direttamente:

- `useWipe(frame, at)` → `clipPath` da sinistra, per il testo
- `useDraw(frame, at)` → `strokeDashoffset`, per le icone che si disegnano
- `useExtend(frame, at, to)` → lunghezza di linee e regoli
- `useCounter(frame, at, to)` → valore numerico per le metriche

Le pulsazioni continue usano `Math.sin(frame / period * 2π)`. Gli attuali `frame % 60` e `frame % 90` sono eliminati: scattano al wrap e non si allineano né ai tagli né alla musica.

### 3.6 Icone

`icons.tsx` sostituisce integralmente le emoji: `check`, `cross`, `terminal`, `file`, `folder`, `cloud`, `cloudOff`, `lock`, `shield`, `cpu`, `package`, `chart`, `refresh`, `bell`, `wrench`, `robot`, `document`.

Tratto 2.2, linecap tondo, `currentColor`, `viewBox` 24. Ogni `path` porta `pathLength="1"`, così `strokeDasharray: 1` e `strokeDashoffset: 1 − progress` producono il tracciato animato su qualunque forma senza misurare le lunghezze a mano. Prop `draw` per attivarlo.

---

## 4. Componenti

**`SceneFrame`** — `{ index, eyebrow, title, command?, children }`
Fondo, griglia tecnica, safe area, eyebrow mono (`05 / SECURITY`), titolo `h1` con wipe, regolo accento che si estende, area contenuto, `CommandLine` in basso se presente. L'apertura di ogni scena è identica al frame: è ciò che dà ritmo riconoscibile a sette capitoli.

**`Terminal`** — `{ lines, startAt, title? }` con `lines: { kind: 'command' | 'output' | 'ok' | 'err', text }[]`
Barra con titolo, typing carattere per carattere derivato dal frame, output riga per riga dopo il comando, cursore lampeggiante su `Math.floor(frame / 15) % 2`.

**`CommandLine`** — `{ text, startAt }`
La stessa logica senza chrome, ancorata al fondo del frame. Resa in mono a `bodyLg` (36px). Limite di **64 caratteri**: a 36px l'avanzamento di JetBrains Mono è ~21,6px, quindi 64 caratteri occupano ~1382px dei 1728 utili — dentro la safe area con margine, e sotto la soglia oltre la quale una riga di comando diventa illeggibile a colpo d'occhio.

`Terminal` e `CommandLine` condividono l'hook `useTyping(frame, text, startAt, cps)`. Sono due densità della stessa idea, non due implementazioni.

**`Metric`** — `{ to, from?, suffix?, label, at }`
Numero con contatore, reso in `tabular-nums`: senza, le cifre cambiano larghezza durante il conteggio e il numero balla.

**`Reveal`** — `{ at, mode: 'wipe' | 'rise' | 'fade' }`
Wrapper di rivelazione.

---

## 5. Scene

La riga di comando compare **da Scena 2 in poi, mai in Scena 1**: la CLI entra quando entra Node.js, e la Scena 1 è il mondo prima.

| # | Scena | Durata | Interventi |
|---|---|---|---|
| 1 | The Problem | 12s → **11s** | I cinque passi passano da lista verticale a **ciclo chiuso**: l'ultima freccia risale e chiude l'anello, poi il ciclo compie un secondo giro accelerato per far sentire la ripetizione. Emoji → icone. Il pulsare rosso `Math.sin(frame / 5)`, oggi agganciato a nulla, diventa il tratto che si ridisegna a ogni giro. Il sottotitolo arriva mentre il ciclo gira. Nessuna riga di comando. |
| 2 | Solution Architecture | 14s → **13s** | Topologia a croce invariata, geometria **derivata da una costante `RADIUS`** invece che hardcoded — è la fragilità che ha generato il bug corretto nel commit `d386398`. Nodo centrale in accento, quattro satelliti in `surface` con bordo hairline: la gerarchia la fa il centro, non cinque colori. Linee tracciate dal centro verso l'esterno con impulso al completamento. Comando: `$ node --version`. |
| 3 | Comparison | 18s → **14s** | `✅/❌` → icone `check` (accento) e `cross` (`bad`). Righe con wipe a stagger `loose` (12 frame) invece di 45. Rimosso il glow verde sfocato dietro le celle. In chiusura la colonna Codex CLI si accende di hairline accento e compare la metrica `6 / 6`. Comando: `$ codex --help`. |
| 4 | Time Saving | 12s → **14s** | Ospita la finestra `Terminal` piena: digita `codex "mesh bracket.inp, run, plot"` e produce l'output fino a `✓ job completed — results.odb`. A sinistra i cinque passi manuali che si accumulano. Poi la metrica **5 → 1**. Rimosse ⏳ e 🚀 con il loro `frame % 60`. |
| 5 | Security | 10s → **12s** | Scudo emoji 200px → icona che si disegna, in accento e di dimensione contenuta. I sei punti smettono di essere un muro di verde saturo: testo normale con spunte tracciate. Metrica `100%` local execution. "Trusted by NASA, Netflix, PayPal" si stacca dai punti tecnici in una riga di nomi in mono — è autorevolezza, non sicurezza. Comando: `$ netstat -an \| findstr ESTABLISHED`. |
| 6 | Applications | 14s → **13s** | Griglia **3×3** al posto di 2 colonne con riga orfana. Ingresso a onda diagonale — stagger `tight` (6 frame) per colonna e `loose` (12) per riga — invece di 35 frame per item. Emoji → icone. Il `borderLeft: 6px solid accent` ripetuto nove volte diventa hairline con accento solo sull'icona. |
| 7 | CTA | **10s** | `display` 104px, sottotitolo in accento. I due badge pill sono sostituiti dalla riga di comando conclusiva che digita l'installazione: è il pay-off del filo conduttore. Poi la griglia si spegne e resta la tagline. Lo `spring({ damping: 200 })`, di fatto una rampa lineare, diventa una rivelazione dichiarata. |

### Transizioni

Le sei `fade()` identiche da 15 frame diventano due tipi:

- **fade** sugli stacchi di capitolo: 1→2, 4→5, 6→7
- **wipe direzionale** tra scene che proseguono lo stesso discorso: 2→3, 3→4, 5→6. Il wipe corre da sinistra a destra e il suo bordo avanza a passi allineati alla griglia tecnica di sfondo, così lo stacco sembra parte del sistema e non un effetto sovrapposto.

### Conto delle durate

11 + 13 + 14 + 14 + 12 + 13 + 10 = 87s di scene (2610 frame), meno 6 transizioni da 15 frame (90 frame) = **2520 frame, 84,0 secondi**, contro i 2610 frame / 87 secondi attuali.

Il guadagno non sta nei 3 secondi risparmiati ma nella ridistribuzione: i tempi morti spariscono e il tempo va dove c'è qualcosa da guardare.

---

## 6. Robustezza

### 6.1 Fonte di verità unica per le durate

`design/timing.ts` esporta `SCENES = [{ id, seconds }]` e `TRANSITION_FRAMES = 15`. `Root.tsx` e `NodeJDVideo.tsx` importano entrambi da lì; il totale si calcola dallo stesso array. La duplicazione attuale — che permette di cambiare una durata in un file e disallineare silenziosamente la composizione — sparisce.

### 6.2 Controllo dei tempi morti

Ogni scena dichiara `lastRevealAt`, il frame in cui termina l'ultima rivelazione. In sviluppo, un controllo emette un avviso se `lastRevealAt` cade prima dell'80% o oltre il 100% della durata di scena. Il difetto trovato in analisi diventa così strutturalmente non ripetibile, invece che corretto una volta sola.

### 6.3 Determinismo del render

Tre cause di non riproducibilità, tutte chiuse:

1. **Font non caricati** — `fontFamily: "Inter, system-ui"` con Inter non installata significa fallback di sistema, con metriche diverse su ogni macchina. Risolto con `@remotion/google-fonts` e `waitForFonts()`.
2. **Emoji da font di sistema** — Segoe UI Emoji su Windows, Noto o Apple Color Emoji altrove: lo stesso frame è un disegno diverso. Risolto dalle icone SVG.
3. **`frame % 60` e `frame % 90`** — scatto al wrap. Risolto da `Math.sin`, continua per costruzione.

---

## 7. Verifica

Un video non ha test unitari sensati. La verifica è in tre passaggi, ripetuti a ogni fase:

- **`npm run lint`** (`eslint src && tsc`) deve restare pulito.
- **Still di controllo** — `npx remotion still` su tre frame per scena (apertura, metà, chiusura), 21 immagini salvate nello scratchpad, ispezionate visivamente.
- **Render completo** a fine lavoro, per transizioni e sincronia con l'audio.

Vincoli da verificare sugli still:

- nessun testo fuori dalla safe area 96 × 80
- `CommandLine` entro 64 caratteri
- nessun contatore privo di `tabular-nums`
- nessuna emoji residua in tutto `src/`

---

## 8. Piano di esecuzione

**Fase 1 — Fondamenta.** `tokens.ts`, `motion.ts`, `timing.ts`, `icons.tsx`, caricamento font. Nessuna scena toccata: a fine fase il video è identico a oggi salvo i font, che finalmente sono quelli dichiarati.

**Fase 2 — Componenti e scena pilota.** `SceneFrame`, `Reveal`, `useTyping`, `Terminal`, `CommandLine`, `Metric`, e migrazione della sola **Scena 5**, la più semplice.
→ **Checkpoint con revisione degli still prima di propagare.** Se il sistema è sbagliato, lo è su una scena e non su sette.

**Fase 3 — Migrazione.** Scene 1, 2, 3, 4, 6, 7 nell'ordine, ciascuna con i propri still di controllo.

**Fase 4 — Timing e transizioni.** Durate importate da `timing.ts`, transizioni differenziate, render completo.

**Fase 5 — Pulizia.** Rimozione del vecchio `theme.ts`, lint finale, aggiornamento del README (la sezione *Style* descrive ancora la palette cyan/neon-green e la durata di 87 secondi).

---

## 9. Fuori perimetro

- Testi e ordine delle scene: invariati.
- `generate-music.js` e la traccia audio: non toccati.
- Nessuna versione verticale 9:16, nessun voiceover, nessun sottotitolo.
- Nessun refactor scollegato dal restyling.
