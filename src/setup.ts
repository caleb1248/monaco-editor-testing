import * as monaco from 'monaco-editor';
import './tools/crossOriginWorker';
import { initialize as initializeMonacoServices } from 'vscode/services';
import getTextmateServiceOverride from '@codingame/monaco-vscode-textmate-service-override';
import getThemeServiceOverride from '@codingame/monaco-vscode-theme-service-override';
import getLanguagesServiceOverride from '@codingame/monaco-vscode-languages-service-override/languages';
import getExtensionsServiceOverride from '@codingame/monaco-vscode-extensions-service-override';
import getViewsServiceOverride from '@codingame/monaco-vscode-views-service-override/views';
import getFilesServiceOverride from '@codingame/monaco-vscode-files-service-override';
import getKeybindingsServiceOverride from '@codingame/monaco-vscode-keybindings-service-override/keybindings';
import '@codingame/monaco-vscode-theme-defaults-default-extension';
import '@codingame/monaco-vscode-javascript-default-extension';
import '@codingame/monaco-vscode-typescript-basics-default-extension';
import '@codingame/monaco-vscode-typescript-language-features-default-extension';
import '@codingame/monaco-vscode-typescript-basics-default-extension';
import '@codingame/monaco-vscode-theme-defaults-default-extension';
import '@codingame/monaco-vscode-theme-seti-default-extension';
import 'vscode/localExtensionHost';
import { Worker } from './tools/crossOriginWorker';
import { workerConfig } from './tools/extHostWorker';
import { openNewCodeEditor } from './features/editor';

type WorkerLoader = () => Worker;
const workerLoaders: Partial<Record<string, WorkerLoader>> = {
  editorWorkerService: () =>
    new Worker(
      new URL('monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url),
      { type: 'module' }
    ),
  textMateWorker: () =>
    new Worker(
      new URL(
        '@codingame/monaco-vscode-textmate-service-override/worker',
        import.meta.url
      ),
      { type: 'module' }
    ),
  outputLinkComputer: () =>
    new Worker(
      new URL(
        '@codingame/monaco-vscode-output-service-override/worker',
        import.meta.url
      ),
      { type: 'module' }
    ),
  languageDetectionWorkerService: () =>
    new Worker(
      new URL(
        '@codingame/monaco-vscode-language-detection-worker-service-override/worker',
        import.meta.url
      ),
      { type: 'module' }
    ),
  notebookEditorWorkerService: () =>
    new Worker(
      new URL(
        '@codingame/monaco-vscode-notebook-service-override/worker',
        import.meta.url
      ),
      { type: 'module' }
    ),
};

self.MonacoEnvironment = {
  getWorker: function (moduleId, label) {
    const workerFactory = workerLoaders[label];
    if (workerFactory != null) {
      return workerFactory();
    }
    throw new Error(`Unimplemented worker ${label} (${moduleId})`);
  },
};

await initializeMonacoServices({
  ...getFilesServiceOverride(),
  ...getLanguagesServiceOverride(),
  ...getTextmateServiceOverride(),
  ...getThemeServiceOverride(),
  ...getExtensionsServiceOverride(workerConfig),
  ...getViewsServiceOverride(openNewCodeEditor, undefined, (state) => ({
    ...state,
    editor: {
      ...state.editor,
      restoreEditors: true,
    },
  })),
  ...getKeybindingsServiceOverride(),
});

export default monaco;
