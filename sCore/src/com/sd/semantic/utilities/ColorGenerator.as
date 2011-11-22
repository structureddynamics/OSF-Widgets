/** Derivated from: http://www.pixelwit.com/blog/2007/05/random-candy-colors/ */

package com.sd.semantic.utilities
{
  /**
   * Generates a series of colors from a sweet range of hues.
   */
  public class ColorGenerator
  {
    /** Generated colors */
    public var colors:Array;

    /**
     * Generates a series of color
     *  
     * @param numOfColors Number of colors to generate
     * @param minColorChannelVary Minimum channel
     * @param maxColorChannelVary Maximum channel
     * @param red Starting red color
     * @param green Starting green color
     * @param blue Starting blue color
     * 
     */
    public function ColorGenerator(numOfColors:int, minColorChannelVary:int = 5, maxColorChannelVary:int = 10,
      red:int = 100, green:int = 100, blue:int = 100):void
    {
      colors = [];

      /** Create an object to contain our 3 color channels (r, g, b). */
      var colorObject = {};

      /** Create the RGB channels and assign values to each of them. */
      colorObject.r = red;
      colorObject.g = green;
      colorObject.b = blue;

      for(var i = 0; i < numOfColors; i++)
      {
        colorObject = randomizeColor(colorObject, minColorChannelVary, maxColorChannelVary);
        colors.push(rgbToHex(colorObject));
      }
    }

    /** 
    * Goes through each color channel in a color object
    * and adds or subtracts a random number
    * between the min and max values
    * to each color channel.
    * Color channel values are limited between 0 and 255.
    */
    private function randomizeColor(colorObj:Object, min:int, max:int):Object
    {
      for(var i:Object in colorObj)
      {
        var chnl:int = colorObj[i];
        var ran:int = min + Math.random() * (max - min);
        chnl += (Math.round(Math.random()) ? ran : -ran);
        colorObj[i] = Math.max(0, Math.min(chnl, 255))
      }

      return colorObj;
    }

    /** 
    * Converts 3 color channels in the color object to
    * one hexadecimal value like 0xFFFFFF.
    */
    private function rgbToHex(colorObj:Object):Object
    {
      return (getARGB((colorObj.r << 16 | colorObj.g << 8 | colorObj.b), 0xFF));
    }

    private function getARGB(rgb:uint, newAlpha:uint):uint
    {
      /** newAlpha has to be in the 0 to 255 range */
      var argb:uint = 0;
      argb += (newAlpha << 24);
      argb += (rgb);

      return argb;
    }
  }
}