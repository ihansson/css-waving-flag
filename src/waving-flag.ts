"use strict";

import extract_settings from "Helpers/extract_settings";

interface Settings {
	segments: number
}

function load(node: Element) {
	const settings: Settings = extract_settings(node.getAttribute("flag"));
	const segments: Element = create_segments(settings);
}

function create_segments(settings: Settings) {
	const wrapper = document.createElement('div');
	for(let i: number = 0; i < settings.segments; i++){
		console.log(i)
	}
	return wrapper;
}

function init(selector: string): Array<Element> {
	const nodes: Array<Element> = Array.prototype.slice.call(document.querySelectorAll(selector));
	nodes.map(node => load(node));
	return nodes;
}

init("[flag]");
