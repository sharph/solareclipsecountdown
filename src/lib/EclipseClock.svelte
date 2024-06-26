<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  import dayjs from "$lib/dayjs";

  import { EclipseEvent } from "$lib/astronomy";
  import type { LocalSolarEclipseInfo } from "$lib/astronomy";

  export let localElipseInfo: LocalSolarEclipseInfo;
  export let city: any;

  const DEBUG = false;

  let updateInterval: null | ReturnType<typeof setInterval> = null;
  let currentTime = DEBUG
    ? dayjs(localElipseInfo.partial_begin.time.date).subtract(5, "minute")
    : dayjs(new Date());

  let phases: any = [];

  onMount(() => {
    updateInterval = setInterval(
      () => {
        if (!DEBUG) {
          currentTime = dayjs(new Date());
        } else {
          currentTime = dayjs(currentTime.add(1, "second"));
        }
      },
      !DEBUG ? 1000 : 50,
    );
  });

  onDestroy(() => {
    if (updateInterval) {
      clearInterval(updateInterval);
    }
  });

  $: {
    if (localElipseInfo || currentTime) {
      phases = [];
      [
        [
          localElipseInfo.partial_begin,
          "partial eclipse begins",
          "partial eclipse began",
        ],
        [
          localElipseInfo.total_begin,
          "total eclipse begins",
          "total eclipse began",
        ],
        [
          localElipseInfo.peak,
          "eclipse peaks",
          "eclipse peaked",
        ],
        [
          localElipseInfo.total_end,
          "total eclipse ends",
          "total eclipse ended",
        ],
        [
          localElipseInfo.partial_end,
          "partial eclipse ends",
          "partial eclipse ended",
        ],
      ].forEach((phase) => {
        if (phase) {
          const [phaseInfo, phaseName, phasePastName] = phase;
          if (phaseInfo && phaseInfo instanceof EclipseEvent) {
            const phaseTime = dayjs(phaseInfo.time.date);
            phases.push({
              name: phaseName,
              pastName: phasePastName,
              time: phaseTime,
              active: false,
            });
          }
        }
      });
      let i;
      for (i = 0; i < phases.length - 1; i++) {
        const phase = phases[i];
        if(phases.length === 5 && i === 2) {
            continue;
        }
        if (currentTime.isBefore(phase.time)) {
          break;
        }
      }
      phases[i].active = true;
      if (phases.length === 3 && phases[1].active) {
        phases[2].active = true;
      }
    }
  }

  function pad(number: number, length: number = 2) {
    var str = "" + number;
    while (str.length < length) {
      str = "0" + str;
    }

    return str;
  }

  function formatSeconds(seconds: number) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds - days * 86400) / 3600);
    const minutes = Math.floor((seconds - days * 86400 - hours * 3600) / 60);
    const secs = seconds - days * 86400 - hours * 3600 - minutes * 60;

    if (days > 0) {
      return `${days} days ${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
    }

    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
  }

  const tz = dayjs.tz.guess();

  function formatCalendar(date: Date) {
    return dayjs.utc(date).tz(tz).calendar(null, {
      sameDay: "[Today at] h:mm:ss A",
      nextDay: "[Tomorrow at] h:mm:ss A",
      nextWeek: "dddd [at] h:mm:ss A",
      lastDay: "[Yesterday at] h:mm:ss A",
      lastWeek: "[Last] dddd [at] h:mm:ss A",
      sameElse: "dddd, MMMM D [at] h:mm:ss A",
    });
  }
</script>

<div class="card p-4 m-1">
  The sun will be {(localElipseInfo.obscuration*100).toFixed(2)}% obscured by the moon {#if city}in {city.name}{:else}at your location{/if}.
</div>  
<div class="card p-4 m-1">
  {#each phases as phase, i}
    <div class="clock" class:dim={!phase.active} class:lessimportant={phases.length===5 && phase.name.includes('peaks')}>
      <div class="h1">
        {#if currentTime.isAfter(phase.time)}
          {formatSeconds(dayjs(currentTime).diff(phase.time, "second"))}
        {:else}
          {formatSeconds(dayjs(phase.time).diff(currentTime, "second"))}
        {/if}
      </div>
      <h3 class="h3">
        {#if currentTime.isAfter(phase.time)}
          after {phase.pastName}
        {:else}
          until {phase.name}
        {/if}
      </h3>
      <h4 class="h4">
        {formatCalendar(phase.time)}
      </h4>
    </div>
    {#if i < phases.length - 1}
      <hr class="!boarder-t-2 !boarder-gray-200" />
    {/if}
  {/each}
</div>

<style>
  .clock {
    padding: 0.5em;
    transition: opacity 1.5s;
  }

  .clock.dim {
    opacity: 0.4;
  }

  .h1 {
    font-weight: 700;
  }

  .h3 {
    font-weight: 700;
  }

  .h4 {
    font-weight: 400;
  }

    .lessimportant {
        display: none;
    }
    .lessimportant .h1 {
    font-weight: 400;
    font-size: 1.5em !important;
    display: inline;
    }
    .lessimportant .h3 {
    font-weight: 400;
    font-size: 1em !important;
    display: inline;
    }
</style>
