/**
*  Ajax Autocomplete for jQuery, version 1.1.3
*  (c) 2010 Tomas Kirda
*
*  Ajax Autocomplete for jQuery is freely distributable under the terms of an MIT-style license.
*  For details, see the web site: http://www.devbridge.com/projects/autocomplete/jquery/
*
*  Last Review: 04/19/2010
*/

/*jslint onevar: true, evil: true, nomen: true, eqeqeq: true, bitwise: true, regexp: true, newcap: true, immed: true */
/*global window: true, document: true, clearInterval: true, setInterval: true, jQuery: true */                        
              
(function($) {

  var reEscape = new RegExp('(\\' + ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\'].join('|\\') + ')', 'g');

  function fnFormatResult(value, data, currentValue) {
    var pattern = '(' + currentValue.replace(reEscape, '\\$1') + ')';
    return value.replace(new RegExp(pattern, 'gi'), '<strong>$1<\/strong>');
  }

  function Autocomplete(el, options) {
    this.el = $(el);
    this.el.attr('autocomplete', 'off');
    this.suggestions = [];
    this.data = [];
    this.badQueries = [];
    this.selectedIndex = -1;
    this.currentValue = this.el.val();
    this.intervalId = 0;
    this.cachedResponse = [];
    this.onChangeInterval = null;
    this.ignoreValueChange = false;
    this.serviceUrl = options.serviceUrl;
    this.sWebMapRef = options.sWebMapRef;
    this.isLocal = false;
    this.options = {
      autoSubmit: false,
      minChars: 1,
      maxHeight: 300,
      deferRequestBy: 0,
      width: 0,
      highlight: true,
      params: {},
      fnFormatResult: fnFormatResult,
      delimiter: null,
      zIndex: 9999
    };
    this.initialize();
    this.setOptions(options);
  }
  
  $.fn.autocomplete = function(options) {
    return new Autocomplete(this.get(0)||$('<input />'), options);
  };


  Autocomplete.prototype = {

    killerFn: null,

    initialize: function() {

      var me, uid, autocompleteElId;
      me = this;
      uid = Math.floor(Math.random()*0x100000).toString(16);
      autocompleteElId = 'Autocomplete_' + uid;

      this.killerFn = function(e) {
        if ($(e.target).parents('.autocomplete').size() === 0) {
          me.killSuggestions();
          me.disableKillerFn();
        } 
      };

      if (!this.options.width) { this.options.width = this.el.width(); }
      this.mainContainerId = 'AutocompleteContainter_' + uid;

      $('<div id="' + this.mainContainerId + '" style="position:absolute;z-index:9999;"><div class="autocomplete-w1"><div class="autocomplete" id="' + autocompleteElId + '" style="display:none; width:300px;"></div></div></div>').appendTo('body');

      this.container = $('#' + autocompleteElId);
      this.fixPosition();
      if (window.opera) {
        this.el.keypress(function(e) { me.onKeyPress(e); });
      } else {
        this.el.keydown(function(e) { me.onKeyPress(e); });
      }
      this.el.keyup(function(e) { me.onKeyUp(e); });
      this.el.blur(function() { me.enableKillerFn(); });
//      this.el.focus(function() { me.fixPosition(); });
      this.el.focus(function() { 
        me.fixPosition();
        me.onValueChange();          
      });
    },
    
    setOptions: function(options){
      var o = this.options;
      $.extend(o, options);
      if(o.lookup){
        this.isLocal = true;
        if($.isArray(o.lookup)){ o.lookup = { suggestions:o.lookup, data:[] }; }
      }
      $('#'+this.mainContainerId).css({ zIndex:o.zIndex });
      this.container.css({ maxHeight: o.maxHeight + 'px', width:o.width });
    },
    
    clearCache: function(){
      this.cachedResponse = [];
      this.badQueries = [];
    },
    
    disable: function(){
      this.disabled = true;
    },
    
    enable: function(){
      this.disabled = false;
    },

    fixPosition: function() {
      var offset = this.el.offset();
      $('#' + this.mainContainerId).css({ top: (offset.top + this.el.innerHeight()) + 'px', left: offset.left + 'px' });
    },

    enableKillerFn: function() {
      var me = this;
      $(document).bind('click', me.killerFn);
    },

    disableKillerFn: function() {
      var me = this;
      $(document).unbind('click', me.killerFn);
    },

    killSuggestions: function() {
      var me = this;
      this.stopKillSuggestions();
      this.intervalId = window.setInterval(function() { me.hide(); me.stopKillSuggestions(); }, 300);
    },

    stopKillSuggestions: function() {
      window.clearInterval(this.intervalId);
    },

    onKeyPress: function(e) {
      if (this.disabled || !this.enabled) { return; }
      // return will exit the function
      // and event will not be prevented
      switch (e.keyCode) {
        case 27: //KEY_ESC:
          this.el.val(this.currentValue);
          this.hide();
          break;
        case 9: //KEY_TAB:
        case 13: //KEY_RETURN:
          if (this.selectedIndex === -1) {
            this.hide();
            return;
          }
          this.select(this.selectedIndex);
          if(e.keyCode === 9){ return; }
          break;
        case 38: //KEY_UP:
          this.moveUp();
          break;
        case 40: //KEY_DOWN:
          this.moveDown();
          break;
        default:
          return;
      }
      e.stopImmediatePropagation();
      e.preventDefault();
    },

    onKeyUp: function(e) {
      if(this.disabled){ return; }
      switch (e.keyCode) {
        case 38: //KEY_UP:
        case 40: //KEY_DOWN:
          return;
      }
      clearInterval(this.onChangeInterval);
      if (this.currentValue !== this.el.val()) {
        if (this.options.deferRequestBy > 0) {
          // Defer lookup in case when value changes very quickly:
          var me = this;
          this.onChangeInterval = setInterval(function() { me.onValueChange(); }, this.options.deferRequestBy);
        } else {
          this.onValueChange();
        }
      }
    },

    onValueChange: function() {
      clearInterval(this.onChangeInterval);
      this.currentValue = this.el.val();
      var q = this.getQuery(this.currentValue);
      
      if(q == "" && this.options.minChars > 0)
      {
        return;
      }
      
      this.selectedIndex = -1;
      if (this.ignoreValueChange) {
        this.ignoreValueChange = false;
        return;
      }
      if ((q === '' || q.length < this.options.minChars) && this.options.minChars > 0) {
        this.hide();
      } else {
        this.getSuggestions(q);
      }
    },

    getQuery: function(val) {
      var d, arr;
      d = this.options.delimiter;
      if (!d) { return $.trim(val); }
      arr = val.split(d);
      return $.trim(arr[arr.length - 1]);
    },

    getSuggestionsLocal: function(q) {
      var ret, arr, len, val, i;
      arr = this.options.lookup;
      len = arr.suggestions.length;
      ret = { suggestions:[], data:[] };
      q = q.toLowerCase();
      for(i=0; i< len; i++){
        val = arr.suggestions[i];
        if(val.toLowerCase().indexOf(q) === 0){
          ret.suggestions.push(val);
          ret.data.push(arr.data[i]);
        }
      }
      return ret;
    },
    
    getSuggestions: function(q) {
      var cr, me;
      cr = this.isLocal ? this.getSuggestionsLocal(q) : this.cachedResponse[q];
      if (cr && $.isArray(cr.suggestions)) {
        this.suggestions = cr.suggestions;
        this.data = cr.data;
        this.suggest();
      } else if (!this.isBadQuery(q)) {
        me = this;
                    
        if(q == undefined)
        {
          q = "";
        }                    
                                                                  
        toggleWaitingIcon(me.options.params.filterID, me);
        
        if(me.options.params.attributes.search("::") != -1)
        {
          me.options.params.attributes = me.options.params.attributes.substring(0, me.options.params.attributes.search("::"));
        }
        
//        me.options.params.attributes = urlencode(me.options.params.attributes) + "::" + urlencode('"'+q+'"' + "*") +";" + me.options.params.constrainedAttributes;
        me.options.params.attributes = me.options.params.attributes + "::" + this.urlencode(q + "*") +";" + me.options.params.constrainedAttributes;
        me.options.params.constrainedAttributes = "";
        
        var queryData = {
          ws: this.serviceUrl,
          method: "post",
          accept: "application/json", 
          params: me.options.params
        }
        
        $.ajax({
          type: "POST",
          url: this.sWebMapRef.OSFDrupalProxy,
          data: queryData,
          dataType: "json",
          query: q,
          
          success: function(txt){
            var resultset = new Resultset(txt);

            var suggestions = [];
            var suggestionsData = [];
            
            for(var i = 0; i < resultset.subjects.length; i++)        
            { 
              var fromOntology = "";
              
              var properties = resultset.subjects[i].getPredicateValues("http://purl.org/ontology/aggregate#property");
              
              if(properties.length > 0)
              {
                if(me.urlencode(properties[0].uri) == me.options.params.attributes.substring(0, me.options.params.attributes.search("::")))
                {
                  suggestions.push(resultset.subjects[i].getPredicateValues("http://purl.org/ontology/aggregate#object")[0] + " ("+resultset.subjects[i].getPredicateValues("http://purl.org/ontology/aggregate#count")[0]+")");
                  suggestionsData.push({uri: properties[0].uri});                
                }
              }
             /* 
              
              
              suggestions.push(resultset.subjects[i].getPrefLabel()[0] + "&nbsp;&nbsp;&nbsp;<em>("+fromOntology+")</em>");
//              suggestionsData.push(resultset.subjects[i].uri);
              
              switch(resultset.unprefixize(resultset.subjects[i].type))
              {
                case "http://www.w3.org/2002/07/owl#Class":
                  suggestionsData.push({uri: resultset.subjects[i].uri, ontology: resultset.subjects[i].getPredicateValues("http://purl.org/dc/terms/isPartOf")[0].uri, type: "class"});                
                break;

                case "http://www.w3.org/2002/07/owl#DatatypeProperty":
                  suggestionsData.push({uri: resultset.subjects[i].uri, ontology: resultset.subjects[i].getPredicateValues("http://purl.org/dc/terms/isPartOf")[0].uri, type: "dataproperty"});                
                break;                

                case "http://www.w3.org/2002/07/owl#ObjectProperty":
                  suggestionsData.push({uri: resultset.subjects[i].uri, ontology: resultset.subjects[i].getPredicateValues("http://purl.org/dc/terms/isPartOf")[0].uri, type: "objectproperty"});                
                break;                

                case "http://www.w3.org/2002/07/owl#AnnotationProperty":
                  suggestionsData.push({uri: resultset.subjects[i].uri, ontology: resultset.subjects[i].getPredicateValues("http://purl.org/dc/terms/isPartOf")[0].uri, type: "annotationproperty"});                
                break;  
                
                default: 
                  suggestionsData.push({uri: resultset.subjects[i].uri, ontology: resultset.subjects[i].getPredicateValues("http://purl.org/dc/terms/isPartOf")[0].uri, type: "namedindividual"});                
                break;              
              }
              */
            }              

            //{ query:'c',suggestions:['Cambodia','Cameroon','Canada','Cape Verde','Cayman Islands','Central African Republic','Chad','Chile','China','Christmas Island','Cocos (keeling) Islands','Colombia','Comoros','Congo','Cook Islands','Costa Rica','Cote D\'ivoire','Croatia','Cuba','Cyprus','Czech Republic'],data:['kh','cm','ca','cv','ky','cf','td','cl','cn','cx','cc','co','km','cg','ck','cr','ci','hr','cu','cy','cz'] }            

            if(suggestions.length == 0)
            {
              suggestions.push("No values available");
            }
            
            me.processResponse({
              query: this.query,
              suggestions: suggestions,
              data: suggestionsData
            });
            
            toggleWaitingIcon(me.options.params.filterID, me);
          },
          
          error: function(jqXHR, textStatus, error) {
            toggleWaitingIcon(me.options.params.filterID, me);
          }
        });
      }
    },

    isBadQuery: function(q) {
      var i = this.badQueries.length;
      while (i--) {
        if (q == undefined){return true;}
        if (q.indexOf(this.badQueries[i]) === 0) { return true; }
      }
      return false;
    },

    hide: function() {
      this.enabled = false;
      this.selectedIndex = -1;
      this.container.hide();
    },

    suggest: function() {
      if (this.suggestions.length === 0) {
        this.hide();
        return;
      }

      var me, len, div, f, v, i, s, mOver, mClick;
      me = this;
      len = this.suggestions.length;
      f = this.options.fnFormatResult;
      v = this.getQuery(this.currentValue);
      mOver = function(xi) { return function() { me.activate(xi); }; };
      mClick = function(xi) { return function() { me.select(xi); }; };
      this.container.hide().empty();
      for (i = 0; i < len; i++) {
        s = this.suggestions[i];
        div = $((me.selectedIndex === i ? '<div class="selected"' : '<div') + ' title="' + s + '">' + f(s, this.data[i], v) + '</div>');
        div.mouseover(mOver(i));
        div.click(mClick(i));
        this.container.append(div);
      }
      this.enabled = true;
      this.container.show();
    },

    processResponse: function(response) {
//      var response;
//      try {
//        response = eval('(' + text + ')');
//      } catch (err) { return; }
      if (!$.isArray(response.data)) { response.data = []; }
      if(!this.options.noCache){
        this.cachedResponse[response.query] = response;
        if (response.suggestions.length === 0) { this.badQueries.push(response.query); }
      }
      if (response.query === this.getQuery(this.currentValue)) {
        this.suggestions = response.suggestions;
        this.data = response.data;
        this.suggest(); 
        this.suggest(); 
      }
    },

    activate: function(index) {
      var divs, activeItem;
      divs = this.container.children();
      // Clear previous selection:
      if (this.selectedIndex !== -1 && divs.length > this.selectedIndex) {
        $(divs.get(this.selectedIndex)).removeClass();
      }
      this.selectedIndex = index;
      if (this.selectedIndex !== -1 && divs.length > this.selectedIndex) {
        activeItem = divs.get(this.selectedIndex);
        $(activeItem).addClass('selected');
      }
      return activeItem;
    },

    deactivate: function(div, index) {
      div.className = '';
      if (this.selectedIndex === index) { this.selectedIndex = -1; }
    },

    select: function(i) {
      var selectedValue, f;
      selectedValue = this.suggestions[i];
      if (selectedValue) {  
        this.el.val(selectedValue);
        if (this.options.autoSubmit) {
          f = this.el.parents('form');
          if (f.length > 0) { f.get(0).submit(); }
        }
        this.ignoreValueChange = true;
        this.hide();
        this.onSelect(i);
      }
    },

    moveUp: function() {
      if (this.selectedIndex === -1) { return; }
      if (this.selectedIndex === 0) {
        this.container.children().get(0).className = '';
        this.selectedIndex = -1;
        this.el.val(this.currentValue);
        return;
      }
      this.adjustScroll(this.selectedIndex - 1);
    },

    moveDown: function() {
      if (this.selectedIndex === (this.suggestions.length - 1)) { return; }
      this.adjustScroll(this.selectedIndex + 1);
    },

    adjustScroll: function(i) {
      var activeItem, offsetTop, upperBound, lowerBound;
      activeItem = this.activate(i);
      offsetTop = activeItem.offsetTop;
      upperBound = this.container.scrollTop();
      lowerBound = upperBound + this.options.maxHeight - 25;
      if (offsetTop < upperBound) {
        this.container.scrollTop(offsetTop);
      } else if (offsetTop > lowerBound) {
        this.container.scrollTop(offsetTop - this.options.maxHeight + 25);
      }
      
      var fixedValue = this.suggestions[i];
      fixedValue = fixedValue.substring(0, fixedValue.search("&nbsp;&nbsp;&nbsp;"));      
      
      this.el.val(this.getValue(fixedValue));
    },

    onSelect: function(i) {
      var me, fn, s, d;
      me = this;
      fn = me.options.onSelect;
      s = me.suggestions[i];
      d = me.data[i];  

      var fixedValue = me.getValue(s);
      fixedValue = fixedValue.substring(0, fixedValue.search("&nbsp;&nbsp;&nbsp;"));            
      
      me.el.val(fixedValue);
      if ($.isFunction(fn)) { fn(s, d, me.el); }
    },
    
    getValue: function(value){
        var del, currVal, arr, me;
        me = this;
        del = me.options.delimiter;
        if (!del) { return value; }
        currVal = me.currentValue;
        arr = currVal.split(del);
        if (arr.length === 1) { return value; }
        return currVal.substr(0, currVal.length - arr[arr.length - 1].length) + value;
    },
    
    urlencode: function(str){
      // http://kevin.vanzonneveld.net
      // +   original by: Philip Peterson
      // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // +      input by: AJ
      // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // +   improved by: Brett Zamir (http://brett-zamir.me)
      // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // +      input by: travc
      // +      input by: Brett Zamir (http://brett-zamir.me)
      // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // +   improved by: Lars Fischer
      // +      input by: Ratheous
      // +      reimplemented by: Brett Zamir (http://brett-zamir.me)
      // +   bugfixed by: Joris
      // +      reimplemented by: Brett Zamir (http://brett-zamir.me)
      // %          note 1: This reflects PHP 5.3/6.0+ behavior
      // %        note 2: Please be aware that this function expects to encode into UTF-8 encoded strings, as found on
      // %        note 2: pages served as UTF-8
      // *     example 1: this.urlencode('Kevin van Zonneveld!');
      // *     returns 1: 'Kevin+van+Zonneveld%21'
      // *     example 2: this.urlencode('http://kevin.vanzonneveld.net/');
      // *     returns 2: 'http%3A%2F%2Fkevin.vanzonneveld.net%2F'
      // *     example 3: this.urlencode('http://www.google.nl/search?q=php.js&ie=utf-8&oe=utf-8&aq=t&rls=com.ubuntu:en-US:unofficial&client=firefox-a');
      // *     returns 3: 'http%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3Dphp.js%26ie%3Dutf-8%26oe%3Dutf-8%26aq%3Dt%26rls%3Dcom.ubuntu%3Aen-US%3Aunofficial%26client%3Dfirefox-a'
      str = (str + '').toString();

      // Tilde should be allowed unescaped in future versions of PHP (as reflected below), but if you want to reflect current
      // PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
      return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
      replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
    }       
  };

}(jQuery));


function toggleWaitingIcon(controlID, me)
{
  if($("#addButton_" + controlID).attr("src"))
  {
    // The image is loaded
    var parent = $("#addButton_" + controlID).parent();
    
    $("#addButton_" + controlID).remove();
    
    parent.append('<input id="addButton_'+controlID+'" type="submit" value="add" />');
    
    $("#addButton_" + controlID).click(function() {
      var id = this.id.substring(this.id.lastIndexOf("_") + 1);
      
      me.sWebMapRef.attributeValueFilter(id);
    });         
  }
  else
  {
    // The button is loaded
    var parent = $("#addButton_" + controlID).parent();
    
    $("#addButton_" + controlID).remove();
    
    parent.append('<img id="addButton_'+controlID+'" src="'+me.sWebMapRef.imagesFolder+'ajax-loader-icon.gif" />')
  }
/*  
  if($("#" + imgID).attr("src").search("ajax-loader-icon.gif") != -1)
  {
    $("#" + imgID).attr("src", $("#" + imgID).data("prevImg"))
  }
  else
  {
    $("#" + imgID).data("prevImg", $("#" + imgID).attr("src"));
    $("#" + imgID).attr("src", structOntologyModuleFullPath + '/imgs/ajax-loader-icon.gif');
  }
*/  
}