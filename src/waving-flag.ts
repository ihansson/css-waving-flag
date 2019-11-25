"use strict";

import Settings from "Interfaces/settings";

import extract_settings from "Helpers/extract_settings";

function load(node: Element) {

	// Extract settings from flag property
	const settings: Settings = extract_settings(node.getAttribute('flag'));

	// Set root attributes
	node.className = 'flag';
	node.setAttribute("style", "padding-bottom: "+((settings.proportions[1] / settings.proportions[0]) * 100)+"%;");

	// Create segments
	const segments: Element = create_segments(settings);
	node.appendChild(segments);

}

function create_segments(settings: Settings): Element {
	// Create wrapping el
	const wrapper = document.createElement('div');
	wrapper.className = 'flag-segment-wrapper';
	wrapper.setAttribute("style", "width: "+(100 / settings.segments)+"%");

	// Create each segment nested inside the previous
	let previous_segment: Element = wrapper;
	let segment: Element;

	// @todo MAKE THIS SMART
	const ripple_map: Array<number> = [0,0.5,1,0.5,0,-0.5,-1,-0.5,0,0.5,1];

	for(let i: number = 0; i < settings.segments; i++){

		// Build segment element
		segment = document.createElement('div');
		segment.className = 'flag-segment';


		

		// @todo MOVE THIS TO OTHER FUNC



		// @todo MOVE THIS TO OTHER FUNC



		// Append to previous segment and set current to previous
		previous_segment.appendChild(segment);
		previous_segment = segment;
	}

	return wrapper;
}

function init(selector: string): Array<Element> {
	const nodes: Array<Element> = Array.prototype.slice.call(document.querySelectorAll(selector));
	nodes.map(node => load(node));
	return nodes;
}

init("[flag]");
