import { spawn } from "child_process";
import path from "path";
// // import { StreamMessageReader, StreamMessageWriter } from "vscode-jsonrpc"
import {
    CloseAction,
    createConnection,
    ErrorAction,
    MonacoLanguageClient,
    MonacoServices
  } from 'monaco-languageclient'
  import {
    StreamMessageReader,
    StreamMessageWriter,
    createMessageConnection,
    DataCallback,
    Disposable,
    Message, 
    MessageConnection,
    MessageReader,
    MessageWriter,
    Trace
  } from "vscode-jsonrpc";

class LanguageServer {
    constructor() {
        const thePath = monaco.Uri.parse(
            "file://" + ROOT.val.replace(/\\/g, "/")
        )
        this.startLanguageClient(editor, thePath.toString())
    }

    // I think this one is supposed to be a constructor
    startLanguageClient(editor, rootUri) {
        console.log(rootUri);
        
        // create & install services        
        MonacoServices.install(editor, { rootUri });
      
        // launch language server
        this.launchLanguageServer();
      
        // wire up the IPC connection
        const reader = new RendererIpcMessageReader(this);
        const writer = new RendererIpcMessageWriter(this);
        const connection = createMessageConnection(reader, writer);
      
        // create and start the language client
        const client = this.createBaseLanguageClient(connection);
        client.start();
        console.log(client);
        
      
        return client;
    }
    

    launchLanguageServer() {
        const ext = process.platform.startsWith("win") ? ".cmd" : ""
        const lsPath = path.resolve(`node_modules/.bin/typescript-language-server${ext}`)
        console.log(`launching typescript language server process with ${lsPath}`)
        const lsProcess = spawn(lsPath, ["--stdio"])
    
        // choose a unique channel name, e.g. by using the PID
        // const ipcChannel = "ls_" + lsProcess.pid;
    
        // create reader/writer for I/O streams
        this.reader = new StreamMessageReader(lsProcess.stdout)
        this.writer = new StreamMessageWriter(lsProcess.stdin)
    }


    createBaseLanguageClient(connection) {
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
        })
      
        // for debugging
        client.trace = Trace.Messages
      
        return client
    }
}

// EDITOR_LOAD.trigger(v => {
//   new LanguageServer()
// })


class RendererIpcMessageReader {
      
    constructor(mainCtx) {
        this.subscribers = []
        this.handler = this.notifySubscribers.bind(this)
        // listen to incoming language server notifications and messages from the backend
        mainCtx.reader.listen((msg) => {
            console.log('Reader: ', msg)
            this.handler(msg)
        })
    }
  
    // events are not implemented for this example
    onError() { this.dummyDisposable() }
    onClose() { this.dummyDisposable() }
    onPartialMessage() { this.dummyDisposable() }
  
    listen(callback) {
      this.subscribers.push(callback);
    }
  
    dispose() {}
  
    notifySubscribers(event, msg) {
      this.subscribers.forEach((s) => s(msg));
    }

    // dummy disposable to satisfy interfaces
    dummyDisposable() {
        return { dispose: () => 0 }
    }
}
  


class RendererIpcMessageWriter {
    constructor(mainCtx) {
        this.mainCtx = mainCtx
    }
  
    // events are not implemented for this example
    onError() { this.dummyDisposable() }
    onClose() { this.dummyDisposable() }
  
    write(msg) {
      // send all requests for the language server to the backend
      console.log('Writer: ', msg)
      this.mainCtx.writer.write(msg)
    }
  
    dispose() {
      // nothing to dispose
    }

    // dummy disposable to satisfy interfaces
    dummyDisposable() {
        return { dispose: () => 0 }
    }
}
  
// <-- NOT USABLE CODE -->

// export function launchLanguageServer() {
//     // spawn the language server process of your choice (e.g. TypeScript)
//     const lsPath = path.resolve(
//         `node_modules/.bin/typescript-language-server${process.platform.startsWith("win") ? ".cmd" : ""}`
//     );
//     const lsArgs = ["--stdio"];
//     console.log(`launching typescript language server process with ${lsPath} ${lsArgs.join("\n")}`);
//     const lsProcess = spawn(lsPath, lsArgs);

//     // choose a unique channel name, e.g. by using the PID
//     const ipcChannel = "ls_" + lsProcess.pid;

//     // create reader/writer for I/O streams
//     const reader = new StreamMessageReader(lsProcess.stdout);
//     const writer = new StreamMessageWriter(lsProcess.stdin);

//     // <-- HERE (OLD ELECTRON API) -->
//     // forward everything from process's stdout to the mainWindow's renderer process
//     //   reader.listen((msg) => {
//     //     mainWindow.webContents.send(ipcChannel, msg);
//     //   });

//     // <-- HERE (OLD ELECTRON API) -->
//     // listen to incoming messages and forward them to the language server process
//     //   ipcMain.on(ipcChannel, (event, msg) => {
//     //     writer.write(msg);
//     //   });

//     return { ipcChannel };
// }