# rangy-serializer

A library for serializing and deserializing browser `Range` objects.

```javascript
const range = window.getSelection().getRangeAt(0);
const serialized = serializeRange(range);
const deserialized = deserializeRange(serialized);

// by default serialization is done relative to the top level Document object
// can also serialize and deserialize relative to a specific node
const serialized2 = serializeRange(range, document.getElementById("main"));
const deserialized2 = deserializeRange(serialized2, document.getElementById("main"));
```

The code is based on the [rangy](https://timdown/rangy) library (specifically the [`rangy/lib/rangy-serializer`](https://github.com/timdown/rangy/blob/master/lib/rangy-serializer.js) module). This library refactors it with modern ES syntax and TypeScript.