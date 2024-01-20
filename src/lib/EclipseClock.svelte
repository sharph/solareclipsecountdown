<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  import dayjs from "$lib/dayjs";

  import type { LocalSolarEclipseInfo } from "astronomy-engine";

  export let localElipseInfo: LocalSolarEclipseInfo;

  let updateInterval: null | ReturnType<typeof setInterval> = null;
  let currentTime = dayjs(new Date());

  onMount(() => {
    updateInterval = setInterval(() => {
      currentTime = dayjs(new Date());
    }, 1000);
  });

  onDestroy(() => {
    if (updateInterval) {
      clearInterval(updateInterval);
    }
  });

  function pad(number: number, length: number = 2) {
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
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
        sameDay: "[Today at] h:mm A",
        nextDay: "[Tomorrow at] h:mm A",
        nextWeek: "dddd [at] h:mm A",
        lastDay: "[Yesterday at] h:mm A",
        lastWeek: "[Last] dddd [at] h:mm A",
        sameElse: "dddd, MMMM D [at] h:mm A",
    });
  }
</script>

<div class="card p-4 m-1">
{#if localElipseInfo.partial_begin}
  <div class="clock">
    <div class="h1">
      {formatSeconds(
        dayjs(localElipseInfo.partial_begin.time.date).diff(
          currentTime,
          "second",
        ),
      )}
    </div>
    <h3 class="h3">Until partial eclipse begins</h3>
    <h4 class="h4">{formatCalendar(localElipseInfo.partial_begin.time.date)}</h4>
  </div>
{/if}
{#if localElipseInfo.total_begin}
<hr class="!border-t-2" />
  <div class="clock">
    <div class="h1">
      {formatSeconds(
        dayjs(localElipseInfo.total_begin.time.date).diff(
          currentTime,
          "second",
        ),
      )}
    </div>
    <h3 class="h3">Until total eclipse begins</h3>
    <h4 class="h4">{formatCalendar(localElipseInfo.total_begin.time.date)}</h4>
  </div>
{/if}
{#if localElipseInfo.total_end}
<hr class="!border-t-2" />
  <div class="clock">
    <div class="h1">
      {formatSeconds(
        dayjs(localElipseInfo.total_end.time.date).diff(
          currentTime,
          "second",
        ),
      )}
    </div>
    <h3 class="h3">Until total eclipse ends</h3>
    <h4 class="h4">{formatCalendar(localElipseInfo.total_end.time.date)}</h4>
  </div>
{/if}
{#if localElipseInfo.partial_end}
<hr class="!border-t-2" />
  <div class="clock">
    <div class="h1">
      {formatSeconds(
        dayjs(localElipseInfo.partial_end.time.date).diff(
          currentTime,
          "second",
        ),
      )}
    </div>
    <h3 class="h3">Until partial eclipse ends</h3>
    <h4 class="h4">{formatCalendar(localElipseInfo.partial_end.time.date)}</h4>
  </div>
{/if}
</div>

<style>
    .clock {
        padding: 0.5em;
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
</style>