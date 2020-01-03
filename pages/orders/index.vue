<template>
  <v-card light>
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Search"

        hide-details
      />
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="orders"
      :sort-by="sortBy"
      :sort-desc="sortDesc"
      :items-per-page="10"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Orders</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          />
          <v-spacer />
          <v-dialog v-model="createDialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" color="primary" dark class="mb-2">
                New Order
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.Email" label="Email" />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-menu
                        ref="menu2"
                        v-model="menu2"
                        :close-on-content-click="false"
                        :return-value.sync="editedItem.EarlyDue"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field v-model="editedItem.EarlyDue" v-on="on" label="Early Due" prepend-icon="event" readonly />
                        </template>
                        <v-date-picker v-model="editedItem.EarlyDue" no-title scrollable>
                          <v-spacer />
                          <v-btn @click="menu2=false" text color="primary">
                            Cancel
                          </v-btn>
                          <v-btn @click="$refs.menu2.save(editedItem.EarlyDue)" text color="primary">
                            OK
                          </v-btn>
                        </v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-menu
                        ref="menu"
                        v-model="menu"
                        :close-on-content-click="false"
                        :return-value.sync="editedItem.FinalDue"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field v-model="editedItem.FinalDue" v-on="on" label="Final Due" prepend-icon="event" readonly />
                        </template>
                        <v-date-picker v-model="editedItem.FinalDue" no-title scrollable>
                          <v-spacer />
                          <v-btn @click="menu=false" text color="primary">
                            Cancel
                          </v-btn>
                          <v-btn @click="$refs.menu.save(editedItem.FinalDue)" text color="primary">
                            OK
                          </v-btn>
                        </v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.Description" label="Description" />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.Status" label="Status" />
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer />
                <v-btn @click="close" color="blue darken-1" text>
                  Cancel
                </v-btn>
                <v-btn @click="save" color="blue darken-1" text>
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon
          @click="editItem(item)"
          small
          class="mr-2"
        >
          edit
        </v-icon>
        <v-icon
          @click="deleteItem(item)"
          small
        >
          delete
        </v-icon>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import axios from 'axios'
import ordersQuery from '~/apollo/orders/orders'
import createOrder from '~/apollo/orders/createOrder'
export default {
  data () {
    return {
      // Initialize an empty orders variabkle
      orders: [],
      postbody: [

      ],
      createDialog: false,
      sortBy: 'id',
      sortDesc: false,
      query: '',
      menu: false,
      menu2: false,
      mutation: '',
      search: '',
      headers: [
        { value: 'id', text: 'ID', sortable: true },
        {
          sortable: false
        },
        { value: 'filtertype.type', text: 'Filter Type', sortable: false },
        {
          value: 'controllertype.ControllerType',
          text: 'Controller Type',
          sortable: false
        },
        { value: 'EarlyDue', text: 'Earliest Due', sortable: true },
        {
          value: 'FinalDue',
          text: 'Final Due',
          sortable: true
        },
        { value: 'Email', text: 'Email', sortable: true },
        { value: 'Status', sortable: true, text: 'Status' },
        { value: 'actions', text: 'Actions' }
      ],
      editedIndex: -1,
      editedItem: {
        Email: '',
        EarlyDue: new Date().toISOString().substr(0, 10),
        FinalDue: new Date().toISOString().substr(0, 10),
        Description: '',
        FilterSize: '',
        FilterTypes: '',
        ControllerTypes: '',
        Status: 'Submitted'
      },
      defaultItem: {
        Email: '',
        EarlyDue: new Date().toISOString().substr(0, 10),
        FinalDue: new Date().toISOString().substr(0, 10),
        Description: '',
        FilterSize: '',
        FilterTypes: '',
        ControllerTypes: '',
        Status: 'Submitted'
      }
    }
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Order' : 'Edit Order'
    },

    // Search system
    filteredList () {
      return this.orders.filter((order) => {
        return order.id.toLowerCase().includes(this.query.toLowerCase())
      })
    }
  },
  watch: {
    createDialog (val) {
      val || this.close()
    }
  },
  apollo: {
    orders: {
      prefetch: true,
      query: ordersQuery,
      mutation: createOrder
    }
  },
  methods: {
    postPost () {
      axios
        .post('orders', {
          body: this.createDialog
        })
    },
    editItem (item) {
      this.editedIndex = this.orders.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.createDialog = true
    },

    deleteItem (item) {
      const index = this.orders.indexOf(item)
      confirm('Are you sure you want to delete this item?') && this.orders.splice(index, 1)
    },

    close () {
      this.createDialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.orders[this.editedIndex], this.editedItem)
      } else {
        this.orders.push(this.editedItem)
      }
      this.close()
    }
  }
}

</script>

<style scoped></style>
