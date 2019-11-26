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
	node.ripple_map = generate_ripple_map(settings);

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

function update(node: Flag, elapsed_time: number){

	const ripple_map: Array<number> = shift_ripplemap(node.ripple_map, elapsed_time);
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

		segment.setAttribute('style', 'transform: rotateY('+(active_rotation * -25)+'deg); background-size-x:'+((node.segments.length / 100) * i)+'%');

		if(rotation > 0){
			lighting.className = 'flag-segment-overlay flag-segment-light';
		} else if(rotation < 0){
			lighting.className = 'flag-segment-overlay flag-segment-dark';
		} else {
			lighting.className = 'flag-segment-overlay flag-segment-base';
		}
		lighting.setAttribute('style', 'opacity: '+Math.abs(0.3 * (rotation)));

	}

}

function generate_ripple_map(settings: Settings): Array<number> {

	const arr: Array<number> = [];
	const frequency: number = settings.segments / 4;

	let up = true;
	for(let i: number = 1; i <= settings.segments; i++){
		let dist = i % frequency;
		if(dist === 0){
			up = !up;
		}
		if(!up){
			dist = frequency - dist;
		}
		dist = (1 / frequency) * dist;
		arr.push(
			(ease(dist) * 3) - 1.5
		);
	}

	return arr;
}

function shift_ripplemap(ripple_map: Array<number>, elapsed_time: number): Array<number>{
	ripple_map.unshift(ripple_map.pop())
	return ripple_map;
}

function ease(t: number): number { 
	return t<.5 ? 2*t*t : -1+(4-2*t)*t
}

function animate(nodes: Array<Flag>, time: number){
	const last_update = Date.now();
	nodes.map(node => update(node, time));
	window.setTimeout(function(){
		window.requestAnimationFrame(function(){
				animate(nodes, Date.now() - last_update);
		});
	}, 25);
}

function init(selector: string): Array<Flag> {
	const nodes: Array<Flag> = Array.prototype.slice.call(document.querySelectorAll(selector));
	nodes.map(node => load(node));
	return nodes;
}

animate(init("[flag]"), 0);
