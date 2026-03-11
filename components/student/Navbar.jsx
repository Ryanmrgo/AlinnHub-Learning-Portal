'use client'

import React, { useContext } from 'react';
import { assets } from '@/lib/assets';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AppContext } from '@/app/context/AppContext';
import { useClerk, UserButton, useUser } from '@clerk/nextjs';

const Navbar = () => {

  const pathname = usePathname();
  const router = useRouter();

  const isCoursesListPage = pathname.includes('/course-list');

  const { isEducator } = useContext(AppContext)

  const { openSignIn } = useClerk()
  const { user } = useUser()

  const handleOpenSignIn = () => {
    if (user) return
    openSignIn()
  }

  return (
    <div className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-4 ${isCoursesListPage ? 'bg-white' : 'bg-cyan-100/70'}`}>
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => router.push('/')}
      >
        <img src={assets.logo} alt="AlinHub logo" className="w-28 lg:w-32" />
      </div>
      <div className="md:flex hidden items-center gap-5 text-gray-500">
        <div className="flex items-center gap-5">
          {user && (
            <>
              {isEducator ? (
                <button onClick={() => router.push('/educator')}>Educator Dashboard</button>
              ) : (
                <>
                  <button onClick={() => router.push('/course-list')}>Browse Course</button>
                  | <Link href='/profile'>Profile</Link>
                  | <Link href='/wishlist'>Wishlist</Link>
                  | <Link href='/my-enrollments'>My Enrollments</Link>
                </>
              )}
            </>
          )}
        </div>
        {user
          ? <UserButton />
          : <button onClick={handleOpenSignIn} className="bg-blue-600 text-white px-5 py-2 rounded-full">
            Sign Up
          </button>}
      </div>
      {/* For Phone Screens */}
      <div className='md:hidden flex items-center gap-2 sm:gap-5 text-gray-500'>
        <div className="flex items-center gap-1 sm:gap-2 max-sm:text-xs">
          {user && (
            <>
              {isEducator ? (
                <button onClick={() => router.push('/educator')}>Educator Dashboard</button>
              ) : (
                <>
                  <button onClick={() => router.push('/course-list')}>Browse Course</button>
                  | <Link href='/profile'>Profile</Link>
                  | <Link href='/wishlist'>Wishlist</Link>
                  | <Link href='/my-enrollments'>My Enrollments</Link>
                </>
              )}
            </>
          )}
        </div>
        {user
          ? <UserButton />
          : <button onClick={handleOpenSignIn}>
            <img src={assets.user_icon} alt="" />
          </button>}
      </div>
    </div>
  );
};

export default Navbar;
