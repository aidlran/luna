<!-- https://loading.io/css/ -->

<span class="loading-spinner" />

<style>
  .loading-spinner,
  .loading-spinner:after {
    box-sizing: border-box;
  }

  .loading-spinner {
    display: inline-block;
    width: 28px;
    height: 28px;
  }

  .loading-spinner:after {
    content: ' ';
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 2px solid var(--colour-text);
    border-color: var(--colour-text) transparent var(--colour-text) transparent;
    animation: rotate 1s linear infinite;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
