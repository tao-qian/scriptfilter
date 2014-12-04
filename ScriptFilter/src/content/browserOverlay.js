/**
 * scriptFilterToolbar namespace.
 */
var toggleBool = false;

if ("undefined" == typeof(scriptFilterTool)) {
  var scriptFilterTool = {};
};

/**
 * Controls the browser overlay for the Filter Script extension.
 */
scriptFilterTool.BrowserOverlay = {
  
  //Toggle Switch for the toolbar Disable
  toggleButton: function(aEvent){
    if (aEvent.target.hasAttribute("checked")) {
      toggleBool = !toggleBool;
      aEvent.target.setAttribute("checked",toggleBool);
    }
  }
};


  //Listerner when something new is loaded onto the window
  window.addEventListener("load", function load(event){
      window.removeEventListener("load", load, false); //remove listener, no longer needed
      myExtension.init();
  },false);
  
  var myExtension = {
    init: function() {
      var appcontent = document.getElementById("appcontent");   // browser
      if(appcontent){
        appcontent.addEventListener("DOMContentLoaded", myExtension.onPageLoad, true);
      }
      var messagepane = document.getElementById("messagepane"); // mail
      if(messagepane){
        messagepane.addEventListener("load", function(event) { myExtension.onPageLoad(event); }, true);
      }
    },
  
    onPageLoad: function(aEvent) {
      if (!toggleBool) {
      var doc = aEvent.originalTarget; // doc is document that triggered "onload" event
      // do something with the loaded page.
      // doc.location is a Location object (see below for a link).
      // You can use it to make your code executed on certain pages only.
      if(doc.location.href.search("forum") > -1)
      alert("a forum page is loaded");
      var test = doc.location.href;
      window.confirm(test);
      }
      // add event listener for page unload 
      aEvent.originalTarget.defaultView.addEventListener("unload", function(event){ myExtension.onPageUnload(event); }, true);
    },
  
    onPageUnload: function(aEvent) {
    }
  };