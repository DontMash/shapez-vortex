<script lang="ts">
  import { page } from '$app/state';
  import { section } from '$lib/components/section';
</script>

<section class="{section()} prose">
  <h2 class="divide-foreground flex items-center justify-center divide-x-2">
    <span class="px-6">{page.status}</span>
    <span class="px-6">{page.error?.message}</span>
  </h2>
</section>
