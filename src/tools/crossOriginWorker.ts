class CrossOriginWorker extends Worker {
  constructor(url: string | URL, options: WorkerOptions = {}) {
    const fullUrl = new URL(url, window.location.href).href;
    const js =
      options.type === 'module'
        ? `import '${fullUrl}';`
        : `importScripts('${fullUrl}');`;
    const blob = new Blob([js], { type: 'application/javascript' });
    super(URL.createObjectURL(blob), options);
  }
}

export { CrossOriginWorker as Worker };
