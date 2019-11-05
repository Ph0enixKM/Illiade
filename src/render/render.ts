const THREE = require('three')
global["3D"] = THREE

import { remote } from "electron"


import Debug from '../render/debug'
import Header from '../render/header'
import Flowchart from '../render/flowchart'

window.onload = () => {
    new Debug(true)
    new Header(remote)
    new Flowchart()
}
