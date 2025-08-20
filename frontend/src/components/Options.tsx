import React from 'react';
import { GenerationOptions } from '../types';

interface OptionsProps {
  options: GenerationOptions;
  onChange: (options: GenerationOptions) => void;
}

const Options: React.FC<OptionsProps> = ({ options, onChange }) => {
  const updateOption = <K extends keyof GenerationOptions>(
    key: K, 
    value: GenerationOptions[K]
  ) => {
    onChange({ ...options, [key]: value });
  };

  return (
    <div className="flex flex-wrap -mx-3 mb-2">
      <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="namespace">
          Namespace
        </label>
        <input 
          value={options.namespace} 
          onChange={(e) => updateOption('namespace', e.target.value)}
          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
          id="namespace" 
          type="text"
        />
      </div>
      <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="name">
          Class Name
        </label>
        <input 
          value={options.name} 
          onChange={(e) => updateOption('name', e.target.value)}
          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
          id="name" 
          placeholder="JsonDataTransferObject" 
          type="text"
        />
      </div>
      <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="typed">
          Language Level
        </label>
        <div className="relative">
          <select 
            value={options.version} 
            onChange={(e) => updateOption('version', e.target.value as GenerationOptions['version'])}
            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
            id="typed"
          >
            <option value="v2_doc">PHP &lt; 7.4 (Docblock Types)</option>
            <option value="v2_typed">PHP &gt;= 7.4 (Typed Properties)</option>
            <option value="v3">PHP &gt;= 8.0 (Typed + Attributes)</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
          DTO Type
        </label>
        <div>
          <label className="flex items-center cursor-pointer">
            <div className="bg-white shadow w-6 h-6 p-1 flex justify-center items-center mr-2">
              <input 
                type="checkbox" 
                className="hidden"
                checked={options.flexible}
                onChange={(e) => updateOption('flexible', e.target.checked)}
              />
              <svg 
                className={`w-4 h-4 text-green-600 pointer-events-none ${options.flexible ? 'block' : 'hidden'}`} 
                viewBox="0 0 172 172"
              >
                <g fill="none" strokeWidth="none" strokeMiterlimit="10" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" style={{mixBlendMode: 'normal'}}>
                  <path d="M0 172V0h172v172z"/>
                  <path d="M145.433 37.933L64.5 118.8658 33.7337 88.0996l-10.134 10.1341L64.5 139.1341l91.067-91.067z" fill="currentColor" strokeWidth="1"/>
                </g>
              </svg>
            </div>
            <span className="select-none">Flexible</span>
          </label>
          <p className="text-xs mt-1">
            See{' '}
            <a 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-500 hover:text-indigo-700" 
              href="https://github.com/spatie/data-transfer-object/issues/61"
            >
              this issue
            </a>{' '}
            for information
          </p>
        </div>
      </div>
    </div>
  );
};

export default Options;