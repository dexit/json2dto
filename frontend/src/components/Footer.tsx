import React from 'react';

const Footer: React.FC = () => {
  return (
    <div className="flex justify-center my-6 text-sm text-gray-500">
      <div>
        Created by <a className="font-bold" href="https://atymic.dev">atymic</a>
      </div>
      <div className="mx-2">
        •
      </div>
      <div>
        Source code on <a className="font-bold" href="https://github.com/atymic/json2dto">Github</a>
      </div>
    </div>
  );
};

export default Footer;