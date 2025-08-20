import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import JsonInputEditor from './JsonInputEditor';
import DtoOutput from './DtoOutput';
import Options from './Options';
import { GenerationOptions, ApiResponse } from '../types';

const defaultJson = JSON.stringify({ 
  'id': 45, 
  'name': 'hello world', 
  'price': 44.5, 
  'enabled': true 
}, null, 2);

const defaultDto = `<?php

namespace App\\DTO;

use Spatie\\DataTransferObject\\DataTransferObject;

class JsonDataTransferObject extends DataTransferObject
{
\t/** @var int $id */
\tpublic $id;

\t/** @var string $name */
\tpublic $name;

\t/** @var float $price */
\tpublic $price;

\t/** @var bool $enabled */
\tpublic $enabled;
}`;

const Converter: React.FC = () => {
  const [json, setJson] = useState(defaultJson);
  const [options, setOptions] = useState<GenerationOptions>({
    namespace: 'App\\DTO',
    name: '',
    version: 'v2_typed',
    flexible: false,
    nested: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dto, setDto] = useState(defaultDto);

  const isJsonString = (str: string): boolean => {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  const generate = useCallback(async () => {
    setError(null);

    if (!isJsonString(json)) {
      setError('Invalid JSON Input');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post<ApiResponse>(
        import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8081',
        {
          namespace: options.namespace || null,
          name: options.name || null,
          typed: options.version === 'v3' || options.version === 'v2_typed',
          v3: options.version === 'v3',
          nested: options.nested,
          flexible: options.flexible,
          source: JSON.parse(json),
        },
        {
          responseType: options.nested ? 'blob' : 'text'
        }
      );

      if (options.nested && response.data instanceof Blob) {
        saveAs(response.data, `${options.name || 'NewDTO'}_dto.zip`);
      } else {
        setDto(response.data as string);
      }
    } catch (err) {
      setError('Failed to generate DTO');
    } finally {
      setLoading(false);
    }
  }, [json, options]);

  return (
    <div className="mb-10">
      <div className="max-w-6xl mx-auto mt-8">
        <p className="text-gray-800 px-4 md:px-0">
          Json 2 DTO generates{' '}
          <a 
            className="text-indigo-500 hover:text-indigo-700"
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/spatie/data-transfer-object"
          >
            spatie/data-transfer-object
          </a>{' '}
          objects automatically from json snippets.
          <br />Your DTOs then allow you statically type check code that interacts with them.
        </p>
        
        <div className="flex justify-center items-center my-6">
          <button 
            onClick={generate} 
            disabled={loading}
            className="bg-indigo-500 text-white active:bg-indigo-600 disabled:opacity-75 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 transition-all duration-150"
            type="button"
          >
            Generate DTO
          </button>
          <div className="ml-3">
            <label className="flex items-center cursor-pointer">
              <div className="bg-white shadow w-6 h-6 p-1 flex justify-center items-center mr-2">
                <input 
                  type="checkbox" 
                  className="hidden"
                  checked={options.nested}
                  onChange={(e) => setOptions(prev => ({ ...prev, nested: e.target.checked }))}
                />
                <svg 
                  className={`w-4 h-4 text-green-600 pointer-events-none ${options.nested ? 'block' : 'hidden'}`} 
                  viewBox="0 0 172 172"
                >
                  <g fill="none" strokeWidth="none" strokeMiterlimit="10" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" style={{mixBlendMode: 'normal'}}>
                    <path d="M0 172V0h172v172z"/>
                    <path d="M145.433 37.933L64.5 118.8658 33.7337 88.0996l-10.134 10.1341L64.5 139.1341l91.067-91.067z" fill="currentColor" strokeWidth="1"/>
                  </g>
                </svg>
              </div>
              <span className="select-none">Generate Nested DTOs</span>
            </label>
            <p className="text-xs mt-1">A Zip file containing the DTOs will be generated</p>
          </div>
        </div>

        {error && (
          <div className="text-white px-6 py-4 border-0 rounded relative mb-4 bg-red-500">
            <span className="inline-block align-middle mr-8">
              <b className="capitalize">Error</b> {error}
            </span>
          </div>
        )}

        <div className="px-4 md:p-0">
          <Options options={options} onChange={setOptions} />
          <div className="md:flex container border flex-wrap" style={{ height: '65vh' }}>
            <JsonInputEditor 
              value={json} 
              onChange={setJson}
              className="w-full md:w-1/2"
            />
            <DtoOutput 
              nested={options.nested}
              loading={loading}
              value={dto}
              className="w-full md:w-1/2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Converter;