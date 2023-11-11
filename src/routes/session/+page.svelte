<script>
  import SessionMenu from './session-menu.svelte';
</script>

<div>
  <SessionMenu />
</div>

<style>
  div {
    display: contents;
  }

  @media screen and (min-width: 992px) {
    div {
      display: none;
    }
  }
</style>
