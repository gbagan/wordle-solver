<script lang="ts">
  import { onMount } from "svelte";
  import CellView from "./components/CellView.svelte";
  import { Solver, type Strategy } from "./lib/solver";
  import Options from "./components/Options.svelte";

  type Cell = { letter: string, color: number };
  type Grid = Cell[][];

  let grid: Grid = $state([0, 1, 2, 3, 4, 5].map(() =>
    [0, 1, 2, 3, 4].map(() => ({letter: "", color: -1}))
  ));

  let solver = new Solver();
  let isLoaded = $state(false);
  let currentRow = $state(-1);
  let error = $state("");
  let found = $state(false);
  let optionsDialog: HTMLDialogElement | null = $state(null);

  let solving = $derived(currentRow !== -1 && !found && error === "");

  function newGame() {
    currentRow = -1;
    error = "";
    found = false;
    solver.newGame();
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 5; j++) {
        grid[i][j].letter = "";
        grid[i][j].color = -1;
      }
    }
    const suggestion = solver.suggestion();
    addRow(suggestion);
  }

  function applyOptions(strat: Strategy) {
    solver.strategy = strat;
    newGame();
    closeOptionsDialog();
  }

  function addRow(text: string) {
    if (currentRow === 5) {
      return;
    }
    currentRow += 1;
    for (let i = 0; i < 5; i++) {
      grid[currentRow][i].letter = text[i].toUpperCase();
      grid[currentRow][i].color = found ? 2 : 0;
    }
  }

  function handleClick(i: number, j: number) {
    if (!solving || i !== currentRow) {
      return;
    }
    grid[i][j].color = (grid[i][j].color + 1) % 3;
  }

  function validate() {
    if (!solving) {
      return;
    }
    const word = grid[currentRow].reduce((acc, c) => acc + c.letter, "").toLowerCase();
    const coloring = grid[currentRow].map(c => c.color);
    solver.filter(word, coloring);
    if (solver.remaining.length === 0) {
      error = "Aucun mot trouvé";
      return;
    } else if (solver.remaining.length === 1) {
      found = true;
    }
    const suggestion = solver.suggestion();
    addRow(suggestion);
  }

  function openOptionsDialog() {
    optionsDialog?.showModal();
  }

  function closeOptionsDialog() {
    optionsDialog?.close();
  }

  onMount(async () => {
    const request = new Request("./wordle.txt");
    const response = await fetch(request);
    if (!response.ok) {
      throw new Error("plop");
    }
    const text = await response.text();
    isLoaded = true;
    solver.load(text);
    solver.strategy = "minimax";
  });
</script>

{#if !isLoaded}
   Loading
{:else}
  <h1>Solveur de Wordle</h1>
  <div class="actions">
    <button class="ui-button" onclick={openOptionsDialog}>Nouvelle partie</button>
    <button class="ui-button" disabled={!solving} onclick={validate}>Valider</button>
  </div>
  <dialog class="options-dialog" bind:this={optionsDialog}>
    <Options
      strategy={solver.strategy}
      onCancel={closeOptionsDialog}
      onOk={applyOptions}
    />
  </dialog>
  <div class="grid">
    {#each grid as row, i}
      {#each row as {letter, color}, j}
        <CellView
          {letter}
          {color}
          currentRow={solving && currentRow === i}
          onclick={() => handleClick(i, j)}
        />
      {/each}
    {/each}
  </div>
  {#if error !== ""}
    <div class="message error">{error}</div>
  {:else if found}
    <div class="message success">Le mot a été trouvé!</div>
  {:else if currentRow >= 0}
    <div class="message info">Clique sur une case pour en changer la couleur puis clique sur Valider</div>
  {/if}
{/if}


<style>
 .options-dialog {
    width: min(22rem, calc(100vw - 1.5rem));
    border: 1px solid #d9d9d9;
    border-radius: 0.6rem;
    padding: 0;
  }

  .options-dialog::backdrop {
    background: rgba(0, 0, 0, 0.45);
  }

  .actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 5px;
    padding: 10px;
    box-sizing: border-box;
    width: 350px;
    height: 420px;
  }

  .message {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 18px;
    border-radius: 6px;
    font-size: 14px;
    font-family: 'Segoe UI', sans-serif;
    margin: 12px 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    max-width: 350px;

    &::before {
      font-size: 16px;
    }

    &.info {
      background-color: #e3f2fd;
      color: #1565c0;
      border: solid 1px #bee5eb;
  
      &::before {
        content: "ℹ️";
      }
    }

    &.success {
      background-color: #e8f5e9;
      color: #2e7d32;
      border: 1px solid #c3e6cb;
  
      &::before {
        content: "✅";
      }
    }

    &.error {
      background-color: #ffebee;
      color: #c62828;
      border: 1px solid #f5c6cb;
      &::before {
        content: "❌";
      }
    }
  }
</style>