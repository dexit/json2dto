import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { php } from '@codemirror/lang-php';
import { oneDark } from '@codemirror/theme-one-dark';
import ZipIcon from './ZipIcon';
import Spinner from './Spinner';

interface DtoOutputProps {
  nested: boolean;
  value: string;
  loading: boolean;
  className?: string;
}

const DtoOutput: React.FC<DtoOutputProps> = ({ nested, value, loading, className }) => {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={`flex-1 flex flex-col h-full ${className || ''}`}>
      <div className="flex flex-wrap border-b border-l text-sm select-none">
        <span className="py-2 px-3 text-gray-500">
          Generated DTO
        </span>
        <button 
          onClick={copyToClipboard}
          className="text-indigo-500 font-semibold ml-auto py-2 px-3 focus:outline-none border-b-3 transition border-transparent hover:bg-gray-200 focus:bg-gray-400"
        >
          Copy To Clipboard
        </button>
      </div>
      <div className="h-full border-l">
        {loading ? (
          <div className="flex-1 flex flex-col justify-center items-center">
            <Spinner size="large" />
          </div>
        ) : nested ? (
          <div className="py-20 text-center">
            <ZipIcon className="h-16 mx-auto mb-2" />
            <h3 className="text-2xl text-gray-800">Generating Nested DTOs</h3>
            <p className="text-gray-700">A zip archive of the generated DTO objects will be downloaded</p>
          </div>
        ) : (
          <CodeMirror
            value={value}
            editable={false}
            extensions={[php()]}
            theme={oneDark}
            height="100%"
            basicSetup={{
              lineNumbers: true,
              foldGutter: true,
              dropCursor: false,
              allowMultipleSelections: false,
              indentOnInput: false,
              bracketMatching: true,
              closeBrackets: false,
              autocompletion: false,
              highlightSelectionMatches: false,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DtoOutput;