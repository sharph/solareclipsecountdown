<script lang="ts">
  import { onMount } from "svelte";
  import { SearchLocalSolarEclipse, NextLocalSolarEclipse, Observer, LocalSolarEclipseInfo } from "$lib/astronomy";
import { ConicGradient } from '@skeletonlabs/skeleton';
import type { ConicStop } from '@skeletonlabs/skeleton';
  import EclipseClock from "$lib/EclipseClock.svelte";

  let geolocation = null;
  let position = null;
  let localEclipse: null | LocalSolarEclipseInfo;
  let observer = null;

  $: if (geolocation) {
  }

  $: if (position) {
	observer = new Observer(position.coords.latitude, position.coords.longitude, 0);
    localEclipse = SearchLocalSolarEclipse(
      new Date(Date.now() - 6 * 60 * 60 * 1000),
      observer,
    );
	while (localEclipse.peak.altitude < 0) {
		localEclipse = NextLocalSolarEclipse(localEclipse.peak.time.date, observer);
	}

  }

  onMount(() => {
    geolocation = navigator.geolocation;
    geolocation.getCurrentPosition((pos) => {
      position = pos;
    });
  });

  const conicStops: ConicStop[] = [
	{ color: 'transparent', start: 0, end: 25 },
	{ color: 'rgb(var(--color-primary-500))', start: 75, end: 100 }
];
</script>

<svelte:head>
	<title>Solar Eclipse Countdown Timer</title>
</svelte:head>

<div class="container h-full mx-auto flex justify-center items-center">
  <div class="space-y-5">
	{#if (localEclipse)}
    <EclipseClock localElipseInfo={localEclipse} />
	{:else}
	<ConicGradient stops={conicStops} spin>Acquiring Location</ConicGradient>
	{/if}
  </div>
</div>
