/*
  Originally come from: http://labs.tom-lee.com/Flex/HighlighterDemo/srcview/index.html
*/

package org.tl.text
{
  import flash.events.MouseEvent;
  import flash.text.TextField;

  public class Finder
  {
    /**
    * The TextField to be searched.
    */
    private var textField:TextField;

    /**
    * The current starting index for searches. 
    */
    private var caratIndex:int;

    private var text:String;

    /**
    * Finds strings in a TextField.
    * 
    * @param textField The TextField to search.
    */
    public function Finder(textField:TextField, text:String)
    {
      this.caratIndex = 0;
      this.text = text;
      this.textField = textField;
      this.textField.addEventListener(MouseEvent.CLICK, setCarat, false, 1, true);
    }

/**
* Synchronizes the Finder's internal carat position with the TextField's carat position when the user manually sets it by clicking in the TextField.
*/
    public function setCarat(evt:MouseEvent):void
    {
      this.caratIndex = this.textField.caretIndex;
    }

    /**
    * Gets all indexes of a string in the TextField.
    * 
    * @param string The string to search for.
    * @return An array of all the indexes of the string. 
    */
    public function indexesOf(string:String):Array
    {
      var pos:int = 0;
      var r:Array = [];

      var txt:String = this.text;
      var len:int = string.length;

      do
      {
        if((pos = txt.indexOf(string, pos)) != -1)
        {
          r.push(pos);
        }

        else
        {
          break;
        }
      } while(pos += len);
      return r;
    }

    /**
    * Finds the first instance of a string after the Finder's current carat position.
    * 
    * @param string The string to search for.
    * @return The character index of the string.
    */
    public function findNext(string:String):int
    {
      var str:String = this.text;
      var len:int = string.length;
      var i:int = str.indexOf(string, this.caratIndex + len);

      if(i == -1)
      {
        this.caratIndex = 0;
        i = str.indexOf(string, this.caratIndex);
      }

      if(i == -1)
      {
        return -1;
      }

      this.caratIndex = i + 1;

      return i;
    }

    /**
    * Finds the first instance of a string before the Finder's current carat position.
    * 
    * @param string The string to search for.
    * @return The character index of the string.
    */
    public function findPrevious(string:String):int
    {
      if(this.caratIndex == 0)
      {
        this.caratIndex = this.text.length;
      }
      var txt:String = this.text;
      var str:String = txt.substring(0, this.caratIndex);
      var len:int = string.length;
      var i:int = str.lastIndexOf(string);

      if(i == -1)
      {
        this.caratIndex = txt.length;
        i = txt.lastIndexOf(string);
      }

      if(i == -1)
      {
        return -1;
      }

      this.caratIndex = i;

      return i;
    }
  }
}