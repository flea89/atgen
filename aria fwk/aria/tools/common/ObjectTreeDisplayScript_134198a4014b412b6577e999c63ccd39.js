/*
 * Copyright Amadeus
 */
Aria.tplScriptDefinition({$classpath:"aria.tools.common.ObjectTreeDisplayScript",$prototype:{$dataReady:function(){this.data.showDepth&&this._showDepth(this.data.content,this.data.showDepth,0)},_showDepth:function(c,e,b){if(c&&b<e){c["view:ariaDebug:showOpen"+b]=true;for(var a in c)c.hasOwnProperty(a)&&this._showDepth(c[a],e,b+1)}},nodeClick:function(c,e){var b=e.element,a="view:ariaDebug:showOpen"+e.depth;b[a]=b[a]?false:true;this.$refresh()},filterTypes:function(c){var e={meta:{arrays:[],objects:[],
strings:[],numbers:[],instances:[],booleans:[],others:[]},data:{arrays:[],objects:[],strings:[],numbers:[],instances:[],booleans:[],others:[]}},b=aria.utils.Type,a;for(a in c)if(c.hasOwnProperty(a)&&!this.$json.isMetadata(a)&&a.indexOf("view:ariaDebug:showOpen")!=0){var f=c[a],d;d=a.indexOf(":")==-1?e.data:e.meta;d=b.isArray(f)?d.arrays:b.isObject(f)?d.objects:b.isString(f)?d.strings:b.isNumber(f)?d.numbers:b.isBoolean(f)?d.booleans:f&&f.$classpath?d.instances:d.others;d.push(a)}return e}}});