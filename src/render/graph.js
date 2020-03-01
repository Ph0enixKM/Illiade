let container = document.querySelector('#test')


const { mxClient, mxEvent, mxGraph, mxRubberband, mxUtils, mxEditor } = require("mxgraph")({
    mxImageBasePath: '../../node_modules/mxgraph/javascript/src/images',
    mxBasePath: '../../node_modules/mxgraph/javascript/src',
    mxEditorBasePath: '../../node_modules/mxgraph/javascript/src/editor',
})


// use editor to do stuff with importing XML

if (!mxClient.isBrowserSupported())
{
    // Displays an error message if the browser is not supported.
    mxUtils.error('Browser is not supported!', 200, false);
}
else
{
    // Disables the built-in context menu
    mxEvent.disableContextMenu(container);
    
    // Creates the graph inside the given container
    var graph = new mxGraph(container);
    
    // Enables rubberband selection
    new mxRubberband(graph);
    
    // Gets the default parent for inserting new cells. This
    // is normally the first child of the root (ie. layer 0).
    var parent = graph.getDefaultParent();


    let file = fs.readFileSync(path.join(__dirname,'../../test.xml'), 'utf-8')
    
    // Adds cells to the model in a single step
    graph.getModel().beginUpdate();
    try
    {
        var v1 = graph.insertVertex(parent, null, 'Hello,', 20, 20, 80, 30);
        var v2 = graph.insertVertex(parent, null, 'World!', 200, 150, 80, 30);
        var e1 = graph.insertEdge(parent, null, '', v1, v2);
    }
    finally
    {
        // Updates the display
        graph.getModel().endUpdate();
    }
}