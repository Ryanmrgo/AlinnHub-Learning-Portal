import React from 'react';
import { assets } from '@/lib/assets';
import SearchBar from '../../components/student/SearchBar';

const Hero = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full md:pt-36 pt-20 px-7 md:px-0 space-y-7 text-center bg-gradient-to-b from-cyan-100/70">
      <h1 className="text-3xl md:text-home-heading-large text-home-heading-small relative font-bold text-gray-800 max-w-3xl mx-auto">
      Learn Without Limits,
      Grow Without Barriers
        <span className=" text-3xl text-blue-600"> to fit your choice.</span>
        <img src={assets.sketch} alt="sketch" className="md:block hidden absolute -bottom-7 right-0" />
      </h1>
      <p className="md:block hidden text-gray-500 max-w-2xl mx-auto">
      Join AlinHub, a charity-based learning platform offering free, high-quality education for everyone. Learn new skills, advance your career, and achieve your goals.
      </p>
      <SearchBar />
    </div>
  );
};

export default Hero;

