'use client'
import React from 'react';

import { EditorState, RichUtils  } from 'draft-js';
import dynamic from 'next/dynamic';
import { EditorPanel } from '..';

interface Props {
    className?: string;
    handlePgoto: (e: React.ChangeEvent<HTMLInputElement>) => void
    editorState: EditorState;
    setEditorState: (state: EditorState) => void
} 

const EditorWithNoSSR = dynamic(() =>
    import('draft-js').then((mod) => mod.Editor as unknown as React.ComponentType<{ 
      editorState: EditorState; 
      onChange: (state: EditorState) => void; 
      placeholder: string; 
    }>),
    { ssr: false }
  );

export const Editor: React.FC<Props> = ({ className, handlePgoto, editorState, setEditorState  }) => {
   
    const hasContent = editorState.getCurrentContent().hasText();

    const handleEditorChange = (state: EditorState) => {
      setEditorState(state);
    };
    
    const toggleBold = () => {
        const newState = RichUtils.toggleInlineStyle(editorState, 'BOLD');
        setEditorState(newState);
    };

    const toggleItalic = () => {
        const newState = RichUtils.toggleInlineStyle(editorState, 'ITALIC');
        setEditorState(newState);
    };

    const toggleUnderline = () => {
        const newState = RichUtils.toggleInlineStyle(editorState, 'UNDERLINE');
        setEditorState(newState);
    };

    return (
        <div className={className}>
            <EditorPanel toggleBold={toggleBold} toggleItalic={toggleItalic} toggleUnderline={toggleUnderline} handlePgoto={e => handlePgoto(e)} />
            <div className='custom-draft relative bg-neutral-300/75 dark:bg-neutral-800/75 text-base font-medium h-[400px] overflow-auto rounded-[15px] rounded-tl-[0] p-2 scrollbar'>
                <EditorWithNoSSR
                    editorState={editorState}
                    onChange={handleEditorChange}
                    placeholder=''
                />
                {!hasContent && (
                    <div className="placeholder absolute left-2 top-2 text-gray-500">Body</div>
                )}
            </div>  
        </div>
    );
};
