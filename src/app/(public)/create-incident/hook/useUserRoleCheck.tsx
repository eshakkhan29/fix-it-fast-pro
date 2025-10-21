'use client';
import { useUserRoleContext } from '../context/UserRoleContext';

export function useUserRoleCheck() {
  // Delegate to the context hook so existing imports keep working
  return useUserRoleContext();
}
