<template>
    <div
        :class="{ done }"
        class="todo-item"
    >
        <div
            v-if="isEditMode"
            class="item__inner item--edit"
        >
            <input
                ref="titleInput"
                :value="editedTitle"
                type="text"
                @input="editedTitle = $event.target.value"
                @keypress.enter="editedTodo"
                @keypress.esc="offEditMode"
            />
            <div class="item__actions">
                <button
                    class="btn btn--primary"
                    key="complete"
                    @click="editedTodo">
                    <span class="material-icons">done</span>
                </button>
                <button
                    class="btn"
                    key="cancel"
                    @click="offEditMode">
                    <span class="material-icons">close</span>
                    </button>
            </div>
        </div>
        <div
            v-else
            class="item__inner item--normal"
        >
            <label>
              <input
                v-model="done"
                type="checkbox"
              />
              <span class="icon">
                <span class="material-icons">check</span>
              </span>
            </label>
            <div class="item__title-wrap">
                <div class="item__title">
                    {{ todo.data.title }}
                </div>
            </div>
            <div class="item__actions">
                <button
                    class="btn"
                    key="update"
                    @click="onEditMode">
                    <span class="material-icons">create</span>
                </button>
                <button
                    class="btn btn--danger"
                    key="delete"
                    @click="deleteTodo">
                    <span class="material-icons">delete</span>
                    </button>
            </div>
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  props: {
    todo: Object
  },
  data () {
    return {
      isEditMode: false, 
      editedTitle: ''
    }
  },
  computed: {
    done: {
      get () {
        return this.todo.data.done
      },
      set (done) {
        this.updateTodo({
          done
        })
      }
    },
  },
  methods: {
    editedTodo () {
      if (this.todo.data.title !== this.editedTitle) {
        this.updateTodo({
          title: this.editedTitle,
        })
      }

      this.offEditMode()
    },
    onEditMode () {
      this.isEditMode = true
      this.editedTitle = this.todo.data.title

      this.$nextTick(() => {
        this.$refs.titleInput.focus()
      })
    },
    offEditMode () {
      this.isEditMode = false
    },
    updateTodo (value) {
      console.log('update')
      this.$store.dispatch('todoApp/updateTodo', {
        todo: this.todo,
        value
      })
    },
    deleteTodo () {
      this.$store.dispatch('todoApp/deleteTodo', this.todo)
    }
  }
}
</script>
