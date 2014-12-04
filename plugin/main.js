Cu.import("resource://gre/modules/XPCOMUtils.jsm");
Cu.import("resource://gre/modules/Services.jsm");

let policy =
{
	classDescription: "Script Filter",
	classID: Components.ID("{9FF5D57A-2206-4079-934B-3B66B16A5B38}"),
	contractID: "@depauw.edu/scriptfilter;1",
	xpcom_categories: ["content-policy"],

	init: function()
	{
		let registrar = Components.manager.QueryInterface(Ci.nsIComponentRegistrar);
		registrar.registerFactory(this.classID, this.classDescription, this.contractID, this);

		let catMan = Cc["@mozilla.org/categorymanager;1"].getService(Ci.nsICategoryManager);
		for each (let category in this.xpcom_categories)
			catMan.addCategoryEntry(category, this.contractID, this.contractID, false, true);

		onShutdown.add((function()
		{
			for each (let category in this.xpcom_categories)
				catMan.deleteCategoryEntry(category, this.contractID, false);

			// This needs to run asynchronously, see bug 753687
			Services.tm.currentThread.dispatch(function()
			{
				registrar.unregisterFactory(this.classID, this);
			}.bind(this), Ci.nsIEventTarget.DISPATCH_NORMAL);
		}).bind(this));
	},

	// nsIContentPolicy interface implementation
	shouldLoad: function(contentType, contentLocation, requestOrigin, node, mimeTypeGuess, extra)
	{
		console.log("shouldLoad: " + contentType + " " +
													(contentLocation ? contentLocation.spec : "null") + " " +
													(requestOrigin ? requestOrigin.spec : "null") + " " +
													node + " " +
													mimeTypeGuess + "\n");
		// Blocking scripts
		if (contentType === 2) {
			console.log("Script is blocked");
            return Ci.nsIContentPolicy.REJECT;
        }
		return Ci.nsIContentPolicy.ACCEPT;
	},

	shouldProcess: function(contentType, contentLocation, requestOrigin, node, mimeTypeGuess, extra)
	{
		console.log("shouldProcess: " + contentType + " " +
														(contentLocation ? contentLocation.spec : "null") + " " +
														(requestOrigin ? requestOrigin.spec : "null") + " " +
														node + " " +
														mimeTypeGuess + "\n");
		return Ci.nsIContentPolicy.ACCEPT;
	},

	// nsIFactory interface implementation
	createInstance: function(outer, iid)
	{
		if (outer)
			throw Cr.NS_ERROR_NO_AGGREGATION;
		return this.QueryInterface(iid);
	},

	// nsISupports interface implementation
	QueryInterface: XPCOMUtils.generateQI([Ci.nsIContentPolicy, Ci.nsIFactory])
};

policy.init();
