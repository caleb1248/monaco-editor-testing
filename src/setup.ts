import * as monaco from "monaco-editor";
import "./tools/crossOriginWorker";
import getTextmateServiceOverride from "@codingame/monaco-vscode-textmate-service-override";
import getThemeServiceOverride from "@codingame/monaco-vscode-theme-service-override";
import getLanguagesServiceOverride from "@codingame/monaco-vscode-languages-service-override/languages";
import { initialize as initializeMonacoServices } from "vscode/services";
import getExtensionsServiceOverride from "@codingame/monaco-vscode-extensions-service-override";
import "@codingame/monaco-vscode-theme-defaults-default-extension";
import "@codingame/monaco-vscode-javascript-default-extension";
import "@codingame/monaco-vscode-typescript-basics-default-extension";
import "@codingame/monaco-vscode-typescript-language-features-default-extension";
import "vscode/localExtensionHost";
import { Worker } from "./tools/crossOriginWorker";

type WorkerLoader = () => Worker;
const workerLoaders: Partial<Record<string, WorkerLoader>> = {
  editorWorkerService: () =>
    new Worker(
      new URL("monaco-editor/esm/vs/editor/editor.worker.js", import.meta.url),
      { type: "module" }
    ),
  textMateWorker: () =>
    new Worker(
      new URL(
        "@codingame/monaco-vscode-textmate-service-override/worker",
        import.meta.url
      ),
      { type: "module" }
    ),
  outputLinkComputer: () =>
    new Worker(
      new URL(
        "@codingame/monaco-vscode-output-service-override/worker",
        import.meta.url
      ),
      { type: "module" }
    ),
  languageDetectionWorkerService: () =>
    new Worker(
      new URL(
        "@codingame/monaco-vscode-language-detection-worker-service-override/worker",
        import.meta.url
      ),
      { type: "module" }
    ),
  notebookEditorWorkerService: () =>
    new Worker(
      new URL(
        "@codingame/monaco-vscode-notebook-service-override/worker",
        import.meta.url
      ),
      { type: "module" }
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
  ...getLanguagesServiceOverride(),
  ...getTextmateServiceOverride(),
  ...getThemeServiceOverride(),
  ...getExtensionsServiceOverride(),
});

export default monaco;
