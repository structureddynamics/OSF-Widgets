package
{
  import mx.controls.dataGridClasses.DataGridColumn;
  import com.sd.semantic.core.SchemaAttribute;

  /**
   * Custom datagrid column used to render the datagrid (record selector) columns. 
   * @author Frederick Giasson, Structured Dynamics LLC.
   * 
   */
  public class DataGridIndicatorColumn extends DataGridColumn
  {
    /** Indicator attribute bound to the column. */
    public var indicatorAttribute:SchemaAttribute = null;
    
    /**
     * Constructor 
     * @param columnName Name of the column to display in the header
     * 
     */
    public function DataGridIndicatorColumn(columnName:String):void
    {
      super(columnName);
    }
  }
}