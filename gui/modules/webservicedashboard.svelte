<script>
  import { createEventDispatcher, onMount } from 'svelte';

  const dispatch = createEventDispatcher();

  onMount(() => {
    let url = window.location.href;
    if (!url.endsWith('/')) url += '/';
    url += 'status/dashboard';

    window.open(url, '_blank').focus();
    dispatch('close');
  });
</script>
