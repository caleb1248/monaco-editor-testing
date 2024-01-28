import getTextmateServiceOverride from '@codingame/monaco-vscode-textmate-service-override';
import getThemeServiceOverride from '@codingame/monaco-vscode-theme-service-override';
import '@codingame/monaco-vscode-theme-defaults-default-extension';
import '@codingame/monaco-vscode-javascript-default-extension';
import '@codingame/monaco-vscode-typescript-basics-default-extension';

import * as monaco from 'monaco-editor';
import { initialize } from 'vscode/services';
import './workers';
import './filesystem';

await initialize({
  ...getTextmateServiceOverride(),
  ...getThemeServiceOverride(),
});

const editorDiv = document.createElement('div');
editorDiv.style.height = '100%';

import { createConfiguredEditor, createModelReference } from 'vscode/monaco';
const uri = monaco.Uri.file('/path/to/index.ts');
const model = monaco.editor.createModel('console.log("hi")', undefined, uri);
const modelRef = await createModelReference(uri);

const editor = createConfiguredEditor(editorDiv, {
  model: modelRef.object.textEditorModel,
  automaticLayout: true,
});

export default function MonacoEditor() {
  return (
    <div
      ref={(div) => (div ? div.replaceWith(editorDiv) : editor.dispose())}
    ></div>
  );
}
