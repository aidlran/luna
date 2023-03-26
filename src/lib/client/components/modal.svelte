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
    border: 2px solid #ffffff50;
    background: #fafaffb9;
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    box-shadow: -4px -4px 24px 4px #5a5a7010;
  }

  @media only screen and (min-width: 600px) {
    .modal {
      margin: auto;
      width: auto;
      border-radius: 18px;
    }
  }
</style>
