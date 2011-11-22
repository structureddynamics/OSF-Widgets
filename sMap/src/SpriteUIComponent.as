package
{
  import mx.core.UIComponent;
  import flash.display.Sprite;

  /**
   * Simple class wrapper to embed sprites in flex components.
   * 
   * @author Frederick Giasson, Structured Dynamics LLC.
   * 
   */
  public class SpriteUIComponent extends UIComponent
  {
    public function SpriteUIComponent(sprite:Sprite):void
    {
      super();

      explicitHeight = sprite.height;
      explicitWidth = sprite.width;

      addChild(sprite);
    }
  }
}