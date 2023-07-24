<div class="overlay">
  <div class="modal">
    <slot />
  </div>
</div>

<style>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
  }

  .modal {
    margin: 0;
    width: 100%;
    max-width: calc(100% - 20px);
    max-height: calc(100% - 20px);
    padding: 36px 24px;
    border: var(--border);
    background: rgba(var(--colour-background), var(--alpha-level-1));
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    box-shadow: var(--shadow);
  }

  @media only screen and (min-width: 600px) {
    .modal {
      margin: auto;
      width: auto;
      border-radius: 18px;
    }
  }
</style>
