const Cc = Components.classes;
const Ci = Components.interfaces;
const Cr = Components.results;
const Cu = Components.utils;

Cu.import("resource://gre/modules/Services.jsm");

let addonData = null;

function install(params, reason) {}
function uninstall(params, reason) {}

function startup(params, reason)
{
	addonData = params;

	require("main");
}

function shutdown(params, reason)
{
	onShutdown.done = true;
	for (let i = shutdownHandlers.length - 1; i >= 0; i --)
	{
		try
		{
			shutdownHandlers[i]();
		}
		catch (e)
		{
			Cu.reportError(e);
		}
	}
}
let shutdownHandlers = [];
let onShutdown =
{
	done: false,
	add: function(handler)
	{
		if (shutdownHandlers.indexOf(handler) < 0)
			shutdownHandlers.push(handler);
	},
	remove: function(handler)
	{
		let index = shutdownHandlers.indexOf(handler);
		if (index >= 0)
			shutdownHandlers.splice(index, 1);
	}
};

function require(module)
{
	let scopes = require.scopes;
	if (!(module in scopes))
	{
			scopes[module] = {
				Cc: Cc,
				Ci: Ci,
				Cr: Cr,
				Cu: Cu,
				require: require,
				
				onShutdown: onShutdown,
				
				exports: {}};
			Services.scriptloader.loadSubScript(addonData.resourceURI.spec + module + ".js", scopes[module]);
	}
	return scopes[module].exports;
}
require.scopes = {__proto__: null};