<script>
  // 1. Это "блокнот" нашего актера.
  // 'export let' означает, что эту переменную (message)
  // можно будет установить снаружи (из "рации" - JS Hook).
  export let message = "Жду команду от режиссера (Elixir)...";
</script>

<div style="padding: 20px; border: 2px dashed blue;">
  <h3>Это Svelte-компоннент</h3>
  <h1>{message}</h1>
</div>
