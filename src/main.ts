import './style.css';
import * as monaco from 'monaco-editor';
import {
  registerFileSystemOverlay,
  HTMLFileSystemProvider,
} from '@codingame/monaco-vscode-files-service-override';
import * as vscode from 'vscode';
import { ILogService, StandaloneServices } from 'vscode/services';
import './setup';
// import './features/filesystem';

// @ts-ignore
const modelRef = await monaco.editor.createModelReference(
  monaco.Uri.file('/tmp/test.js')
);

await Promise.all([
  vscode.workspace.openTextDocument(modelRef.object.textEditorModel!.uri),
  vscode.workspace.openTextDocument(monaco.Uri.file('/tmp/test_readonly.js')), // open the file so vscode sees it's locked
]);

document.querySelector('#filesystem')!.addEventListener('click', async () => {
  const dirHandle = await window.showDirectoryPicker();

  const htmlFileSystemProvider = new HTMLFileSystemProvider(
    undefined,
    'unused',
    StandaloneServices.get(ILogService)
  );
  await htmlFileSystemProvider.registerDirectoryHandle(dirHandle);
  registerFileSystemOverlay(1, htmlFileSystemProvider);

  vscode.workspace.updateWorkspaceFolders(0, 0, {
    uri: vscode.Uri.file(dirHandle.name),
  });
});

document.querySelector('#run')!.addEventListener('click', () => {
  void vscode.debug.startDebugging(undefined, {
    name: 'Test',
    request: 'attach',
    type: 'javascript',
  });
});
