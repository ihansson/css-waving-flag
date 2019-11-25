"use strict";

import Settings from "Interfaces/settings";
import Flag from "Interfaces/flag";

import extract_settings from "Helpers/extract_settings";

function load(node: Flag) {

	// Extract settings from flag property
	const settings: Settings = extract_settings(node.getAttribute('flag'));

	// Set root attributes
	node.className = 'flag';
	node.setAttribute("style", "padding-bottom: "+((settings.proportions[1] / settings.proportions[0]) * 100)+"%;");

	// Create segments
	const segments: Element = create_segments(settings);
	node.appendChild(segments);

	node.segments = cache_segments(node);
	node.ripple_map = [0,0.4,0.9,1.6,2.35,2.4,2,1.2,0.5,-0.1,-0.5,-0.3,-0.9,-2,-2.1,-1.5,-0.7,-0.2,0];

	update(node)

}

function create_segments(settings: Settings): Element {
	// Create wrapping el
	const wrapper = document.createElement('div');
	wrapper.className = 'flag-segment-wrapper';
	wrapper.setAttribute("style", "width: "+(100 / settings.segments)+"%");

	// Create each segment nested inside the previous
	let previous_segment: Element = wrapper;

	for(let i: number = 0; i < settings.segments; i++){

		// Build segment element
		let segment: Element = document.createElement('div');
		segment.className = 'flag-segment';
		segment.appendChild(document.createElement('div')); // Lighting element 
	
		// Append to previous segment and set current to previous
		previous_segment.appendChild(segment);
		previous_segment = segment;
	}

	return wrapper;
}

function cache_segments(node: Flag): Array<Element> {
	return Array.prototype.slice.call(node.querySelectorAll('.flag-segment')); 
}

function update(node: Flag){

	const ripple_map: Array<number> = generate_ripple_map(node.ripple_map);
	node.ripple_map = ripple_map;

	let current_rotation: number = 0;
	let previous_rotation: number = 0;

	for(let i: number = 0; i < node.segments.length; i++){

		let segment: Element = node.segments[i];
		let lighting: Element = <Element>segment.firstChild;

		let rotation: number =  ripple_map[i] - current_rotation;
		let active_rotation: number = rotation - previous_rotation;

		current_rotation += rotation;
		previous_rotation = rotation;

		segment.setAttribute('style', 'transform: rotateY('+(active_rotation * -25)+'deg);');

		if(rotation > 0){
			lighting.className = 'flag-segment-overlay flag-segment-light';
		} else if(rotation < 0){
			lighting.className = 'flag-segment-overlay flag-segment-dark';
		} else {
			lighting.className = 'flag-segment-overlay flag-segment-base';
		}
		lighting.setAttribute('style', 'opacity: '+Math.abs(0.4 * (rotation)));

	}

}

function generate_ripple_map(ripple_map: Array<number>): Array<number>{
	const last = ripple_map.pop();
	ripple_map.unshift(last);
	return ripple_map;
}

function animate(nodes: Array<Flag>){
	nodes.map(node => update(node));
	window.requestAnimationFrame(function(){
		animate(nodes);
	});
}

function init(selector: string): Array<Flag> {
	const nodes: Array<Flag> = Array.prototype.slice.call(document.querySelectorAll(selector));
	nodes.map(node => load(node));
	return nodes;
}

animate(init("[flag]"));
