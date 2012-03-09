/*
 * Copyright Amadeus
 */
Aria.classDefinition({$classpath:"aria.utils.Bridge",$dependencies:["aria.utils.AriaWindow"],$events:{forwardEvent:{description:"Wrapper for an event to forward",properties:{event:"The forwarded event"}}},$constructor:function(){this._subWindow=null;this.isOpen=false;this._rootTplCtxtRef=this._moduleCtrlRef=this._config=null;this._bridgeAttachedInterval=false},$destructor:function(){this.close();this._subWindow=null},$prototype:{open:function(a,f){if(!this._subWindow){f||(f="width=1024, height=800");
this._subWindow=Aria.$frameworkWindow.open("",a.title+(""+(new Date).getTime()),f);if(this._subWindow!=null){for(var h=Aria.$frameworkWindow.document.getElementsByTagName("script"),c=Aria.rootFolderPath,b,d,g=0,i=h.length;g<i;g++){b=h[g];if(b.attributes&&b.attributes.src){b=b.attributes.src.nodeValue;if((b=/aria\/aria-templates-([^\/]+)\.js/.exec(b))&&b.length>1){d=b[1];break}}}if(c.match(/dev\/$/))c=c.substring(0,c.length-4);if(!d)return false;this._subWindow.document.write(['<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\n',
"<html><head><title>"+a.title+"</title>","<script type='text/javascript'>Aria = { _xxDebug: true, rootFolderPath : '"+c+"' };<\/script>","<script language='JavaScript' src='",c+"aria/aria-templates-"+d+".js","'><\/script><script language='JavaScript' src='",c+"css/atdefskin-"+d+".js","'><\/script></head><body onUnload='window.__atBridge&&__atBridge.close()' style='overflow:hidden;'><div id='main'><h3 id='main_title' style='text-align:center;margin-top:200px;'>Starting.</h3></div><script type='text/javascript'>var appStart = function () {if (window.Aria && window.Aria.loadTemplate && window.__atBridge) { window.__atBridge.moduleStart.call(window.__atBridge);}else { document.getElementById('main_title').innerHTML += '.'; setTimeout(appStart, 500);}}; appStart();<\/script></body></html>"].join(""));
this._subWindow.document.close();var e=this;this._bridgeAttachedInterval=setInterval(function(){if(e._subWindow)e._subWindow.__atBridge=e;else clearInterval(e._bridgeAttachedInterval)},2E3);this._config=a;aria.utils.AriaWindow.attachWindow();aria.utils.AriaWindow.$on({unloadWindow:this._onMainWindowUnload,scope:this})}}},_onMainWindowUnload:function(){this.close()},moduleStart:function(){var a=this._subWindow.Aria;clearInterval(this._bridgeAttachedInterval);a.setRootDim({width:{min:16},height:{min:16}});
a.load({classes:["aria.templates.ModuleCtrlFactory"],oncomplete:{fn:this._templatesReady,scope:this}})},_templatesReady:function(){this._subWindow.aria.templates.ModuleCtrlFactory.createModuleCtrl({classpath:this._config.moduleCtrlClasspath,autoDispose:false,initArgs:{bridge:this}},{fn:this._moduleLoaded,scope:this},false)},_moduleLoaded:function(a){a=a.moduleCtrlPrivate;this._subWindow.Aria.loadTemplate({classpath:this._config.displayClasspath,div:"main",moduleCtrl:a,width:{min:16},height:{min:16}},
{fn:this._displayLoaded,scope:this});this._moduleCtrlRef=a;this.isOpen=true},_displayLoaded:function(a){this._rootTplCtxtRef=a.templateCtxt},close:function(){if(this.isOpen){if(this._moduleCtrlRef){this._moduleCtrlRef.$dispose();this._moduleCtrlRef=null}if(this._rootTplCtxtRef){this._rootTplCtxtRef.$dispose();this._rootTplCtxtRef=null}this._subWindow.close();this._subWindow=null;aria.utils.AriaWindow.$unregisterListeners(this);aria.utils.AriaWindow.detachWindow();this.isOpen=false}},getDocument:function(){return Aria.$window.document},
getAriaPackage:function(){return aria},getAria:function(){return Aria}}});