<!--
 Encapsulation:
  table, table attribute/tuple operations
  user interactions

 Separation:
  table styles, views, data

 Exposure:
  table attribute/tuple interfaces
-->
<template>
  <!-- the children components/objects of DbTable components -->
  <!-- access during evaluation -->
  <div>
    <el-table :data="table" :row-class-name="({row, rowIndex}) => { return row.class }">

      <el-table-column v-if="selection" type="selection" align="center"></el-table-column>
      <el-table-column v-if="index" type="index" label="序号" align="center"></el-table-column>
      <el-table-column
        v-for="item in getCols-"
        :label="item.name"
        :prop="item.prop"
        align="center">
      </el-table-column>
      <el-table-column label="操作">
      </el-table-column>
    </el-table>

    <div v-if="pages.multiple">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="page.total"
        @current-change="handlePage">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { TableColumn, Table, Pagination } from 'element-ui'
import ajax from '@/libs/http/ajax' // default export; single function
import axios from 'axios'

Vue.use(TableColumn)
Vue.use(Table)
Vue.use(Pagination)

/* private instance fields & methods */

export default {
  name: 'DbTable',
  /* register the structures of the components */
  components: {},
  /* public interfaces; constructor parameters */
  props: {
    /* behaviour parameters */
    /**
     * A list of column fields & names, from part of
     * the returning fields of the HTTP response body, mostly.
     * Furthermore, some of them need to be re-computed.
     *
     * [
     *  props: [String] // column fields
     *  names: [String] // column names
     * ]
     */
    columnNameField: {
      required: true,
      type: Object
    },
    /**
     * {
     *  src: '', // URL to get the table data
     *  multiple: true // enable mutiple pages
     * }
     */
    pages: {
      type: Object,
      default: {
        multiple: false
      }
    },
    /* view parameters */
    selection: Boolean,
    index: Boolean,
    rowClassName: Array,
    stripe: Boolean
    /* interaction parameters */
    /* animation parameters */
    /* plugin parameters etc. */
  },
  /* lifecycle hooks */
  created () {
    // code/program after created
    this.getPage()
  },
  // mounted on a DOM element
  mounted () {
    // defined prop
    if (this.stripe !== undefined) {
      this.addClassToRow() // add the class to the virtual DOM tree
    }
  },

  /* public instance methods */
  methods: {
    /* Behaviour */
    // creator
    /**
     * Get an array of a table data.
     * Ex:
     *  [{row}, {row}]
     *
     * @param pageNo {Number} page No.
     */
    async getPage (pageNo = 1) {
      const self = this

      // evaluation waitting
      const response = await axios.post('self.pages.src',
          {
            pageNo, // property name shorthand, object initializer
            pageSize: 10
          })


      ajax({
        method: 'POST',
        url: self.pages.src,
        data: {
          pageNo, // object initializer; shorthand property name
          pageSize: 10
        },
        success: (resBody) => {
          // async code/program

          self.table = resBody.entry
          self.page.total = resBody.count

          if (self.rowClassName !== undefined) self.handleRowClasses() // prop defined
        }
      })
    },
    // getter/observer
    /**
     * Query a sequence of attribute values of a table using a set of attribute names.
     * if there is no parameter names in the parameter list, throw an exception.
     * otherwise, return the part of the table using the set of attributes
     *
     * @param ...attrs {...String} attributes with an indefinite number
     * @return an object {attr: [attr_val...], attr1: [attr_val...]}
     */
    queryAttributes (...attrs) {
      // verify the attributes
      // array iteration
      const self = this

      attrs.forEach(attr => {
        let exist = false
        self.colNameField.forEach(field => {
          if (attr === field.prop) exist = true
        })
        // precondition: all items of the list are iterated
        // loop universe idiom
        if (!exist) {
          console.error(`The attribute ${attr} is not existed.`, 'DbTable.vue')
          return false
        }
      })

      const obj = {}
      // reset parameter iteration
      attrs.forEach(attr => {
        obj[attr] = []

        self.table.forEach(item => {
          obj[attr].push(item[attr])
        })
      })

      return obj
    },
    /**
     * Query a sequence of tuples of a table using a set of row IDs.
     *
     * @param ...rowIDs {...Number} IDs with an indefinite number
     * @return an array [{attr: val, attr1: val1, ...}, {...}]
     */
    queryTuples (...rowIndices) {
      // loop existence idiom
      rowIndices.forEach(i => {
        if (i < 0 || i > this.table.length - 1) {
          console.error(`The row ${i} is not existed.`, 'DbTable.vue')
          return false
        }
      })

      const arr = []

      for (let i = 0; i < rowIndices.length; i++) {
        const row = this.table[rowIndices[i]]
        arr.push(row)
      }

      return arr
    },
    /**
     * Query tables using the serial number of a table
     *
     * @return an array of all row data
     */
    queryTable () {
      // reset parameter array
      return this.table
    },
    // setter/mutator
    /**
     * Set a sequence of attribute names associated with their vales.
     * All attribute must be given a value(defined).
     * If the attribute doesn't exist in the table, then insert it.
     * Ex:
     *  Attributes: {name: ['Alex', 'Adam'], size: [...]}
     *  TableData: [{name: '', size: ''}, {...}]
     *
     * @param {...attr} {...Object} an object with an indefinite number of column attributes
     * @return a new table data
     */
    setAttributes ({...attrs}) {
      // rest param object iteration

      // data verification
      // the length of the rows must be a valid range
      for (const key in attrs) {
        const arr = attrs[key]

        if (arr.length > this.table.length) {
          try {
            throw new RangeError('The length of attribute values is out of range', 'DbTable.vue')
          } catch (e) {
            console.error(e.name, e.message)
          }
        }
      }

      for (const key in attrs) {
        // get each array of the object
        const attr = attrs[key]

        for (let i = 0; i < attr.length; i++) {
          this.table[i][key] = attr[i]
        }
      }

      return this.table
    },
    /**
     * Insert or update a list of a table rows using their indices.
     * All rows must be given a value.
     * If the value doesn't exist in the table, then insert it.
     * Ex:
     *  A widely used interface for inserting or updating a row;
     *  A simple but adequate operation for the client to manipulate the table data
     *
     *  Tuple: {index: 0, row: {ID: 100, name: 'Violate'}}
     *  Tuple: {index: 10, row: {ID: 100, name: 'Alex'}}
     *  Tuple: {index: 11, row: {ID: 100, [name: null]}} a default value null is given if the attribute is not set
     *
     * @param {index, row} {Object} a row at a specified index, associated with its value
     * @return a new table data
     */
    setTuple ({index, row}) {
      // parameter verification
      if (index < 0) {
        try {
          throw new RangeError(`The row index ${index} must be a non-negative number.`)
        } catch (e) {
          console.error(e.name, e.message)
        }
      }

      const tableData = this.table

      if (index > tableData.length - 1) {
        const obj = {}
        for (const key in tableData[0]) obj[key] = null
        tableData[index] = obj
      }

      // {index: 0, row: {ID: 0, name: ''}}
      // {index: 10, row: {ID: null, name: null}}
      if (index >= 0 && index <= tableData.length) {
        for (const key in row) {
          tableData[index][key] = row[key]
        }
      }

      return this.table
    },
    /**
     * Delete the attribute(s) from the table data.
     * Ex:
     *  ['id']
     *  ['id', 'name']
     *
     * @param attr {...String}  a list of attributes to be removed, from the table data
     * @return a new table with the attributes removed
     */
    deleteAttributes (...attrs) {
      // parameter verification
      // loop and a half; existence justification
      // loop and plus-by-one; universe justification
      const fields = this.table[0]
      let table = this.table

      // ['id', 'name']
      // [{id, 0, name: ''}]
      attrs.forEach(attr => {
        if (!fields.hasOwnProperty(attr)) {
          try {
            throw new ReferenceError(`The attribute ${attr} is not existed in the columns of the table data`)
          } catch (e) {
            console.error(e.name, e.message)
          }
        }
      })

      // [{id: }, {id: }] => {id: }
      // ['id', 'name']
      // Vue cannot detect property addition and deletion
      attrs.forEach(attr => {
        table.forEach(row => {
          delete row[attr]
        })
      })

      return table
    },
    /**
     * Delete the tuple(s) from the table data.
     * Ex:
     *  Row indices: [1, 3]
     *
     * @param rowIndices {...Number} a list of row indices
     * @return a new table with the rows removed
     */
    deleteTuples (...rowIndices) {
      // parameter verification
      rowIndices.forEach(i => {
        if (i < 0 || i > this.table.length - 1) {
          try {
            throw new RangeError(`The index ${i} isn't existed in the table.`)
          } catch (e) {
            console.error(e.name, e.message)
          }
        }
      })

      const table = this.table
      const arr = []

      // [{}, {}, {}]
      // [2, 3]
      // loop & element concatenation; producer
      table.forEach((row, index) => {
        if (!rowIndices.includes(index)) {
          arr.push(row)
        }
      })

      return this.table = arr
    },
    // user interactions
    handlePage (pageNo) {
      this.getPage(pageNo)
    },
    // helper methods
    handleRowClasses () {
      // row classes: ['row', 'row1']
      // table: [{}, {}, {}]
      // parameter verification
      if (this.rowClassName.length === 0) {
        try {
          throw new RangeError('The array cannot be empty.')
        } catch (e) {
          console.error(e.name, e.message)
        }
      }

      const table = this.table
      const rowClasses = this.rowClassName

      table.forEach((row, index) => {
        if (rowClasses[index]) row['class'] = rowClasses[index]
      })
    },
    // add class name to the respective rows
    // precondition: the HTML elements are mounted
    addClassToRow () {
      const rows = document.querySelectorAll('.el-table__row')

      rows.forEach((row, index) => {
        if (index % 2 !== 0) row.className = 'el-table__row striped'
      })
    }
  },
  /* template expressions */
  computed: {
    getCols () { // a function to be called; when the property(s) is mutated; props, data properties
      const props = this.columnNameField.prop // event source: when the object is accessed/mutated
      const names = this.columnNameField.name
      const arr = []

      if (props) { // the object exists
        // create a list of objects; compound values
        for (let i = 0; i < props.length; i++) {
          arr.push({ // compounds, mutable values
            prop: props[i],
            name: names[i]
          })

          // arr.push(tmp) add the same object, twice
          // add the two different objects
        }
      }

      return this.colNameField = arr
    }
  },
  /* watch data changes */
  /*
   * iterate & read the properties(dependency-tracking);
   * as event sources
   * listen props interfaces(change-notification)
   */
  watch: {
    tableData: function () { // a function to be called; when the property is accessed/mutated
    }
  },
  /* public instance fields */
  data () {
    /* init the component fields */

    /* public ins fields */
    return {
      /* access data to init the component */
      colNameField: [],
      table: [],
      page: {
        size: 10,
        No: 1,
        total: 10
      }
    }
  }
}
</script>

<!-- Mix the global & local component styles -->
<style>
</style>
<style scoped>
  /* DbTable component views */
  /* layout */

  /* size */

  /* color */
  .striped {
    background-color: #fafafa;
  }

  /* animation etc. */

</style>
