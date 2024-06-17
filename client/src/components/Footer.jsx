import React from 'react'

const Footer = () => {
    return (
      <footer className="flex bg-gray-200 items-center p-2">
        <p className='text-center mx-auto text-gray-600 text-sm'>&copy; {new Date().getFullYear()} Kartik Goyal. All rights reserved.</p>
      </footer>
    );
  };

export default Footer