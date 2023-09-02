const isCharacterDataNode = (node: Node) => {
	const t = node.nodeType;
	return t === 3 || t === 4 || t === 8; // Text, CDataSection or Comment
};

export const getRangeDocument = (range: Range) => {
	return getDocument(range.startContainer);
};

const isAncestorOf = (
	ancestor: Node,
	descendant: Node,
	selfIsAncestor: boolean,
) => {
	let n = selfIsAncestor ? descendant : descendant.parentNode;
	while (n) {
		if (n === ancestor) {
			return true;
		} else {
			n = n.parentNode;
		}
	}
	return false;
};

export const isOrIsAncestorOf = (ancestor: Node, descendant: Node) => {
	return isAncestorOf(ancestor, descendant, true);
};

function inspectNode(node: Node) {
	if (!node) {
		return "[No node]";
	}
	if (isCharacterDataNode(node)) {
		return "[Broken node]";
	}
	if (node.nodeType === 1) {
		return `<${node.nodeName}>[index:${getNodeIndex(node)},length:${
			node.childNodes.length
		}][${String(node).slice(0, 25)}]`;
	}
	return node.nodeName;
}

export const getDocument = (node: Node): Document => {
	if (node.nodeType === 9) {
		return node as Document;
	} else if (typeof node.ownerDocument !== "undefined") {
		return node.ownerDocument as Document;
	} else if (node.parentNode) {
		return getDocument(node.parentNode);
	}
	throw new Error("getDocument: no document found for node");
};

const getNodeIndex = (node: Node) => {
	let i = 0;
	let currentNode = node;

	while (currentNode.previousSibling !== null) {
		currentNode = currentNode.previousSibling;
		i++;
	}

	return i;
};

export const serializePosition = (
	node: Node,
	offset: number,
	rootNode?: Node,
) => {
	const pathParts = [];
	let n = node;
	const root = rootNode || getDocument(node).documentElement;
	while (n && n !== root) {
		pathParts.push(getNodeIndex(n));
		n = n.parentNode as Node;
	}
	return `${pathParts.join("/")}:${offset}`;
};

export const deserializePosition = (
	serializedPosition: string,
	rootNode?: Node,
	doc?: Document,
) => {
	const root = rootNode || (doc || document).documentElement;
	const parts = serializedPosition.split(":");
	const nodeIndices = parts[0] ? parts[0].split("/") : [];
	let node = root;
	let i = nodeIndices.length;
	let nodeIndex = 0;

	while (i--) {
		nodeIndex = parseInt(nodeIndices[i], 10);
		if (nodeIndex < node.childNodes.length) {
			node = node.childNodes[nodeIndex];
		} else {
			throw new Error(
				`deserializePosition() failed: node ${inspectNode(
					node,
				)} has no child with index ${nodeIndex}, ${i}`,
			);
		}
	}

	return {
		node,
		offset: parseInt(parts[1], 10),
	};
};
