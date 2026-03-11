'use client'

import React, { useContext } from 'react';
import { assets } from '@/lib/assets';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AppContext } from '@/app/context/AppContext';
import { useClerk, UserButton, useUser } from '@clerk/nextjs';
import { toast } from 'react-toastify';
import axios from 'axios';

const Navbar = () => {

  const pathname = usePathname();
  const router = useRouter();

  const isCoursesListPage = pathname.includes('/course-list');

  const { isEducator, setIsEducator, getToken } = useContext(AppContext)

  const { openSignIn } = useClerk()
  const { user } = useUser()

  const becomeEducator = async () => {

    try {

      if (isEducator) {
        router.push('/educator')
        return;
      }

      const token = await getToken()
      const { data } = await axios.get('/api/educator/update-role', { headers: { Authorization: `Bearer ${token}` } })
      if (data.success) {
        toast.success(data.message)
        setIsEducator(true)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-4 ${isCoursesListPage ? 'bg-white' : 'bg-cyan-100/70'}`}>
      <img onClick={() => router.push('/')} src={assets.logo} alt="Logo" className="w-28 lg:w-32 cursor-pointer" />
      <div className="md:flex hidden items-center gap-5 text-gray-500">
        <div className="flex items-center gap-5">
          {
            user && <>
              <button onClick={becomeEducator}>{isEducator ? 'Educator Dashboard' : 'Become Educator'}</button>
              | <Link href='/profile' >Profile</Link>
              | <Link href='/wishlist' >Wishlist</Link>
              | <Link href='/my-enrollments' >My Enrollments</Link>
            </>
          }
        </div>
        {user
          ? <UserButton />
          : <button onClick={() => openSignIn()} className="bg-blue-600 text-white px-5 py-2 rounded-full">
            Create Account
          </button>}
      </div>
      {/* For Phone Screens */}
      <div className='md:hidden flex items-center gap-2 sm:gap-5 text-gray-500'>
        <div className="flex items-center gap-1 sm:gap-2 max-sm:text-xs">
          <button onClick={becomeEducator}>{isEducator ? 'Educator Dashboard' : 'Become Educator'}</button>
          | {
            user && <Link href='/profile' >Profile</Link>
          }
          | {
            user && <Link href='/wishlist' >Wishlist</Link>
          }
          | {
            user && <Link href='/my-enrollments' >My Enrollments</Link>
          }
        </div>
        {user
          ? <UserButton />
          : <button onClick={() => openSignIn()}>
            <img src={assets.user_icon} alt="" />
          </button>}
      </div>
    </div>
  );
};

export default Navbar;
