<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  export let href: string;
</script>

<a
  href={href}
  class:active={$page.url.pathname === href}
  on:click|preventDefault={() => goto(href)}
>
  <slot />
</a>

<style>
  .active {
    background-color: #e5e7eb; /* bg-gray-200 */
  }
</style>
