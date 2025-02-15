const socket = io("http://127.0.0.1:2000")


socket.emit("join_document",documentId)


quill.on("text-change",(delta, oldDelta, source) => {
    if(source === "user"){
        socket.emit("emit_delta",delta,documentId)
    }
})


socket.on("brodcast_delta",delta => {
    quill.updateContents(delta)
})