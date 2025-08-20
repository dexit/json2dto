import React, { useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { oneDark } from '@codemirror/theme-one-dark';

interface JsonInputEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const JsonInputEditor: React.FC<JsonInputEditorProps> = ({ value, onChange, className }) => {
  const tidy = useCallback(() => {
    try {
      const parsed = JSON.parse(value);
      onChange(JSON.stringify(parsed, null, 2));
    } catch (e) {
      // Keep original value if parsing fails
    }
  }, [value, onChange]);

  return (
    <div className={`flex-1 flex h-full flex-col ${className || ''}`}>
      <div className="flex flex-wrap border-b text-sm select-none">
        <span className="py-2 px-3 text-gray-500">
          Input Json
        </span>
        <button 
          onClick={tidy}
          className="text-indigo-500 font-semibold ml-auto py-2 px-3 focus:outline-none border-b-3 transition border-transparent hover:bg-gray-200 focus:bg-gray-400"
        >
          Tidy
        </button>
      </div>
      <div className="h-full">
        <CodeMirror
          value={value}
          onChange={onChange}
          extensions={[json()]}
          theme={oneDark}
          height="100%"
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            dropCursor: false,
            allowMultipleSelections: false,
            indentOnInput: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            highlightSelectionMatches: false,
          }}
        />
      </div>
    </div>
  );
};

export default JsonInputEditor;