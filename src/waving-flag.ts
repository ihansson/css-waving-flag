
function load(node: Node){
	console.log(node)
}

function init() {
	document.querySelectorAll('[flag]').forEach(node => {
		load(node)
	})
}

init();

module.exports = {};