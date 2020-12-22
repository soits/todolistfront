import Vue from 'vue'
import axios from 'axios'
import _find from 'lodash/find'
import _assign from 'lodash/assign'
import _cloneDeep from 'lodash/cloneDeep'
import _findIndex from 'lodash/findIndex'
import _forEachRight from 'lodash/forEachRight'

export default {
  namespaced: true,
  // data
  state: () => ({
    db: null,
    todos: [],
    filter: 'all'
  }),
  // computed
  getters: {
    filteredTodos (state) {
      switch (state.filter) {
        case 'all':
        default:
          return state.todos
        case 'active': // 해야 할 항목
          return state.todos.filter(todo => !todo.data.done)
        case 'completed': // 완료된 항목
          return state.todos.filter(todo => todo.data.done)
      }
    },
    total (state) {
      return state.todos.length
    },
    activeCount (state) {
      return state.todos.filter(todo => !todo.data.done).length
    },
    completedCount (state, getters) {
      return getters.total - getters.activeCount
    }
  },
  mutations: {
    assignDB (state, db) {
      state.db = db
    },
    updateDB (state, { todo, value }) {
      state.db
        .get('todos')
        .find({ id: todo.id })
        .assign(value)
        .write()
    },
    deleteDB (state, todo) {
      state.db
        .get('todos')
        .remove({ id: todo.id })
        .write()
    },
    assignTodos (state, todos) {
      state.todos = todos
    },
    pushTodo (state, newTodo) {
      state.todos.push(newTodo)
    },
    assignTodo (state, { foundTodo, savedTodo }) {
      _assign(foundTodo, savedTodo)
    },
    deleteTodo (state, foundIndex) {
      Vue.delete(state.todos, foundIndex) // vue api
    },
    updateFilter (state, filter) {
      state.filter = filter
    }
  },
  actions: {
    async initDB ({ state, commit }) {
      // {
      //     "data": {
      //         "id": 1,
      //         "title": "NEWNEWWW",
      //         "done": true
      //     },
      //     "errors": []
      // },
      try {
        const response = await axios.get('http://192.168.62.45:5000/todo');
        // console.log(response.data)
        if(response) {
          commit('assignTodos', _cloneDeep(response.data))
        }
      } catch(error) {
        console.log(error)
      }
    },
    async createTodo ({ state, commit }, title) {
      const newTodo = {
        title,
        done: false
      }
      try {
        const savedTodo = await axios.post('http://192.168.62.45:5000/todo', newTodo);
        // Create Client Data
        console.log(savedTodo)
        
        commit('pushTodo', savedTodo.data);
      } catch(error) {
        console.log(error)
      }

    },
    async updateTodo ({ state, commit }, { todo, value }) {
      // Update DB Data
      const updatedTodo = { ...todo.data, ...value }

      try {
        const savedTodo = await axios.put('http://192.168.62.45:5000/todo', updatedTodo)
        
        console.log(savedTodo)
        // lodash 문법 사용
        const foundTodo = state.todos.find(element => element.data.id === savedTodo.data.data.id)
        commit('assignTodo', { foundTodo, savedTodo: savedTodo.data })
      } catch(error) {
        console.log(error)
      }
    },
    async deleteTodo ({ state, commit }, todo) {
      // Delete DB
      console.log(todo)
      try {
        const response = await axios.delete('http://192.168.62.45:5000/todo/' + todo.data.id, todo.data)
        console.log(response)
        if(response.data.status === 'OK') {
          const isSame = (element) => element.data.id === todo.data.id
          const foundIndex = state.todos.findIndex(isSame)

          console.log('delete index', foundIndex)
          // Delete Clent
          commit('deleteTodo', foundIndex)
        }
      } catch(error) {
        console.log(error)
      }      
    },
    completeAll ({ state, commit, dispatch }, checked) {
      state.todos.forEach(todo => {
        dispatch('updateTodo', { 
          todo,
          value: { done: checked }
        })
      })
    },
    clearCompleted ({ state, dispatch }) {
      _forEachRight(state.todos, todo => {
        if (todo.data.done) {
          dispatch('deleteTodo', todo)
        }
      })
    }

  }
}
