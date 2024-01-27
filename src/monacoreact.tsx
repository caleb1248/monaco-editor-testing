import getTextmateServiceOverride from '@codingame/monaco-vscode-textmate-service-override';
import getThemeServiceOverride from '@codingame/monaco-vscode-theme-service-override';
import { Uri } from 'monaco-editor';
import { initialize } from 'vscode/services';

await initialize({
  ...getTextmateServiceOverride(),
  getThemeServiceOverride,
});

const editorDiv = document.createElement('div');

import { createConfiguredEditor, createModelReference } from 'vscode/monaco';

const modelRef = await createModelReference(Uri.file('/path/to/index.ts'));

const editor = createConfiguredEditor(editorDiv, {
  model: modelRef.object.textEditorModel,
});
console.log('yay');

export default function MonacoEditor() {
  return (
    <div
      ref={(div) => (div ? div.replaceWith(editorDiv) : editor.dispose())}
    ></div>
  );
}
