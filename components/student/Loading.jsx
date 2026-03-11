'use client'

import { useEffect } from "react";
import { useParams, useRouter } from 'next/navigation';

const Loading = () => {
  const { path } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (path) {
      const timer = setTimeout(() => {
        router.push(`/${path}`);
      }, 5000);

      // Cleanup the timer on component unmount
      return () => clearTimeout(timer);
    }
  }, [path, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-16 sm:w-20 aspect-square border-4 border-gray-300 border-t-4 border-t-blue-400 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loading;

