                                                          
/* List of attribute URIs that are generally used for labeling entities in different ontologies */
var prefLabelAttributes = [
  "http://purl.org/ontology/iron#prefLabel",
  "http://www.w3.org/2004/02/skos/core#prefLabel",
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

var prefURLAttributes = [
  "http://purl.org/ontology/iron#prefURL",
  "http://purl.org/ontology/npi#url"
];


function Resultset(rjson) 
{
  // Define all prefixes of this resultset
  this.prefixes = rjson.prefixes;  
  
  // Unprefixize all URIs of this resultset
  var resultsetJsonText = JSON.stringify(rjson);
 
  for(var prefix in this.prefixes)
  {
    if(this.prefixes.hasOwnProperty(prefix))
    {
      var pattern = new RegExp(prefix+":", "igm");
      resultsetJsonText = resultsetJsonText.replace(pattern, this.prefixes[prefix]);
    }
  } 
  
  rjson = JSON.parse(resultsetJsonText);  
  
  // Define all subjects
  this.subjects = rjson.resultset.subject;
  
  // Extend all subjects of this resultset with additional functions
  for(var i = 0; i < this.subjects.length; i++) 
  {
    //this.subjects[i].prefixes = this.prefixes;
    this.subjects[i].prefixize = resultset_prefixize;
    this.subjects[i].unprefixize = resultset_unprefixize;
    this.subjects[i].getPredicateValues = subject_getPredicateValues;
    this.subjects[i].getValuePredicates = subject_getValuePredicates;
    this.subjects[i].getPrefURL = subject_getPrefURL;
    this.subjects[i].getPrefLabel = subject_getPrefLabel;
    this.subjects[i].getPrefLabelTuple = subject_getPrefLabelTuple;
    this.subjects[i].getAltLabels = subject_getAltLabels;
    this.subjects[i].getAltLabelsTuple = subject_getAltLabelsTuple;
    this.subjects[i].getDescription = subject_getDescription;
    this.subjects[i].getDescriptionTuple = subject_getDescriptionTuple;
    this.subjects[i].getTypes = subject_getTypes;
    this.subjects[i].rename = subject_rename;
    this.subjects[i].addAttributeValue = subject_addAttributeValue;
    this.subjects[i].removePredicateValues = subject_removePredicateValues;
    this.subjects[i].removePredicateValue = subject_removePredicateValue;
    this.subjects[i].getDatasets = subject_getDatasets;
    
    // Make sure that the "predicate" attribute is defined
    if(!('predicate' in this.subjects[i]))
    {
      this.subjects[i]['predicate'] = [];
    }
  }

  // Define the prefixize() function for this Resultset object
  this.prefixize = resultset_prefixize;
  this.isPrefixed = resultset_isPrefixed;
  this.unprefixize = resultset_unprefixize;
  this.saveN3 = resultset_saveN3;  
  this.saveStructXML = resultset_saveStructXML;  
  this.getSubjectsByPredicateObjectValue = resultset_getSubjectsByPredicateObjectValue;
  this.getSubjectsByType = resultset_getSubjectsByType;
  this.getSubject = resultset_getSubject;
}

Resultset.prototype.getSubjectByURI = function(uri) 
{
  for(var i = 0; i < this.subjects.length; i++)  
  {
    if(uri == this.subjects[i].uri)
    {
      // return the subject
      return this.subjects[i];
    }
  }
};


// These are a series of Subject function that get added to the resultset subjects objects
// by the Resultset function's utilities methods.

// uri (uri/iri)
// extended (bool)
function subject_getPredicateValues(uri)
{
  // "extended" parameter (optional) [Boolean]
  var extended = false;
  
  if(arguments[1] != undefined)
  {
    var extended = arguments[1];
  }
  
  var values = [];
  
  if('predicate' in this)
  {
    for(var i = 0; i < this.predicate.length; i++)  
    {
      var predicate = this.predicate[i];
      
      for(var predicateURI in predicate)
      {
        if(this.prefixize(uri) == predicateURI || uri == predicateURI)
        {
          // Return a literal value
          if((typeof (predicate[predicateURI]) == 'object' && 
              'value' in predicate[predicateURI]))
          {
            if(!extended)
            {
              /*
                Simply return the literal value
              */
              values.push(predicate[predicateURI].value);
            }
            else
            {
              /*
                Returns:
                
                 {
                   "value": "my-literal-value",
                   "type": "xsd:type",
                   "lang": "en"
                 }
              */
              values.push(predicate[predicateURI]);
            }
          }
          else
          {
            /*
              (1) If it is a simple literal, we return the literal's value
                
                  "my literal"
              
              (2) If it is an object property, we return the boject reference value:
                  
                  {"uri": "referenced-uri}
            */
            values.push(predicate[predicateURI]);
          }
        }
      }
    }  
  }
  
  return(values);
} 

function subject_getValuePredicates(value)
{
  var predicates = [];
  
  if('predicate' in this)
  {
    for(var i = 0; i < this.predicate.length; i++)  
    {
      var predicate = this.predicate[i];
      
      for(var predicateURI in predicate)
      {                         
        if(((typeof (predicate[predicateURI]) == 'object' && 
            'uri' in predicate[predicateURI]) &&
            predicate[predicateURI].uri == value) ||
           predicate[predicateURI] == value)
        {
          predicates.push(this.unprefixize(predicateURI));
        }
      }
    }  
  }
  
  return(predicates);
}     

// This function takes a URI as input and try to replace it by
// its prefixed version
function resultset_prefixize(uri)
{
  if('prefixes' in this && uri != null)
  {
    for(var prefix in this.prefixes)
    {                   
      if(uri.indexOf(this.prefixes[prefix]) != -1)
      {
        return(prefix + ":" + uri.substring(this.prefixes[prefix].length));
      }
    }
  }
  
  return(uri);
}


// Utilify function to see if a URI is prefixed or not.
function resultset_isPrefixed(uri)
{
  if('prefixes' in this && uri != null)
  {
    for(var prefix in this.prefixes)
    {                            
      if(uri.indexOf(prefix+":") != -1)
      {
        return(true);
      }
    }
  }
  
  return(false);
}

// This function takes a URI as input and try to replace it by
// its full URI version
function resultset_unprefixize(uri)
{
  for(var prefix in this.prefixes)
  {
    if(uri.search(prefix+':') != -1)
    {
      return(this.prefixes[prefix] + uri.substring(prefix.length + 1));
    }
  }
  
  return(uri);
}

function resultset_saveStructXML()
{
  var xml = '<?xml version="1.0" encoding="utf-8"?>\
              <resultset>';
  
  // Serialize prefixes
  for(var ns in this.prefixes)
  {
    xml += '<prefix entity="'+ns+'" uri="'+this.prefixes[ns]+'" />' + "\n";
  }
  
  xml += "\n";
  
  // Serialize Subjects
  for(var i = 0; i < this.subjects.length; i++)
  {
    // Serialize the first type
    xml += '<subject uri="'+this.subjects[i].uri+'" type="'+this.unprefixize(this.subjects[i].type)+'">'+"\n";
    
    // Serialize all the properties
    if(typeof(this.subjects[i]) == 'object' &&
       'predicate' in this.subjects[i])
    {
      for(var ii = 0; ii < this.subjects[i].predicate.length; ii++)
      {
        for(var predicate in this.subjects[i].predicate[ii])
        {   
          if(typeof(this.subjects[i].predicate[ii][predicate]) == 'object' && 
             'uri' in this.subjects[i].predicate[ii][predicate])
          {
            xml += '<predicate type="'+predicate+'">\
                      <object uri="'+this.subjects[i].predicate[ii][predicate].uri+'"/>\
                    </predicate>';
          }
          else
          {
            xml += '<predicate type="'+predicate+'">\
                      <object type="rdfs:Literal">'+xmlEncode(this.subjects[i].predicate[ii][predicate])+'</object>\
                    </predicate>';
          }
        }
      }
    }  
    
    xml += '</subject>';
  }
  
  xml += '</resultset>';
  
  return(xml);
}

function xmlEncode(string) 
{
    return(string.replace(/\&/g,'&'+'amp;').replace(/</g,'&'+'lt;')
           .replace(/>/g,'&'+'gt;').replace(/\'/g,'&'+'apos;').replace(/\"/g,'&'+'quot;'));
}

function resultset_saveN3()
{
  n3 = "";
  
  // Serialize prefixes
  for(var ns in this.prefixes)
  {
    n3 += "@prefix "+ns+": <"+this.prefixes[ns]+"> .\n";
  }
  
  n3 += "\n";
  
  // Serialize Subjects
  for(var i = 0; i < this.subjects.length; i++)
  {
    // Serialize the first type
    if(this.isPrefixed(this.prefixize(this.subjects[i].type)))
    {
      n3 += "<"+this.subjects[i].uri+"> a "+this.prefixize(this.subjects[i].type)+" ;\n";
    }
    else
    {
      n3 += "<"+this.subjects[i].uri+"> a <"+this.prefixize(this.subjects[i].type)+"> ;\n";
    }    
    
    // Serialize all the properties
    if(typeof(this.subjects[i]) == 'object' &&
       'predicate' in this.subjects[i])
    {
      for(var ii = 0; ii < this.subjects[i].predicate.length; ii++)
      {
        for(var predicate in this.subjects[i].predicate[ii])
        {   
          if(typeof(this.subjects[i].predicate[ii][predicate]) == 'object' && 
             'uri' in this.subjects[i].predicate[ii][predicate])
          {
            if(this.isPrefixed(this.prefixize(predicate)))
            {
              n3 += "  "+this.prefixize(predicate)+" <"+this.subjects[i].predicate[ii][predicate].uri+"> ;\n"
            }
            else
            {
              n3 += "  <"+predicate+"> <"+this.subjects[i].predicate[ii][predicate].uri+"> ;\n"
            }
          }
          else
          {
            if(this.isPrefixed(this.prefixize(predicate)))
            {
              if(typeof(this.subjects[i].predicate[ii][predicate]) == 'object' && 
                 'value' in this.subjects[i].predicate[ii][predicate])
              {
                n3 += "  "+this.prefixize(predicate)+" \""+escapeN3(this.subjects[i].predicate[ii][predicate].value)+"\" ;\n"
              }
              else
              {
                n3 += "  "+this.prefixize(predicate)+" \""+escapeN3(this.subjects[i].predicate[ii][predicate])+"\" ;\n"
              }
            }
            else
            {
              if(typeof(this.subjects[i].predicate[ii][predicate]) == 'object' && 
                 'value' in this.subjects[i].predicate[ii][predicate])
              {
                n3 += "  <"+predicate+"> \""+escapeN3(this.subjects[i].predicate[ii][predicate].value)+"\" ;\n"
              }
              else
              {
                n3 += "  <"+predicate+"> \""+escapeN3(this.subjects[i].predicate[ii][predicate])+"\" ;\n"
              }
            }
          } 
        }
      }
    }  
    
    // Properly close the record's description
    n3 = n3.substr(0, n3.length - 2) + ". \n";  
  }
  
  return(n3);
}

function escapeN3(str)
{
  return(str.replace(/"/g, "\\\""));
}

/*
  "value" can be one of: "... literal ..." or "{ uri: "uri-identifier" }"
*/
function subject_addAttributeValue(attr, value)
{
  if('predicate' in this)
  {
    var attrValue = {};
    attrValue[this.prefixize(attr)] = value;
    
    this.predicate.push(attrValue);
  }      
}

// Utility function to rename a subject: so to change its prefLabel
function subject_rename(newName)
{
  if('predicate' in this)
  {
    for(var i = 0; i < this.predicate.length; i++)  
    {
      var predicate = this.predicate[i];
      
      for(var predicateURI in predicate)
      {
        for(var u = 0; u < prefLabelAttributes.length; u++)  
        {        
          if(prefLabelAttributes[u] == this.unprefixize(predicateURI)|| prefLabelAttributes[u] == predicateURI)
          {
            predicate[predicateURI] = newName;
            return;
          }
        }
      }
    }  
  }
  
  // New prefLabel found, so let's define one
  this.addAttributeValue("http://www.w3.org/2004/02/skos/core#prefLabel", newName);
    
}

// This function try to find a preferred label that refers to this subject
function subject_getPrefLabel()
{  
  var prefLabels = [];
  
  for(var i = 0; i < prefLabelAttributes.length; i++)  
  {
    var values = this.getPredicateValues(prefLabelAttributes[i]);
    
    if(values.length > 0)
    {
      prefLabels.push(values[0]);
    }
  }
  
  if(prefLabels.length <= 0)
  {
    // In worse case, we use the ending of the URI as the pref label...
  
    if(this.uri.lastIndexOf("#") != -1)
    {
      prefLabels.push(this.uri.substring(this.uri.lastIndexOf("#") + 1).replace(/([A-Z])/g, " $1").replace(/^\s+|\s+$/g, ''));
    }
    else if(this.uri.lastIndexOf("/") != -1)
    {
      prefLabels.push(this.uri.substring(this.uri.lastIndexOf("/") + 1).replace(/([A-Z])/g, " $1").replace(/^\s+|\s+$/g, ''));
    }
  }
  
  if(prefLabels.length <= 0)
  {
    prefLabels.push(this.uri);
  }  
  
  if(prefLabels[0] != undefined)
  {
    return(prefLabels[0]);
  }
  else
  {
    return("");
  }
}

// This function try to find a preferred label that refers to this subject
// It returns an object with the pref label literal and the URI of the
// attribute that defines it.
//
// returns: {label: "", attr: ""}
function subject_getPrefLabelTuple()
{ 
  var prefLabels = [];
  
  for(var i = 0; i < prefLabelAttributes.length; i++)  
  {
    var values = this.getPredicateValues(prefLabelAttributes[i]);
    
    if(values.length > 0)
    {
      prefLabels.push({label: values[0], attr: prefLabelAttributes[i]});
    }
  }
  
  if(prefLabels.length <= 0)
  {  
    // In worse case, we use the ending of the URI as the pref label...
    
    if(this.uri.lastIndexOf("#") != -1)
    {
      prefLabels.push({label: this.uri.substring(this.uri.lastIndexOf("#") + 1).replace(/([A-Z])/g, " $1").replace(/^\s+|\s+$/g, ''), attr: "http://www.w3.org/2000/01/rdf-schema#label"});
    }
    else if(this.uri.lastIndexOf("/") != -1)
    {
      prefLabels.push({label: this.uri.substring(this.uri.lastIndexOf("/") + 1).replace(/([A-Z])/g, " $1").replace(/^\s+|\s+$/g, ''), attr: "http://www.w3.org/2000/01/rdf-schema#label"});
    }
  }
  
  if(prefLabels.length <= 0)
  {
    prefLabels.push({label: this.uri, attr: "http://www.w3.org/2000/01/rdf-schema#label"});
  }    
  
  return(prefLabels);
}

// This function try to find a alternative labels that refers to this subject
function subject_getAltLabels()
{
  altLabels = [];
  
  for(var i = 0; i < altLabelAttributes.length; i++)  
  {
    var values = this.getPredicateValues(altLabelAttributes[i]);
    
    for(var ii = 0; ii < values.length; ii++)
    {
      altLabels.push({label: values[ii], attr: altLabelAttributes[i]});
    }
  }
  
  return(altLabels);
}

// This function try to find a alternative labels that refers to this subject
// It returns an object with the pref label literal and the URI of the
// attribute that defines it.
//
// returns: [{label: "", attr: ""}]
function subject_getAltLabelsTuple()
{
  altLabels = [];
  
  for(var i = 0; i < altLabelAttributes.length; i++)  
  {
    var values = this.getPredicateValues(altLabelAttributes[i]);
    
    for(var ii = 0; ii < values.length; ii++)
    {
      altLabels.push({label: values[ii], attr: altLabelAttributes[i]});
    }
  }
  
  return(altLabels);
}

// This function try to find a description of the subject
function subject_getDescription()
{
  var descriptions = [];     
    
  for(var i = 0; i < descriptionAttributes.length; i++)  
  {
    var values = this.getPredicateValues(descriptionAttributes[i]);
    
    if(values.length > 0)
    {
      descriptions.push(values[0]);
    }
  }
  
  if(descriptions[0] != undefined)
  {
    return(descriptions[0]);
  }
  else
  {
    return("");
  }
}

// This function try to find a description of the subject
function subject_getPrefURL()
{
  var prefURLs = [];     
    
  for(var i = 0; i < prefURLAttributes.length; i++)  
  {
    var values = this.getPredicateValues(prefURLAttributes[i]);
    
    if(values.length > 0)
    {
      prefURLs.push(values[0]);
    }
  }
  
  if(prefURLs[0] != undefined)
  {
    return(prefURLs[0]);
  }
  else
  {
    return("");
  }
}


// This function try to find a find a description of the subject
// It returns an object with the description literal and the URI of the
// attribute that defines it.
//
// returns: {description: "", attr: ""}
function subject_getDescriptionTuple()
{ 
  var descriptions = [];
  
  for(var i = 0; i < descriptionAttributes.length; i++)  
  {
    var values = this.getPredicateValues(descriptionAttributes[i]);
    
    if(values.length > 0)
    {
      descriptions.push({description: values[0], attr: descriptionAttributes[i]});
    }
  }
  
  return(descriptions);  
}

// This function returns all the types of a subject. Returned types are in full URI form.
function subject_getTypes()
{
  var types = [this.unprefixize(this.type)];
  
  // Check if more than one type exists
  var t = this.getPredicateValues("http://www.w3.org/1999/02/22-rdf-syntax-ns#type");

  for(var i = 0; i < t.length; i++)
  {
    types.push(this.unprefixize(t[i].uri));
  }  
  
  return(types);
}


// This function remove an attribute and all its values from the subject's description
function subject_removePredicateValues(uri)
{
  if('predicate' in this)
  {
    for(var i = this.predicate.length - 1; i >= 0; i--)  
    {
      var predicate = this.predicate[i];
      
      for(var predicateURI in predicate)
      {
        if(uri == this.unprefixize(predicateURI)|| uri == predicateURI)
        {
          this.predicate.splice(i, 1);
        }
      }
    }  
  }
}

function subject_removePredicateValue(uri, value)
{
  if('predicate' in this)
  {
    for(var i = this.predicate.length - 1; i >= 0; i--)  
    {
      var predicate = this.predicate[i];
      
      for(var predicateURI in predicate)
      {
        var predValue = "";
        
        if(typeof(predicate[predicateURI]) == 'object')
        {
          if('uri' in this)
          {
            predValue = predicate[predicateURI].uri;
          }
        }
        else
        {
          predValue = predicate[predicateURI];
        }
        
        if((uri == this.unprefixize(predicateURI) || uri == predicateURI) &&
            predValue == value)
        {
          this.predicate.splice(i, 1);
        }
      }
    }  
  }  
}

// Returns an array of dataset URIs where this subject is defined.
function subject_getDatasets()
{
  var datasets = [];
  
  var values = this.getPredicateValues("http://purl.org/dc/terms/isPartOf");
  
  for(var i = 0; i < values.length; i++)
  {
    datasets.push(values[i].uri);
  }
  
  return(datasets);
}  

function resultset_getSubjectsByPredicateObjectValue(predicate, objectValue, subResultset)
{
  /** results to be returned */
  var results = [];

  /** intermediary structure that reference the resultset where to check for the subjects */
  var targetResultset = [];

  if(subResultset != undefined && 
     subResultset != null &&
     subResultset.length > 0)
  {
    targetResultset = subResultset;
  }
  else
  {
    targetResultset = this.subjects;
  }

  for(var s in targetResultset)
  {
    var subject = targetResultset[s];
    var breakLoop = false;

    for(var p in subject.predicate)
    {
      for(var pred in subject.predicate[p])
      {
        var predicateValue = subject.predicate[p][pred];
        
        if(predicateValue.uri == objectValue && pred == predicate)
        {
          results.push(subject);
          breakLoop = true;
          break;
        }
      }

      if(breakLoop)
      {
        break;
      }
    }
  }

  return (results);
}

function resultset_getSubjectsByType(type, subResultset)
{
  /** results to be returned */
  var results = [];

  /** intermediary structure that reference the resultset where to check for the subjects */
  var targetResultset = [];

  if(subResultset != undefined &&
     subResultset != null &&
     subResultset.length > 0)
  {
    targetResultset = subResultset;
  }
  else
  {
    targetResultset = this.subjects;
  }

  for(var s = 0; s < targetResultset.length; s++)   
  {
    var subject = targetResultset[s];
    
    if(subject.type == type)
    {
      results.push(subject);
    }
  }

  return (results);
}

function resultset_getSubject(uri)
{
  for(var s = 0; s < this.subjects.length; s++)   
  {
    var subject = this.subjects[s];
    
    if(subject.uri == uri)
    {
      return(subject);
    }
  }

  return(null);
}