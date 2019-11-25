window["waving-flag"] =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./src/helpers/extract_settings.ts
function extract_settings(str) {
    var settings = {};
    if (!str)
        return settings;
    str.split(';').forEach(function (setting) {
        setting = setting;
        var arr = setting.trim().split(/:(.+)/);
        if (!arr[0])
            return;
        var key = arr[0].trim();
        var value = arr[1] ? arr[1].trim() : true;
        if (['segments'].indexOf(key) !== -1)
            value = parseInt(value);
        if (['proportions'].indexOf(key) !== -1)
            value = value.split(':').map(function (_value) { return parseInt(_value); });
        settings[key] = arr[1] ? value : true;
    });
    return settings;
}

// CONCATENATED MODULE: ./src/waving-flag.ts


function load(node) {
    // Extract settings from flag property
    var settings = extract_settings(node.getAttribute('flag'));
    // Set root attributes
    node.className = 'flag';
    node.setAttribute("style", "padding-bottom: " + ((settings.proportions[1] / settings.proportions[0]) * 100) + "%;");
    // Create segments
    var segments = create_segments(settings);
    node.appendChild(segments);
    node.segments = cache_segments(node);
    node.ripple_map = new Array(settings.segments).fill(0);
    node.ripples = [{ position: 0, width: 12, start_life: 500, life: 500 }];
}
function create_segments(settings) {
    // Create wrapping el
    var wrapper = document.createElement('div');
    wrapper.className = 'flag-segment-wrapper';
    wrapper.setAttribute("style", "width: " + (100 / settings.segments) + "%");
    // Create each segment nested inside the previous
    var previous_segment = wrapper;
    for (var i = 0; i < settings.segments; i++) {
        // Build segment element
        var segment = document.createElement('div');
        segment.className = 'flag-segment';
        segment.appendChild(document.createElement('div')); // Lighting element 
        // Append to previous segment and set current to previous
        previous_segment.appendChild(segment);
        previous_segment = segment;
    }
    return wrapper;
}
function cache_segments(node) {
    return Array.prototype.slice.call(node.querySelectorAll('.flag-segment'));
}
function update(node, elapsed_time) {
    node.ripples = node.ripples.map(function (ripple) { ripple.life -= elapsed_time; return ripple; });
    var ripple_map = generate_ripple_map(node.ripple_map, node.ripples, elapsed_time);
    node.ripple_map = ripple_map;
    var current_rotation = 0;
    var previous_rotation = 0;
    for (var i = 0; i < node.segments.length; i++) {
        var segment = node.segments[i];
        var lighting = segment.firstChild;
        var rotation = ripple_map[i] - current_rotation;
        var active_rotation = rotation - previous_rotation;
        current_rotation += rotation;
        previous_rotation = rotation;
        segment.setAttribute('style', 'transform: rotateY(' + (active_rotation * -25) + 'deg);');
        if (rotation > 0) {
            lighting.className = 'flag-segment-overlay flag-segment-light';
        }
        else if (rotation < 0) {
            lighting.className = 'flag-segment-overlay flag-segment-dark';
        }
        else {
            lighting.className = 'flag-segment-overlay flag-segment-base';
        }
        lighting.setAttribute('style', 'opacity: ' + Math.abs(0.3 * (rotation)));
    }
}
function generate_ripple_map(ripple_map, ripples, elapsed_time) {
    var time_mod = elapsed_time === 0 ? 0 : 1 / elapsed_time;
    ripples.map(function (ripple) {
        var completeness = 1 - ((1 / ripple.start_life) * ripple.life);
        for (var i = 0; i < ripple_map.length; i++) {
            var distance = Math.abs(ripple.position - i);
            if (distance <= ripple.width) {
                ripple_map[i] += (ease((1 / ripple.width) * (ripple.width - distance)) * 4) * time_mod;
            }
        }
        ripple.position = (ripple_map.length * completeness).toFixed(0);
        if (ripple.position > ripple_map.length + ripple.width) {
            ripple.position = 0;
            ripple.life = ripple.start_life;
        }
    });
    ripple_map = ripple_map.map(function (point) {
        if (point > 0)
            point -= time_mod * 2;
        if (point < 0)
            point += time_mod * 2;
        return point;
    });
    return ripple_map;
}
function ease(t) {
    return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
}
function animate(nodes, time) {
    var last_update = Date.now();
    nodes.map(function (node) { return update(node, time); });
    window.requestAnimationFrame(function () {
        animate(nodes, Date.now() - last_update);
    });
}
function init(selector) {
    var nodes = Array.prototype.slice.call(document.querySelectorAll(selector));
    nodes.map(function (node) { return load(node); });
    return nodes;
}
animate(init("[flag]"), 0);


/***/ })
/******/ ]);
//# sourceMappingURL=waving-flag.js.map