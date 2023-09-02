import {
	deserializePosition,
	getDocument,
	getRangeDocument,
	isOrIsAncestorOf,
	serializePosition,
} from "./utils";

const deserializeRegex = /^([^,]+),([^,\{]+)(\{([^}]+)\})?$/;
export const serializeRange = (range: Range, rootNode?: Node) => {
	const root = rootNode || getRangeDocument(range).documentElement;
	if (!isOrIsAncestorOf(root, range.commonAncestorContainer)) {
		throw new Error(
			`serializeRange(): range ${String(
				range,
			)} is not wholly contained within specified root node ${String(
				rootNode,
			)}`,
		);
	}
	const serialized = `${serializePosition(
		range.startContainer,
		range.startOffset,
		root,
	)},${serializePosition(range.endContainer, range.endOffset, root)}`;

	return serialized;
};

export const deserializeRange = (
	serialized: string,
	rootNode?: Node,
	doc?: Document,
) => {
	let document;
	let root;
	if (rootNode) {
		document = doc || getDocument(rootNode);
		root = rootNode;
	} else {
		document = doc || window.document;
		root = document.documentElement;
	}
	const result = deserializeRegex.exec(serialized) as RegExpExecArray;
	const start = deserializePosition(result[1], rootNode, doc);
	const end = deserializePosition(result[2], rootNode, doc);
	const range = document.createRange();
	range.setStart(start.node, start.offset);
	range.setEnd(end.node, end.offset);
	return range;
};
