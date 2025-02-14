const socket = io("https://collab-doc-x5xr.onrender.com")


socket.emit("join_document",documentId)


quill.on("text-change",(delta, oldDelta, source) => {
    if(source === "user"){
        socket.emit("emit_delta",delta,documentId)
    }
})


socket.on("brodcast_delta",delta => {
    quill.updateContents(delta)
})