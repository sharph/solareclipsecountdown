<script lang="ts">
  import EclipseClock from "$lib/EclipseClock.svelte";

  export let data;
</script>

<svelte:head>
    <title>{data.city.displayName} | Solar Eclipse Countdown Timer</title>
</svelte:head>

<div class="container h-full mx-auto flex justify-center items-center">
  <div class="space-y-5">
	{#if (data.localEclipse)}
    <EclipseClock localElipseInfo={data.localEclipse} city={data.city} />
	{/if}
  </div>
</div>
