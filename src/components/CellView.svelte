<script lang="ts">
  type Props = {
    letter: string,
    color: number,
    currentRow: boolean,
    onclick?: () => void
  };

  let {letter, color, currentRow, onclick}: Props = $props();
</script>

<button
  class={["cell", {empty: color === -1, grey: color === 0, yellow: color === 1, green: color === 2, currentRow}]}
  {onclick}
>
  {letter}
</button>

<style>
  .cell {
    display: flex;
    align-items: center;
    justify-content: center;
    
    font-size: 2rem;
    color: white;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    text-shadow: 1px 2px 3px rgba(0, 0, 0, 0.5);
    width: 3rem;
    height: 3rem;
    border: none;

    &.empty {
      background: white;
      border: 2px solid #d3d6da;
    }

    &.grey {
      background: #787c7e
    }

    &.yellow {
      background: #c9b458
    }

    &.green {
      background: #6aaa64
    }

    &.currentRow {
      cursor: pointer;
    }
  }
</style>