import './style.css';
import {
  registerFileSystemOverlay,
  HTMLFileSystemProvider,
} from '@codingame/monaco-vscode-files-service-override';
import * as vscode from 'vscode';
import { ILogService, StandaloneServices } from 'vscode/services';
import completed from './features/filesystem';
import './setup';
import '@codingame/monaco-vscode-theme-defaults-default-extension';
import '@codingame/monaco-vscode-javascript-default-extension';
import '@codingame/monaco-vscode-typescript-basics-default-extension';
import '@codingame/monaco-vscode-typescript-language-features-default-extension';
import '@codingame/monaco-vscode-typescript-basics-default-extension';
import '@codingame/monaco-vscode-theme-defaults-default-extension';
import '@codingame/monaco-vscode-theme-seti-default-extension';

completed;

await Promise.all([
  vscode.workspace.openTextDocument(vscode.Uri.file('/tmp/test_readonly.js')), // open the file so vscode sees it's locked
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
