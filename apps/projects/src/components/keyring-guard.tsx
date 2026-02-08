import { useNavigate } from '@solidjs/router';
import { createEffect, JSX, Show } from 'solid-js';
import { keyringUnlocked } from '~/lib/astrobase';

interface Props {
  children: JSX.Element;
  redirectPath: string;
  unlockStatus: boolean;
}

export default ({ children, redirectPath, unlockStatus }: Props): JSX.Element => {
  const navigate = useNavigate();

  createEffect(() => {
    if (keyringUnlocked() != unlockStatus) {
      navigate(redirectPath, { replace: true });
    }
  });

  return <Show when={keyringUnlocked() == unlockStatus}>{children}</Show>;
};
