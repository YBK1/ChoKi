import { atom } from 'jotai';

interface UserState {
	userId: number;
	username: string;
}

export const userAtom = atom<UserState>({
	userId: 0,
	username: '',
});

export const selectedChildIdAtom = atom<number | null>(null);
