  var templates = {
          
    "http://xmlns.com/foaf/0.1/Image": 
      '<div>\
         <div class="resultTitle">\
           <b>\
             <span class="http_--purl-org-ontology-iron-prefLabel"></span>\
           </b>\
         </div>\
         <table width="100%">\
          <tr>\
            <td width="75%">\
              <div style="padding-top: 10px;" class="http_--purl-org-ontology-iron-description"></div>\
            </td>\
            <td width="25%">\
              <img class="http_--xmlns-com-foaf-0-1-thumbnail@src" src="" />\
            </td>\
          </tr>\
         </table>\
       </div>',
              
    "http://purl.org/ontology/muni#Schools": 
      '<div>\
         <div class="resultTitle">\
           <b>\
             <span class="http_--purl-org-ontology-iron-prefLabel"></span>\
           </b>\
         </div>\
         <div class="schoolDistrict">\
           School\'s District: <span class="http_--purl-org-ontology-muni-district"></span>\
         </div>\
         <div>\
           <a class="http_--xmlns-com-foaf-0-1-homepage@href" target="_new">School\'s Homepage</a>\
         </div>\
       </div>'
       
  };

  var templatesDirectives = {
    "http://purl.org/ontology/muni#Schools": {
      /**
      * This directive check for all the <div> elements that have a "schoolDistrict" class.
      * The it checks if the current record being templated has the muni:district attribute
      * describing it. If it does, the it checks to make sure the value is not empty.
      * If both a true, then nothing is done. But if one of these two conditions are false,
      * then PURE will assign the style "display:none" to the "schoolDistrict" <div> and so
      * hide it from the display.
      */
      'div.schoolDistrict@style' : function(args) {
        if(args.context['http_--purl-org-ontology-muni-district'] == undefined ||
           args.context['http_--purl-org-ontology-muni-district'] == "")
        {
          return('display:none');
        }
      }
    }
  };