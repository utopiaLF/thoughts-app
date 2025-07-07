<template>
    <Head :list="list" @open-navbar="list = !list"/>
    <Navbar :thoughts="thoughts" :list="list" :savedLength="savedThoughtsLength" @close-navbar="list = false" @new-thought="newThought" @open-thought="openThought" @remove-thought="removeThought"/>
    <div v-if="!openThoughtBox" class="welcomeBox">
        <p class="welcomeTitle">Welcome to Thoughts App</p>

        <p class="subtext">Write what’s on your mind. Save it for later.</p>

        <button @click="newThought">+ New Thought</button>
    </div>
    <ThoughtBox v-model:title="title" v-model:message="message" :open-thought-box="openThoughtBox" :is-new-thought="isNewThought" :msg-length="msgLength" :warning-title="warningTitle" @save-thought="saveThought"/>
</template>

<script>
import Head from './components/Head.vue'
import Navbar from './components/Navbar.vue'
import ThoughtBox from './components/ThoughtBox.vue'

export default {
    components: {
        Head,
        Navbar,
        ThoughtBox
    },
    data() {
        return {
            title: '',
            message: '',
            warningTitle: false,
            thoughts: [],
            list: false,
            isNewThought: false,
            openThoughtBox: false
        }
    },
    methods: {
        saveThought() {
            if(!this.title) {
                return alert("Don't forget to add a title.")
            }
            const newThought = {
                title: this.title,
                thought: this.message,
                created_at: new Date().toLocaleDateString()
            }

            this.thoughts.push(newThought)
            localStorage.setItem('thoughtsList', JSON.stringify(this.thoughts))

            this.title = ''
            this.message = ''
            this.list = true
            this.openThoughtBox = false
        },
        openThought(index) {
            this.title = this.thoughts[index].title
            this.message = this.thoughts[index].thought
            
            this.list = false
            this.openThoughtBox = true
            this.isNewThought = false
        },
        newThought() {
            this.title = ''
            this.message = ''
            this.list = false
            this.isNewThought = true
            this.openThoughtBox = true
        },
        removeThought(index) {
            this.thoughts.splice(index, 1)
            localStorage.setItem('thoughtsList', JSON.stringify(this.thoughts))
            this.openThoughtBox = false
        }
    },
    computed: {
        msgLength() {
            return this.message.length
        },
        savedThoughtsLength() {
            return this.thoughts.length
        }
    },
    watch: {
        title(value) {
            if(value.length >= 20) {
                return this.warningTitle = true
            }

            this.warningTitle = false
        }
    },
    mounted() {
        const saved = localStorage.getItem('thoughtsList')
        this.thoughts = JSON.parse(saved) || []
    }
}
</script>