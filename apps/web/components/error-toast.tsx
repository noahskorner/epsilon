'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

interface ErrorToastProps {
  message: string | null;
  onToast?: (message: string) => void;
}

export function ErrorToast({ message, onToast }: ErrorToastProps) {
  const lastMessage = useRef<string | null>(null);

  useEffect(() => {
    if (!message || message === lastMessage.current) {
      return;
    }

    lastMessage.current = message;
    toast.error(message);
    onToast?.(message);
  }, [message, onToast]);

  return null;
}
