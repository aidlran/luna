import { getContent } from '@astrobase/sdk/content';
import { FileBuilder } from '@astrobase/sdk/file';
import { getAvailableKeyringCIDs, PersistedKeyring } from '@astrobase/sdk/keyrings';
import { Title } from '@solidjs/meta';
import { A, createAsync, useNavigate } from '@solidjs/router';
import { createEffect, createResource, type JSX } from 'solid-js';
import KeyringGuard from '~/components/keyring-guard';
import { instance, setSelectedKeyring } from '~/lib/astrobase';

export default (): JSX.Element => {
  const [keyringCIDs] = createResource(() => getAvailableKeyringCIDs(instance()!));

  const keyrings = createAsync(() => {
    const i = instance()!;
    return Promise.all(
      keyringCIDs()?.map((cid) =>
        getContent<FileBuilder<PersistedKeyring>>(cid, i).then(
          (file) => file?.getValue(i) as Promise<PersistedKeyring>,
        ),
      ) ?? [],
    );
  });

  const navigate = useNavigate();

  createEffect(() => {
    switch (keyringCIDs()?.length) {
      case 0:
        return navigate('create', { replace: true });
      case 1:
        return navigate('unlock', { replace: true });
    }
  });

  function select(this: number) {
    setSelectedKeyring(this);
    navigate('unlock', { replace: true });
  }

  return (
    <KeyringGuard unlockStatus={false} redirectPath="/">
      <main class="text-center">
        <Title>Keyrings | Luna Projects</Title>

        <A href="create">Create New Keyring</A>

        <h1 class="my-3">Select a Keyring</h1>

        {keyrings()?.map((_, i) => (
          <button class="my-3" onClick={select.bind(i)}>
            {i + 1}
          </button>
        ))}
      </main>
    </KeyringGuard>
  );
};
