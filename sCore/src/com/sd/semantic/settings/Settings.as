package com.sd.semantic.settings
{
  import flash.utils.*;

  /**
   * Setting class used to instantiate the XML settings files. Each setting XML element exactly refer to a member
   * of the different settings classes. This Settings class instantiate the other settings classes by using 
   * reflexion to create the classes instances that will be used by the different semantic component.
   *  
   * @author Frederick Giasson, Structured Dynamics LLC.
   * 
   */
  public class Settings
  {
    /**
     * Constructor
     *  
     * @param xml Input setting file content serialized in XML
     */
    public function Settings(xml:XML)
    {
      var xmlhash:Object = new Object();
      var variables:XMLList = describeType(this).variable;

      if(xml)
      {
        var elements:XMLList = xml.children();

        /** Parse types */
        for each(var element:XML in elements)
        {
          xmlhash[element.name().toString()] = element.toString();
        }

        /** Check if required settings are missing */
        for each(var setting:String in this["requiredSettings"])
        {
          if(!xmlhash[setting])
          {
            this["error"] = true;
            return;
          }
        }

        for(var key:String in xmlhash)
        {
          var varmatches:XMLList = variables.(@name == key);
          var value:String = xmlhash[key];

          if(varmatches && varmatches.length() == 1)
          {
            var type:String = varmatches[0].@type;

            switch(type)
            {
              case "int":
              case "uint":
                var match:Object = (/^(0x|#)([a-fA-F0-9]+)/).exec(value);
  
                if(match)
                {
                  this[key] = parseInt(match[2], 16);
                }
                else
                {
                  this[key] = parseInt(value);
                }
              break;
              case "Number":
                this[key] = parseFloat(value);
              break;
              case "String":
                this[key] = value;
              break;
              case "Boolean":
                if(value == "true")
                {
                  this[key] = true;
                }
                else
                {
                  this[key] = false;
                }
              break;
              case "Array":
                value = value.replace(/^\[/, "").replace(/\]$/, "");
                if(value == "")
                {
                  this[key] = [];  
                }
                else
                {
                  this[key] = value.split(/\s*,\s*/);
                }
              break;

              case "Object":
              break;

              default:
                trace("The model couldn't interpret the value from XML into the requested type, " + type);
              break;
            }
          }
        }
      }
    }
  }
}