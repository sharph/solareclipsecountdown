<script lang="ts">
  import "../app.postcss";
  import {
    computePosition,
    autoUpdate,
    offset,
    shift,
    flip,
    arrow,
  } from "@floating-ui/dom";

  import { storePopup } from "@skeletonlabs/skeleton";
  import {
    AppShell,
    AppBar,
    LightSwitch,
    popup,
    ListBox,
    ListBoxItem,
  } from "@skeletonlabs/skeleton";
  import type { PopupSettings } from "@skeletonlabs/skeleton";

  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

  export let data;
  let citySelector: string | null = null;

  const popupCombobox: PopupSettings = {
    event: "click",
    target: "popupCombobox",
    placement: "bottom",
    closeQuery: ".listbox-item",
  };

  $: if (citySelector) {
    goto(`/cities/${citySelector}`);
  }
</script>

<AppShell>
  <svelte:fragment slot="pageHeader">
    <AppBar gridColumns="grid-cols-1 md:grid-cols-2">
      <svelte:fragment slot="lead">
		<div>
        <button
          class="btn variant-filled w-72 justify-between"
          use:popup={popupCombobox}
        >
          <span class="capitalize"
            ><slot name="cityName"
              >{$page.data.city?.displayName || "Select City"}</slot
            ></span
          >
          <span>↓</span>
        </button>

        <div
          class="card w-72 shadow-xl py-2"
          data-popup="popupCombobox"
          style="overflow:scroll; max-height:80vh; z-index:9999;"
        >
          <ListBox rounded="rounded-none">
            {#each data.citiesWithEclipse as city}
			<div class:minor={!city.willHaveTotalEclipse}> 
              <ListBoxItem
                bind:group={citySelector}
                name="medium"
                value={city.slug}>{city.displayName}</ListBoxItem
              >
			  </div>
            {/each}
          </ListBox>
          <div class="arrow bg-surface-100-800-token" />
        </div>
		</div>
      </svelte:fragment>
      <svelte:fragment slot="default"
        >{#if $page.data.title}<h2 class="md:text-right">
            {$page.data.title}
          </h2>{/if}</svelte:fragment
      >
    </AppBar>
  </svelte:fragment>
  <slot />
  <svelte:fragment slot="pageFooter">
    <AppBar>
      <LightSwitch />
    </AppBar>
  </svelte:fragment>
</AppShell>

<style>
	.minor {
		opacity: 0.5;
	}
</style>