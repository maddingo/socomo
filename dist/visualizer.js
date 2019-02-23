/*
 * Style and Layout of the composition diagrams.
 */

/* global cytoscape */
/* exported diagramLayout diagramStyle */

const diagramLayout = {
	name: 'klay', // todo: choose between dagre and klay, check also BRANDES_KOEPF node placement

	// dagre
	rankDir: 'TB',
	nodeSep: 40,
	rankSep: 60,

	// klay
	fit: true,
	klay: {
		direction: 'DOWN',
		thoroughness: 7,
		nodePlacement: 'LINEAR_SEGMENTS',
		spacing: 8,
		inLayerSpacingFactor: 2.0,
		edgeSpacingFactor: 0.2,
		borderSpacing: 10
	}
};

const diagramStyle = cytoscape.stylesheet()

	.selector('node')
	.css({
		'content': 'data(id)',
		'shape': 'rectangle',
		'height': '25px',
		'width': '90px',
		'padding': 0,
		// 'border-color': '#e8e4e8',
		// 'border-width': 1,
		'color': '#000',
		'background-color': '#ede9ed',
		'text-valign': 'center',
		'text-halign': 'center',
		'font-family': 'Lato, Verdana, Geneva, sans-serif',
		'font-size': '10px',
		// 'font-weight': 'bold'
	})

	.selector('edge')
	.css({
		'width': 'mapData(strength, 0, 1, 0.33, 1.00)',
		'line-color': '#dce6d7',
		'line-style': 'solid',
		'target-arrow-shape': 'triangle-backcurve',
		'target-arrow-color': '#dce6d7',
		'target-arrow-fill': 'filled',
		'target-distance-from-node': '0px',
		'curve-style': 'bezier',
		'arrow-scale': 0.6
	})

	.selector('node.highlight')
	.css({
		'background-color': '#aac0f6',
	})

	.selector('node.hushed')
	.css({
		'opacity': '0.25'
	})

	.selector('edge.highlight-ingoer')
	.css({
		'line-color': '#0d8c0d',
		'target-arrow-color': '#0d8c0d',
		'z-index': 1
	})

	.selector('edge.highlight-outgoer')
	.css({
		'line-color': '#1b45ad',
		'target-arrow-color': '#1b45ad',
		'z-index': 1
	})

	.selector('edge.violation')
	.css({
		'line-color': '#ff4444',
		'target-arrow-color': '#ff4444'
	})

	.selector('edge.hushed')
	.css({
		'line-color': '#cfcfcf',
		'target-arrow-color': '#cfcfcf',
		'opacity': '0.2',
		'z-index': 0
	});

/*
 * Drawing and Controls of the composition diagram.
 */

/* global _ cytoscape diagramStyle diagramLayout */
/* exported drawDiagram */

function drawDiagram(diagramContainer, level) {

	const nodes = _.map(level.components, (props, componentName) => {
		return {data: {id: componentName}}; // cytoscape node format
	});

	const edges = _.map(level.dependencies, (props, dependencyName) => {
		const [from, to] = dependencyName.split(' -> ');
		return {data: {source: from, target: to, strength: props.strength}}; // cytoscape edge format
	});

	/* todo: in future we will support multiple diagrams per level
	var diagram = level.diagrams[0];
	var diagramElements = {
		nodes: _.filter(nodes, function (node) {
			return !diagram.packages || _.includes(diagram.packages, node.data.id)
		}),
		edges: _.filter(edges, function (edge) {
			return !diagram.packages || _.includes(diagram.packages, edge.data.source) && _.includes(diagram.packages, edge.data.target);
		})
	}; */
	const diagramElements = {nodes, edges};

	// draw the diagram
	const cy = cytoscape({
		container: diagramContainer,
		style: diagramStyle,
		layout: diagramLayout,
		boxSelectionEnabled: false,
		autounselectify: true,
		wheelSensitivity: 0.3,
		maxZoom: 1.5,
		elements: diagramElements
	});

	// workaround for google font not used initially by the browser for node labels, only when the graph is redrawn
	// todo: replace this diagram refresh with "font face observer", https://filamentgroup.com/lab/font-events.html
	diagramContainer.style.visibility = 'hidden';
	setTimeout(function () {
		cy.elements().addClass('dummy');
		cy.elements().removeClass('dummy');
		diagramContainer.style.visibility = 'visible';
	}, 10);

	// mark upwards dependencies as violations
	cy.edges().filter( function (edge) {
		return edge.target().position('y') < edge.source().position('y');
	}).addClass('violation');

	// highlighting on hover
	cy.on('mouseover', 'node', function(e){
		const node = e.target;
		cy.elements().subtract(node.outgoers()).subtract(node.incomers()).subtract(node).addClass('hushed');
		node.addClass('highlight');
		node.outgoers().addClass('highlight-outgoer');
		node.incomers().addClass('highlight-ingoer');
	});
	cy.on('mouseout', 'node', function(e){
		const node = e.target;
		cy.elements().removeClass('hushed');
		node.removeClass('highlight');
		node.outgoers().removeClass('highlight-outgoer');
		node.incomers().removeClass('highlight-ingoer');
	});

}

/*
 * Entry point for the visualizer single-page app.
 * The visualizer html skeleton will call the socomo() function passing
 * the composition of the module to be visualized in user's browser.
 */

/* global _ drawDiagram */
/* exported socomo */

function socomo(moduleName, composition) {

	// todo: currently we show only one diagram for the first level
	const levelName = _.keys(composition)[0];
	const level = _.values(composition)[0];

	document.body.innerHTML = `
	<div id="header-container">
		<h1>${moduleName} &nbsp;&#x276d;&nbsp; <code>${levelName}</code></h1>
	</div>
	<div id="diagram-container">
		<div id="main-diagram"></div>
	</div>`;

	drawDiagram(document.getElementById('main-diagram'), level);
}
