<template>
  <Head :nav-menu="navMenu" @open-navbar="navMenu = !navMenu" />

  <Navbar
    :thoughts="thoughts"
    :nav-menu="navMenu"
    :savedLength="savedThoughtsLength"
    @close-navbar="navMenu = false"
    @new-thought="newThought"
  />

  <transition name="fade">
      <div v-if="view === 'welcome'" class="welcomeBox">
        <p class="welcomeTitle">Welcome to Thoughts App</p>
        <p class="subtext">Write what’s on your mind. Save it for later.</p>
        <button @click="newThought">+ New Thought</button>
      </div>
  </transition>

  <transition name="fade">
      <List
        v-if="view === 'list'"
        :thoughts="thoughts"
        :list="true"
        @open-thought="openThought"
        @remove-thought="deleteAlert"
      />
  </transition>

  <transition name="fade">
      <ThoughtBox
        v-if="view === 'thoughtBox'"
        v-model:title="title"
        v-model:message="message"
        :open-thought-box="true"
        :is-new-thought="isNewThought"
        :msg-length="msgLength"
        :warning-title="warningTitle"
        :content-title="contentTitle"
        @save-thought="saveThought"
      />
  </transition>

  <Deletion
    :deletion-alert="deletionAlert"
    :delete-thought="deleteThought"
    @cancel-deletion="cancelDeletion"
    @delete-thought="removeThought"
  />

  <transition name="fade">
      <button v-if="view !== 'thoughtBox'" @click="newThought" class="circleBtn">
        <i class="bi bi-plus"></i>
      </button>
  </transition>
</template>

<script>
import Deletion from './components/Deletion.vue'
import Head from './components/Head.vue'
import List from './components/List.vue'
import Navbar from './components/Navbar.vue'
import ThoughtBox from './components/ThoughtBox.vue'

export default {
  name: 'App',
  components: {
    Head,
    Navbar,
    ThoughtBox,
    List,
    Deletion
  },
  data() {
    return {
      title: '',
      message: '',
      warningTitle: false,
      isNewThought: false,
      navMenu: false,
      deletionAlert: false,
      deleteThought: null,
      thoughts: [],
      view: 'welcome',
      editingId: null,
      contentTitle: null
    }
  },
  computed: {
    msgLength() {
      return (this.message || '').length
    },
    savedThoughtsLength() {
      return this.thoughts.length
    }
  },
  methods: {
    safeLoad(key, fallback) {
      try {
        const raw = localStorage.getItem(key)
        if (!raw) return fallback
        const parsed = JSON.parse(raw)
        return parsed || fallback
      } catch (e) {
        console.warn('safeLoad failed for', key, e)
        return fallback
      }
    },

    saveThought() {
      const trimmedTitle = (this.title || '').trim()
      const trimmedMessage = (this.message || '').trim()

      if (!trimmedTitle) {
        this.warningTitle = true
        return
      }

      if (this.editingId) {
        const idx = this.thoughts.findIndex(t => String(t.id) === String(this.editingId))
        if (idx !== -1) {
          this.thoughts[idx].title = trimmedTitle
          this.thoughts[idx].thought = trimmedMessage
          this.thoughts[idx].updated_at = new Date().toLocaleString()
        }
      } else {
        const newThought = {
          id: Date.now(),
          title: trimmedTitle,
          thought: trimmedMessage,
          created_at: new Date().toLocaleString()
        }
        this.thoughts.push(newThought)
      }

      localStorage.setItem('thoughtsList', JSON.stringify(this.thoughts))

      this.title = ''
      this.message = ''
      this.warningTitle = false
      this.editingId = null
      this.contentTitle = null
      this.isNewThought = false

      this.view = this.thoughts.length > 0 ? 'list' : 'welcome'

      history.replaceState({ current: this.view }, '')
    },

    openThought(indexOrId) {
      let idx = -1
      if (typeof indexOrId === 'number') {
        idx = indexOrId
      } else {
        idx = this.thoughts.findIndex(t => String(t.id) === String(indexOrId))
      }

      if (idx < 0 || !this.thoughts[idx]) {
        console.warn('openThought: invalid index/id', indexOrId)
        return
      }

      const t = this.thoughts[idx]
      this.title = t.title
      this.message = t.thought
      this.contentTitle = t.title
      this.isNewThought = false
      this.editingId = t.id
      this.view = 'thoughtBox'

      history.pushState({ current: 'ThoughtBox', id: t.id }, '')
    },

    newThought() {
      this.title = ''
      this.message = ''
      this.contentTitle = null
      this.isNewThought = true
      this.editingId = null
      this.view = 'thoughtBox'
      this.navMenu = false

      history.pushState({ current: 'NewThought' }, '')
    },

    deleteAlert(indexOrId) {
      let idx = -1
      if (typeof indexOrId === 'number') idx = indexOrId
      else idx = this.thoughts.findIndex(t => String(t.id) === String(indexOrId))

      if (idx < 0 || !this.thoughts[idx]) {
        console.warn('deleteAlert: invalid index/id', indexOrId)
        return
      }

      const t = this.thoughts[idx]
      this.deletionAlert = true
      this.deleteThought = t.title

      sessionStorage.setItem('deleteThisId', String(t.id))
    },

    cancelDeletion() {
      this.deletionAlert = false
      sessionStorage.removeItem('deleteThisId')
    },

    removeThought() {
      const deleteId = sessionStorage.getItem('deleteThisId')
      if (!deleteId) return

      const idx = this.thoughts.findIndex(t => String(t.id) === String(deleteId))
      if (idx === -1) {
        this.deletionAlert = false
        sessionStorage.removeItem('deleteThisId')
        return
      }

      this.thoughts.splice(idx, 1)
      localStorage.setItem('thoughtsList', JSON.stringify(this.thoughts))

      if (String(this.editingId) === String(deleteId)) {
        this.editingId = null
        this.title = ''
        this.message = ''
        this.contentTitle = null
      }

      this.deletionAlert = false
      sessionStorage.removeItem('deleteThisId')

      this.view = this.thoughts.length === 0 ? 'welcome' : 'list'
      history.replaceState({ current: this.view }, '')
    }
  },
  watch: {
    title(value) {
      this.warningTitle = (value || '').trim().length >= 20
    }
  },
  created() {
    this.thoughts = this.safeLoad('thoughtsList', [])
    this.view = this.thoughts.length > 0 ? 'list' : 'welcome'
  },
  mounted() {
    history.replaceState({ current: this.view }, '')

    this._onPopState = (event) => {
      const state = event.state || {}
      if (state.current === 'ThoughtBox' && state.id) {
        const idx = this.thoughts.findIndex(t => String(t.id) === String(state.id))
        if (idx !== -1) {
          const t = this.thoughts[idx]
          this.title = t.title
          this.message = t.thought
          this.contentTitle = t.title
          this.isNewThought = false
          this.editingId = t.id
          this.view = 'thoughtBox'
          return
        } else {
          this.view = this.thoughts.length > 0 ? 'list' : 'welcome'
          return
        }
      } else if (state.current === 'NewThought') {
        this.title = ''
        this.message = ''
        this.contentTitle = null
        this.isNewThought = true
        this.editingId = null
        this.view = 'thoughtBox'
        return
      } else {
        this.title = ''
        this.message = ''
        this.contentTitle = null
        this.isNewThought = false
        this.editingId = null
        this.view = this.thoughts.length > 0 ? 'list' : 'welcome'
        return
      }
    }

    window.addEventListener('popstate', this._onPopState)
  },
  beforeUnmount() {
    if (this._onPopState) {
      window.removeEventListener('popstate', this._onPopState)
    }
  }
}
</script>