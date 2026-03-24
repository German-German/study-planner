"use client";

import { useEffect } from 'react';
import { storage } from '@/lib/storage';

export default function StorageInitializer() {
  useEffect(() => {
    storage.initialize();
  }, []);

  return null;
}
