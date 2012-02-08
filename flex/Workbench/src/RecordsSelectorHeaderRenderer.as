package
{
  import com.esria.samples.dashboard.managers.PodLayoutManager;
  import com.esria.samples.dashboard.view.Pod;
  import com.sd.semantic.components.sControl;
  import com.sd.semantic.core.*;
  import com.sd.semantic.utilities.SemanticUtils;
  import com.visualempathy.extensions.panel.SuperPanelPlus;
  
  import events.IndicatorEvent;
  
  import flash.events.*;
  import flash.ui.*;
  
  import mx.controls.CheckBox;
  import mx.controls.DataGrid;
  import mx.controls.dataGridClasses.DataGridColumn;
  import mx.controls.dataGridClasses.DataGridListData;
  import mx.events.DataGridEvent;
  import mx.events.DragEvent;

  /**
   * Item renderer to render checkboxes in the header of each datagrid column.
   *  
   * @author Frederick Giasson, Structured Dynamics LLC.
   * 
   */
  public class RecordsSelectorHeaderRenderer extends CheckBox
  {
    public var dataField:String;    
    
    /**
     * Constructor 
     */
    public function RecordsSelectorHeaderRenderer()
    {
      super();

      this.setStyle("paddingLeft", "5");
    }

    private var _data:DataGridColumn;

    /** datagrid column */
    override public function get data():Object
    {
      return _data;
    }

    override public function set data(value:Object):void
    {
      _data = value as DataGridColumn;
      label = DataGridListData(listData).label;
      DataGrid(listData.owner).addEventListener(DataGridEvent.HEADER_RELEASE, sortEventHandler);
      selected = (data.getStyle("plainText") == true);

      if(value.headerRenderer)
      {
        if(value.headerRenderer.properties.dataField.isSelected)
        {
          selected = true;
//          data.setStyle("plainText", true);
        }
      }
      
      /** If this indicator is already selected, we have to re-check it in the refresh of the datagrid */
      if(_data.indicatorAttribute && this.document.selectedIndicators.indexOf(_data.indicatorAttribute.uri) != -1)
      {
        selected = true;
      }     
    }

    /** Handler for a sort event on the column */
    private function sortEventHandler(event:DataGridEvent):void
    {
      if(event.itemRenderer == this)
      {
        event.preventDefault();
      }
    }

    /** Handler for a click event on the column */
    override protected function clickHandler(event:MouseEvent):void
    {
      super.clickHandler(event);

      var panelId:String = "panel_" + this.data.indicatorAttribute.uri;
      var indicatorControlId:String = "indicator_" + this.data.indicatorAttribute.uri;

      if(selected)
      {
        /** Show the sticky comparison chart */
        var nonIndicator:Object = SemanticUtils.getChildById("stickyComparisonPanel", this.document);

        if(nonIndicator && this.document.stickyResultset && this.document.stickyResultset.subjects.length > 0)
        {
          nonIndicator.visible = true;
          nonIndicator.alpha = 1;
          nonIndicator.includeInLayout = true;
        }

        data.setStyle("plainText", true);

        /** Create a new panel for this indicator */
        var targetPanel:Pod =
          SemanticUtils.getChildById(panelId, this.document.workbenchCanvas) as Pod;

        /** Keep a reference on this selected indicator */
        this.document.selectedIndicators.push(this.data.indicatorAttribute.uri);

        if(targetPanel == null)
        {
//          panel.addEventListener(MouseEvent.MOUSE_OVER, notifyIndicatorOverHandler);

          /** Create the indicator widget */
          var semanticControl:sControl = new sControl();

          /** Initialize the semantic control */
          semanticControl.id = indicatorControlId;
          semanticControl.percentWidth = 100;
          semanticControl.percentHeight = 100;
          semanticControl.targetAttributes = new Array(this.data.indicatorAttribute.uri);
          semanticControl.targetTypes = new Array();
          semanticControl.semanticDataProvider = null;
          semanticControl.schema = this.document.schema;

          /** Enable drag-and-drop on the component */
          semanticControl.addEventListener(DragEvent.DRAG_ENTER, this.document.dragAcceptHandler);
          semanticControl.addEventListener(DragEvent.DRAG_DROP, this.document.dragDropHandler);           
          
          /** Define a new contextual menu to use for this pod. We use it to rename the title of the pod */
          var menuItemRenameTitle:ContextMenuItem = new ContextMenuItem("Rename title...");
          
          menuItemRenameTitle.addEventListener(ContextMenuEvent.MENU_ITEM_SELECT, this.document.renamePodTitle);
          
          var customContextMenu:ContextMenu = new ContextMenu();
          
          /** Hide the default Flash menu items */
          customContextMenu.hideBuiltInItems();
          customContextMenu.customItems.push(menuItemRenameTitle);
          
          /** Add the new pod to the Dashboar */          
          this.document.dashboard.addPod(panelId, event.target.data.dataField + " indicator", semanticControl, 
                                         false, customContextMenu);  

          /** Initialize the indicator tool with the selected data */
          var records:Array = new Array();

          /** Get the description of the selected record(s) */
          for each(var recordIndice:int in this.document.recordsDataGrid.selectedIndices)
          {
            var record:Subject = this.document.filteringResultset.getSubjectByURI(
              this.document.recordsUriById[this.document.recordsDataGrid.dataProvider[recordIndice].id]);

            /** 
             * If the record is not found in the filteringResultset array, we have to check in the selected
             * selectionsResultset one.
             */
            if(record == null)
            {
              record = this.document.selectionsResultset.getSubjectByURI(
                this.document.recordsUriById[this.document.recordsDataGrid.dataProvider[recordIndice].id]);
            }

            /** 
            * Check if an indicator is selected, if so, we feed the record description to the dataProvider 
            * of the indicator 
            */
            if(record != null)
            {
              records.push(record);
            }
          }

          semanticControl.semanticDataProvider = new Resultset(records);

          /** Use this new indicator to display in the comparison chart */
          dispatchEvent(new IndicatorEvent(IndicatorEvent.INDICATOR_OVER, this.data.indicatorAttribute.uri, true,
            false));
        }
        else
        {
          targetPanel.alpha = 1;
          targetPanel.visible = true;
          targetPanel.includeInLayout = true;
        }
      }
      else
      {
        /** Hide the sticky comparison chart only if no other indicators are used in the workbench */
        var nonIndicator:Object = SemanticUtils.getChildById("stickyComparisonPanel", this.document);

        if(nonIndicator && this.document.selectedIndicators.length < 2)
        {
          nonIndicator.visible = false;
          nonIndicator.alpha = 0;
          nonIndicator.includeInLayout = false;
        }

        data.setStyle("plainText", false);
        
        /** Make sure we remove the reference to a possible checked column from a loaded session */
        data.headerRenderer.properties.dataField.isSelected = false;

        /** Remove the panel for this indicator */
        var targetPanel:Pod =
          SemanticUtils.getChildById(panelId, this.document.workbenchCanvas) as Pod;

        /** Remove the reference to this selected indicator */
        this.document.selectedIndicators.splice(
          this.document.selectedIndicators.indexOf(this.data.indicatorAttribute.uri), 1);

        this.document.dashboard.removePod(targetPanel);
        
        return;                
      }

      DataGrid(listData.owner).invalidateList();
    }

    /**
    * Notify that a mouse over event happened over the indicator panel.
    * 
    * @param event Mouse over event
    */
    private function notifyIndicatorOverHandler(event:MouseEvent):void
    {
      dispatchEvent(new IndicatorEvent(IndicatorEvent.INDICATOR_OVER, this.data.indicatorAttribute.uri, true, false));
    }

    /** Hide panel event handler  */
    private function hidePanelHandler(event:Event):void
    {      
      /** Hide the sticky comparison chart only if no other indicators are used in the workbench */
      var nonIndicator:Object = SemanticUtils.getChildById("stickyComparisonPanel", this.document);

      if(nonIndicator && this.document.selectedIndicators.length < 2)
      {
        nonIndicator.visible = false;
        nonIndicator.alpha = 0;
        nonIndicator.includeInLayout = false;
      }

      /** Remove the reference to this selected indicator */
      this.document.selectedIndicators.splice(this.document.selectedIndicators.indexOf(event.target.id.replace("panel_",
        "indicator_")), 1);

      data.setStyle("plainText", false);

      event.target.alpha = 0;
      event.target.visible = false;
      event.target.includeInLayout = false;

      this.selected = false;
    }
  }
}