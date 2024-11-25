'use client'
import React, { useEffect, useState } from 'react';

import { EditorState, RichUtils } from 'draft-js';
import dynamic from 'next/dynamic';
import { EditorPanel } from '..';

interface Props {
    className?: string;
} 

const EditorWithNoSSR = dynamic(() => import('draft-js').then((mod) => mod.Editor), {
    ssr: false,
});

export const Editor: React.FC<Props> = ({ className }) => {

    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const hasContent = editorState.getCurrentContent().hasText();

    useEffect(() => {
        setEditorState(EditorState.createEmpty());
    }, []);

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
            <EditorPanel toggleBold={toggleBold} toggleItalic={toggleItalic} toggleUnderline={toggleUnderline} />
            <div className='custom-draft relative bg-neutral-300/75 dark:bg-neutral-800/75 text-base font-medium h-[200px] overflow-auto rounded-[15px] rounded-tl-[0] p-2 scrollbar'>
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
