<script lang="ts">
  import type { Strategy } from "../lib/solver";

  export const STRATEGY_OPTIONS: Array<{ value: Strategy; label: string }> = [
    { value: "average", label: "Entropie moyenne" },
    { value: "minimax", label: "Entropie maximale" },
    { value: "random", label: "Aléatoire" },
  ];

  type Props = {
    strategy: Strategy,
    onCancel: () => void,
    onOk: (strat: Strategy) => void
  };

  let { strategy: strat, onCancel, onOk }: Props = $props();
  let strategy = $derived(strat);

</script>

<form method="dialog">
  <h2>Options</h2>
  <fieldset>
    <legend>Strategie de recherche</legend>
    {#each STRATEGY_OPTIONS as option}
      <label>
        <input
          type="radio"
          name="strategy"
          value={option.value}
          checked={strategy === option.value}
          onchange={() => strategy = option.value}
        />
        <span>{option.label}</span>
      </label>
    {/each}
  </fieldset>
  <div class="buttons">
    <button class="ui-button" type="button" onclick={onCancel}>Annuler</button>
    <button
      class="ui-button ui-button-primary"
      type="button"
      onclick={() => onOk(strategy)}
    >
      Appliquer
    </button>
  </div>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
    padding: 1rem;
  }

  h2 {
    margin: 0;
    font-size: 1.1rem;
  }

  form fieldset {
    border: 1px solid #e5e5e5;
    border-radius: 0.5rem;
    padding: 0.75rem;
    margin: 0;
  }

  legend {
    padding: 0 0.3rem;
    font-size: 0.9rem;
    font-weight: 600;
  }

  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-height: 2rem;
    font-size: 0.95rem;
    cursor: pointer;
  }

  .buttons {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
</style>