<div>
  <slot />
</div>

<style>
  div {
    padding: 36px 24px;
    border: var(--border);
    background: rgba(var(--colour-background), var(--alpha-level-1));
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    box-shadow: var(--shadow);
  }

  @media only screen and (min-width: 600px) {
    div {
      border-radius: 18px;
    }
  }
</style>
