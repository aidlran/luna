<script lang="ts">
  import { Modal } from '$lib/client/components';

  enum Mode {
    IMPORT_IDENTITY,
    CREATE_IDENTITY,
  }

  let currentMode = Mode.IMPORT_IDENTITY;
</script>

<Modal>
  <div class="tab-container">
    <button
      on:click={() => (currentMode = Mode.IMPORT_IDENTITY)}
      disabled={currentMode === Mode.IMPORT_IDENTITY}>Import identity</button
    >
    <button
      on:click={() => (currentMode = Mode.CREATE_IDENTITY)}
      disabled={currentMode === Mode.CREATE_IDENTITY}>Create identity</button
    >
  </div>
  <!-- <Card> -->
  <div class="form-container">
    <div class="form-card"></div>
  </div>
  <!-- </Card> -->
</Modal>

<style>
  @media only screen and (min-width: 600px) {
    .form-container {
      min-height: 284px;
      min-width: 366px;
    }
    .form-card {
      padding: 36px 24px;
      background: rgba(var(--colour-background), var(--alpha-level-1));
      backdrop-filter: blur(6px);
      border: var(--border);
      border-top: none;
      border-radius: 0 0 16px 16px;
      box-shadow: var(--shadow);
    }
  }

  .tab-container {
    display: flex;
    border-radius: 16px 16px 0 0;
    box-shadow: var(--shadow);
    border-bottom: var(--border);
  }

  .tab-container button {
    flex-basis: 50%;
    padding: 8px;
    border: var(--border);
    border-bottom: none;
    background: rgba(var(--colour-background), var(--alpha-level-1));
    cursor: pointer;
    opacity: 0.4;
    color: var(--colour-text);
  }

  .tab-container button:not(:disabled):hover {
    opacity: 0.7;
  }

  .tab-container button:disabled {
    opacity: 1;
  }

  .tab-container button:first-child {
    border-top-left-radius: 16px;
  }

  .tab-container button:last-child {
    border-top-right-radius: 16px;
  }
</style>
