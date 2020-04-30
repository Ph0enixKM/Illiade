import {
    CloseAction,
    createConnection,
    ErrorAction,
    MonacoLanguageClient,
    MonacoServices
  } from "monaco-languageclient";
  import {
    createMessageConnection,
    DataCallback,
    Disposable,
    Message,
    MessageConnection,
    MessageReader,
    MessageWriter,
    Trace
  } from "vscode-jsonrpc";
      
  export function startLanguageClient(editor, rootUri) {
    // create & install services
    MonacoServices.install(editor, { rootUri });
  
    // launch language server
    const { ipcChannel } = launchLanguageServer();
  
    // wire up the IPC connection
    const reader = new RendererIpcMessageReader(ipcChannel);
    const writer = new RendererIpcMessageWriter(ipcChannel);
    const connection = createMessageConnection(reader, writer);
  
    // create and start the language client
    const client = createBaseLanguageClient(connection);
    client.start();
  
    return client;
  }
  
  function createBaseLanguageClient(connection) {
    const client = new MonacoLanguageClient({
      clientOptions: {
        documentSelector: ["$ts"],
        errorHandler: {
          closed: () => CloseAction.DoNotRestart,
          error: () => ErrorAction.Continue
        }
      },
      connectionProvider: {
        get: async (errorHandler, closeHandler) => createConnection(connection, errorHandler, closeHandler)
      },
      name: "typescript language server"
    });
  
    // for debugging
    client.trace = Trace.Messages;
  
    return client;
  }
  
  // tslint:disable-next-line:no-var-requires
//   const ipcRenderer = require("electron").ipcRenderer
  
  // custom implementations of the MessageReader and MessageWriter to plug into a MessageConnection

  