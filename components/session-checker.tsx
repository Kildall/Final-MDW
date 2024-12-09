'use client';
import { checkSessionThunk, selectIsValidSession } from '@/lib/features/auth/auth-slice';
import { useAppDispatch } from '@/lib/hooks';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export function SessionChecker() {
  const dispatch = useAppDispatch();
  const isValidSession = useSelector(selectIsValidSession);

  useEffect(() => {
    if (!isValidSession) return;

    const interval = setInterval(() => {
      dispatch(checkSessionThunk());
    }, 60000);

    return () => clearInterval(interval);
  }, [dispatch, isValidSession]);

  return null;
}