/**
 * Logged-in user menu entries (profile dropdown, etc.; paths align with user/auth routes).
 */
import { CogLoopIcon, UserSecretIcon } from '../icons';

export const PROFILE_DROPDOWN_LINKS = [
  { to: '/profile', label: 'Settings', Icon: CogLoopIcon },
  { to: '/profile', label: 'Profile', Icon: UserSecretIcon },
];
