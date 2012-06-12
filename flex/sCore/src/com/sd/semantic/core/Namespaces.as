package com.sd.semantic.core
{
  /**
   * Namespace mapping between irXML "short-hand" (prefixed) attribute &amp; type identifers, and their
   * full URI representation.
   *  
   * @author Frederick Giasson, Structured Dynamics LLC.
   */
  public class Namespaces
  {
    /** Index of base ontology URIs and their irXML prefixed shorthand version */
    public var namespaces:Array = [];

    /**
     * Creates the full namespaces structure
     * 
     * @todo populating this structure from a Namespaces.xml setting file.
     */
    public function Namespaces()
    {
      /** URI<-->Prefixes mapping */
      namespaces["http://purl.org/ontology/swt/"] = "swt_";
      namespaces["http://purl.org/ontology/cosmo#"] = "cosmo_";
      namespaces["http://purl.org/dc/terms/"] = "dcterms_";
      namespaces["http://purl.org/dc/elements/1.1/"] = "dc_";
      namespaces["http://purl.org/ontology/iron#"] = "iron_";
      namespaces["http://xmlns.com/foaf/0.1/"] = "foaf_";
      namespaces["http://purl.org/ontology/peg/framework#"] = "pegf_";
      namespaces["http://purl.org/ontology/peg#"] = "peg_";
      namespaces["http://www.w3.org/2000/01/rdf-schema#"] = "rdfs_";
      namespaces["http://purl.org/ontology/wsf#"] = "wsf_";
      namespaces["http://www.w3.org/2002/07/owl#"] = "owl_";
      namespaces["http://www.w3.org/1999/02/22-rdf-syntax-ns#"] = "rdf_";
      namespaces["http://www.geonames.org/ontology#"] = "geoname_";
      namespaces["http://umbel.org/umbel#"] = "umbel_";
      namespaces["http://purl.org/ontology/aggregate#"] = "aggr_";
      namespaces["http://www.w3.org/2004/02/skos/core#"] = "skos_";
      namespaces["http://www.w3.org/2008/05/skos#"] = "skos2008_";
      namespaces["http://rdfs.org/ns/void#"] = "void_";
      namespaces["http://purl.org/ontology/muni#"] = "muni_";
      namespaces["http://purl.org/ontology/census#"] = "census_";
      namespaces["http://purl.org/ontology/census-can#"] = "census-can_";
      namespaces["http://purl.org/ontology/census-can-peg#"] = "census-can-peg_";
      namespaces["http://purl.org/ontology/sco#"] = "sco_";
      namespaces["http://www.w3.org/2003/01/geo/wgs84_pos#"] = "wgs84pos_";
      namespaces["http://purl.org/ontology/npi#"] = "npi_";
    }

    /**
     * Get the full URI of an attribute or type from its prefixed version.
     * For example, "void_Dataset" would become "http://rdfs.org/ns/void#Dataset".
     *  
     * @param variable Prefixed attribute or type identifier. For example "void_Dataset"
     * @return The full URI of a prefixed attribute or type identifier. If the URI
     *         can't be recreated, the input variable is returned.
     * 
     */
    public function getNamespace(variable:String):String
    {
      for(var ns:String in namespaces)
      {
        if(variable.indexOf(namespaces[ns], 0) == 0)
        {
          return (variable.replace(namespaces[ns], ns));
        }
      }

      return (variable);
    }

    /**
     * Get the prefixed variable from a full URI of an attribute or type.
     * For example, "http://rdfs.org/ns/void#Dataset" would become "void_Dataset".
     *  
     * @param uri Full URI of an attribute or type identifier. For example "http://rdfs.org/ns/void#Dataset"
     * @return The prefixed identifier of a full attribute or type URI. If the prefixed version can't
     *         be created, the full URI is returned.
     */
    public function getVariable(uri:String):String
    {
      if(uri)
      {
        var end:int = 0;

        end = uri.lastIndexOf("#");

        if(end == -1)
        {
          end = uri.lastIndexOf("/");
        }

        if(end > 0)
        {
          end += 1;

          return (namespaces[uri.substr(0, end)] + uri.substr(end, (uri.length - end)));
        }

        /** Case example: rdfs:Literal becomes rdfs_Literal */
        end = uri.indexOf(":");

        if(end > 0)
        {
          end += 1;

          return (uri.substr(0, (end - 1)) + "_" + uri.substr(end, (uri.length - end)));
        }

        return (uri);
      }

      return ("");
    }
  }
}