import { useAtom, atom } from "jotai";

const userAtom = atom<string>();

export function useUser() {
  const [user, setUser] = useAtom(userAtom);
  return { user, setUser };
}
