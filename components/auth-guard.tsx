'use client';

import { selectIsValidSession } from "@/lib/features/auth/auth-slice";
import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppSelector(selectIsValidSession);
  const router = useRouter();

  if (!isAuthenticated) {
    router.push('/login');
  }

  return isAuthenticated ? children : null;
}
