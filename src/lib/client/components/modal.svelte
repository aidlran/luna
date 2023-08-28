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
  }

  @media only screen and (min-width: 600px) {
    .modal {
      margin: auto;
      width: auto;
    }
  }
</style>
