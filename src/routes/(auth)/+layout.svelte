<script lang="ts">
  import '$lib/client/styles/global.styles.css';
  import { onMount } from 'svelte';
  import { Modal } from '$lib/client/components';

  let noScriptWarning: HTMLParagraphElement;

  onMount(() => noScriptWarning.remove());
</script>

<main>
  <Modal>
    <div class="flex-container">
      <div class="centered">
        <slot />
      </div>
    </div>
  </Modal>
</main>

<p class="noscript-warning" bind:this={noScriptWarning}>
  JavaScript is disabled in your browser. This application will not work without it.
</p>

<style>
  .flex-container {
    display: flex;
  }

  .centered {
    margin: auto;
    width: 100%;
  }

  @media only screen and (min-width: 600px) {
    .centered {
      max-width: 350px;
    }
  }

  :global(label) {
    display: block;
    margin: 10px auto;
    padding: 8px;
    border-radius: 12px;
    border: 1px solid #5a5a7010;
    background: #00000009;
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    cursor: text;
    font-size: 0.8rem;
    color: #9f9f9f;
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
  }

  :global(input) {
    width: 100%;
    padding: 2px 0;
    background: none;
    border: none;
    font-size: 1.15rem;
  }

  :global(input:not([type='submit'])) {
    width: calc(100% - 14px);
  }

  :global(input[type='submit']) {
    margin: 24px 0;
    padding: 14px 5px;
    border-radius: 12px;
    font-size: 1.25rem;
    font-weight: bold;
    box-shadow: 0 1px 16px 6px #5a5a701f;
    transition-duration: 100ms;
  }

  :global(input[type='submit']:not(:disabled)) {
    background: rgb(131, 58, 180);
    background: linear-gradient(
      240deg,
      rgba(252, 176, 69, 1) 0%,
      rgba(253, 29, 29, 1) 20%,
      rgba(131, 58, 180, 1) 100%
    );
    color: #fff;
  }

  :global(p) {
    text-align: center;
    margin: 8px auto;
  }

  :global(.noscript-warning) {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    margin: 0;
    padding: 10px 0;
    background: yellow;
  }
</style>
