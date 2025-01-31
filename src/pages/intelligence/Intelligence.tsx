import React from 'react';
import { Outlet } from 'react-router-dom';

const Intelligence = () => {
  return (
    <div className="container mx-auto p-6">
      <Outlet />
    </div>
  );
};

export default Intelligence;