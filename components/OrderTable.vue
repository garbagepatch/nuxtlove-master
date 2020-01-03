<template>
  <v-card>
    <v-data-table
      :headers="headers"
      :items="orders"
      :sort-by="sortBy"
      :sort-desc="sortDesc"
      :items-per-page="10"
      class="elevation-1"
    />
  </v-card>
</template>

<script>
import axios from 'axios'
export default {
  name: 'OrderTable',
  data () {
    return {
      input: {
        Email: '',
        FilterTypes: {
          Type: ''
        },
        FilterSizes: {
          Size: ''
        },
        ControllerTypes: {
          controllerTypes: ''
        },
        EarlyDue: '',
        FinalDue: '',
        Description: ''

      },
      response: ''
    }
  },
  mounted () {
      axios{()}
  },
  methods: {}

}
</script>

<style scoped>

</style>
