import './tools/crossOriginWorker';
import { initialize as initializeMonacoServices } from 'vscode/services';
import getTextmateServiceOverride from '@codingame/monaco-vscode-textmate-service-override';
import getThemeServiceOverride from '@codingame/monaco-vscode-theme-service-override';
import getLanguagesServiceOverride from '@codingame/monaco-vscode-languages-service-override/languages';
import getExtensionsServiceOverride from '@codingame/monaco-vscode-extensions-service-override';
import getViewsServiceOverride, {
  Parts,
  Position,
  attachPart,
  getSideBarPosition,
  isPartVisibile,
  onDidChangeSideBarPosition,
  onPartVisibilityChange,
} from '@codingame/monaco-vscode-views-service-override/views';
import getKeybindingsServiceOverride from '@codingame/monaco-vscode-keybindings-service-override/keybindings';
import getModelServiceOverride from '@codingame/monaco-vscode-model-service-override';
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

console.log('eee');

await initializeMonacoServices({
  ...getModelServiceOverride(),
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

for (const config of [
  { part: Parts.TITLEBAR_PART, element: '#titleBar' },
  { part: Parts.BANNER_PART, element: '#banner' },
  {
    part: Parts.SIDEBAR_PART,
    get element() {
      return getSideBarPosition() === Position.LEFT
        ? '#sidebar'
        : '#sidebar-right';
    },
    onDidElementChange: onDidChangeSideBarPosition,
  },
  {
    part: Parts.ACTIVITYBAR_PART,
    get element() {
      return getSideBarPosition() === Position.LEFT
        ? '#activityBar'
        : '#activityBar-right';
    },
    onDidElementChange: onDidChangeSideBarPosition,
  },
  { part: Parts.PANEL_PART, element: '#panel' },
  { part: Parts.EDITOR_PART, element: '#editors' },
  { part: Parts.STATUSBAR_PART, element: '#statusBar' },
  {
    part: Parts.AUXILIARYBAR_PART,
    get element() {
      return getSideBarPosition() === Position.LEFT
        ? '#auxiliaryBar'
        : '#auxiliaryBar-left';
    },
    onDidElementChange: onDidChangeSideBarPosition,
  },
]) {
  attachPart(
    config.part,
    document.querySelector<HTMLDivElement>(config.element)!
  );

  config.onDidElementChange?.(() => {
    attachPart(
      config.part,
      document.querySelector<HTMLDivElement>(config.element)!
    );
  });

  if (!isPartVisibile(config.part)) {
    document.querySelector<HTMLDivElement>(config.element)!.style.display =
      'none';
  }

  onPartVisibilityChange(config.part, (visible) => {
    document.querySelector<HTMLDivElement>(config.element)!.style.display =
      visible ? 'block' : 'none';
  });
}
