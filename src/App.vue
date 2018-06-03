<template>
  <div id="app">
    <message-toggle />
    <list :items="['list item 1', 'listen item 2']" />
    <db-table ref="table"
              :column-name-field="{ prop: ['id', 'name'], name: ['供应商ID', '供应商名称']}"
              :pages="{src: pageSrc, multiple: true}"
              selection
              :row-class-name="['row-1', 'row-2']"
              index
              stripe>
    </db-table>  </div>
</template>

<script>
import MessageToggle from '@/components/MessageToggle.vue'
import List from '@/components/List.vue'
import DbTable from '@/components/DbTable'

export default {
  name: 'App',
  components: {
    MessageToggle,
    List,
    DbTable
  },
  data() { // shorthand method definition; object initializer; ES6
      return {};
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  color: #2c3e50;
}
</style>
