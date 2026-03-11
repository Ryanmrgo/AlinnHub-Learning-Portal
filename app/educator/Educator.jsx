'use client'

import React from 'react'
import SideBar from '@/components/educator/SideBar'
import Navbar from '@/components/educator/Navbar'
import Footer from '@/components/educator/Footer'

const Educator = ({ children }) => {
    return (
        <div className="text-default min-h-screen bg-white">
            <Navbar />
            <div className='flex'>
                <SideBar />
                <div className='flex-1'>
                    {children}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Educator
