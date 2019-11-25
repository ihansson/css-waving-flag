import extract_settings from 'Helpers/extract_settings'

function load(node: Element){
	console.log(node)
	console.log(extract_settings(node.getAttribute('flag')))
}

function init(selector: string) : Array<Element> {
	const nodes: Array<Element> = Array.prototype.slice.call([document.querySelectorAll(selector)]);
	nodes.map(node => load(node));
	return nodes;
}

init('[flag]');
