'use client'

import React, { useContext } from 'react';
import { assets } from '@/lib/assets';
import Link from 'next/link';
import { AppContext } from '@/app/context/AppContext';
import { UserButton, useUser } from '@clerk/nextjs';

const Navbar = ({ bgColor }) => {

  const { isEducator } = useContext(AppContext)
  const { user } = useUser()

  return isEducator && user && (
    <div className={`flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3 ${bgColor}`}>
      <Link href="/">
        <img src={assets.logo} alt="Logo" className="w-28 lg:w-32" />
      </Link>
      <div className="flex items-center gap-5 text-gray-500 relative">
        <p>Hi! {user.fullName}</p>
        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;

