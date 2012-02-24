
/* List of attribute URIs that are generally used for labeling entities in different ontologies */
var prefLabelAttributes = [
  "http://www.w3.org/2004/02/skos/core#prefLabel",
  "http://purl.org/ontology/iron#prefLabel",
  "http://umbel.org/umbel#prefLabel",
  "http://purl.org/dc/terms/title",
  "http://purl.org/dc/elements/1.1/title",
  "http://xmlns.com/foaf/0.1/name",
  "http://xmlns.com/foaf/0.1/givenName",
  "http://xmlns.com/foaf/0.1/family_name",
  "http://www.geonames.org/ontology#name",
  "http://www.w3.org/2000/01/rdf-schema#label"
];

var altLabelAttributes = [
  "http://www.w3.org/2004/02/skos/core#altLabel",
  "http://purl.org/ontology/iron#altLabel",
  "http://umbel.org/umbel#altLabel"
];

var descriptionAttributes = [
  "http://purl.org/ontology/iron#description",
  "http://www.w3.org/2000/01/rdf-schema#comment",
  "http://purl.org/dc/terms/description",
  "http://purl.org/dc/elements/1.1/description",  
  "http://www.w3.org/2004/02/skos/core#definition"
];


function Schema(sjson) 
{
  // Define all prefixes of this resultset
  this.prefixes = sjson.schema.prefixList;  
  
  // Unprefixize all URIs of this Schema
  var resultsetJsonText = JSON.stringify(sjson);
 
  for(var prefix in this.prefixes)
  {
    if(this.prefixes.hasOwnProperty(prefix))
    {
      var pattern = new RegExp('"'+prefix+'_', "igm");
      resultsetJsonText = resultsetJsonText.replace(pattern, '"'+this.prefixes[prefix]);
    }
  } 
  
  sjson = JSON.parse(resultsetJsonText);  

  this.attributes = sjson.schema.attributeList;

  this.types = sjson.schema.typeList;
  
  // Extend all attributes of this schema with additional functions
  for(var i = 0; i < this.attributes.length; i++) 
  {
    this.attributes[i].prefixes = this.prefixes;
  }  
  
  // Extend all types of this schema with additional functions
  for(var i = 0; i < this.types.length; i++) 
  {
    this.types[i].prefixes = this.prefixes;
  }  

  this.getType = schema_getType;
  this.getAttribute = schema_getAttribute;
}

function schema_getType(type)
{
  var t = this.types[type];
  
  if(t == undefined)
  {
    return(null);
  }
  else
  {
    return(t);
  }
}

function schema_getAttribute(attribute)
{
  var a = this.attributes[attribute];
  
  if(a == undefined)
  {
    return(null);
  }
  else
  {
    return(a);
  }
}