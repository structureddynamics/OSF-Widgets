package eu.stefaner.relationbrowser.ui
{
  import eu.stefaner.relationbrowser.data.NodeData;
  
  import flare.animate.TransitionEvent;
  import flare.animate.Transitioner;
  import flare.util.Displays;
  import flare.vis.data.EdgeSprite;
  import flare.vis.data.NodeSprite;
  
  import flash.display.Sprite;
  import flash.events.Event;
  import flash.text.TextField;
  import flash.text.TextFormat;
  
  import flash.display.Bitmap;
  import flash.display.BitmapData;
  import flash.display.Loader;
  import flash.display.Sprite;
  import flash.events.*;
  import flash.geom.Point;
  import flash.geom.Rectangle;
  import flash.net.URLRequest;
  
  public class SpriteImage extends Sprite 
  {
    private var url:String = "";
    private var size:uint = 80;
    
    public function SpriteImage(url:String) {
      this.url = url;
      
      configureAssets();
    }
    
    private function configureAssets():void {
      var loader:Loader = new Loader();
      loader.contentLoaderInfo.addEventListener(Event.COMPLETE, completeHandler);
      loader.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, ioErrorHandler);
      
      var request:URLRequest = new URLRequest(url);
      loader.x = size * numChildren;
      loader.load(request);
      addChild(loader);
    }
    
    private function duplicateImage(original:Bitmap):Bitmap {
      var image:Bitmap = new Bitmap(original.bitmapData.clone());
      image.x = size * numChildren;
      addChild(image);
      return image;
    }
    
    private function completeHandler(event:Event):void {
      /** Center the image in the middle of the node */
      event.target.loader.x = -event.target.width / 2;
      event.target.loader.y = -event.target.height / 2;        
    }
    
    private function ioErrorHandler(event:IOErrorEvent):void {
      trace("Unable to load image: " + url);
    }
  }
}