<template>
    <div>
        <button @click="createTodo">
          <i class="material-icons">add</i>
        </button>
        <input
            :value="title"
            :placeholder="placeholder"
            @input="title = $event.target.value"
            @keypress.enter="createTodo"
            type="text" />
    </div>
</template>

<script>
export default {
  data () {
    return {
      title: '',
      placeholder: '할 일을 추가하세요!'
    }
  },
  methods: {
    async createTodo () {
      const validatedTitle = this.title && this.title.trim()
      if (!validatedTitle) {
        alert('유효하지 않은 제목입니다!')
        this.title = this.title.trim()
        return
      }

      await this.$store.dispatch('todoApp/createTodo', this.title)
      this.title = ''

      this.$nextTick(() => {
        window.scrollTo(0, document.body.scrollHeight)
      })
    }
  }
}
</script>
