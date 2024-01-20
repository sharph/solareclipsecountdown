<script lang="ts">
  import EclipseClock from "$lib/EclipseClock.svelte";

  export let data;
</script>

<div class="container h-full mx-auto flex justify-center items-center">
  <div class="space-y-5">
	{#if (data.localEclipse)}
    <EclipseClock localElipseInfo={data.localEclipse} />
	{/if}
  </div>
</div>
