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
	node.ripple_map = new Array(settings.segments).fill(0);
	node.ripples = [{position: 0, width: 12, start_life: 500, life: 500}];

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

	node.ripples = node.ripples.map(ripple => { ripple.life -= elapsed_time; return ripple })

	const ripple_map: Array<number> = generate_ripple_map(node.ripple_map, node.ripples, elapsed_time);
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
		lighting.setAttribute('style', 'opacity: '+Math.abs(0.3 * (rotation)));

	}

}

function generate_ripple_map(ripple_map: Array<number>, ripples: Array<any>, elapsed_time: number): Array<number>{

	let time_mod = elapsed_time === 0 ? 0 : 1 / elapsed_time;

	ripples.map(ripple => {
		const completeness: number = 1 - ((1 / ripple.start_life) * ripple.life);
		for(let i: number = 0; i < ripple_map.length; i++){
			let distance = Math.abs(ripple.position - i);
			if(distance <= ripple.width){
				ripple_map[i] += (ease((1 / ripple.width) * (ripple.width - distance)) * 4) * time_mod;
			}
		}
		ripple.position = (ripple_map.length * completeness).toFixed(0);
		if(ripple.position > ripple_map.length + ripple.width){
			ripple.position = 0;
			ripple.life = ripple.start_life;
		}
	})

	ripple_map = ripple_map.map(point => {
		if(point > 0) point -= time_mod * 2;
		if(point < 0) point += time_mod * 2;
		return point;
	})

	return ripple_map;
}

function ease(t: number): number { 
	return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t
}

function animate(nodes: Array<Flag>, time: number){
	const last_update = Date.now();
	nodes.map(node => update(node, time));
	window.requestAnimationFrame(function(){
		animate(nodes, Date.now() - last_update);
	});
}

function init(selector: string): Array<Flag> {
	const nodes: Array<Flag> = Array.prototype.slice.call(document.querySelectorAll(selector));
	nodes.map(node => load(node));
	return nodes;
}

animate(init("[flag]"), 0);
