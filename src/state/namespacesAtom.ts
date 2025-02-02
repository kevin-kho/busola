import { atom, RecoilState } from 'recoil';

export type NamespacesState = string[] | null;

const defaultValue = null;

export const namespacesState: RecoilState<NamespacesState> = atom<
  NamespacesState
>({
  key: 'namespacesState',
  default: defaultValue,
});
