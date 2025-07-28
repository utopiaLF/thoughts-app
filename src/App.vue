<template>
    <Head :nav-menu="navMenu" @open-navbar="navMenu = !navMenu"/>
    <Navbar :thoughts="thoughts" :nav-menu="navMenu" :savedLength="savedThoughtsLength" @close-navbar="navMenu = false" @new-thought="newThought"/>
    <div v-if="welcome" class="welcomeBox">
        <p class="welcomeTitle">Welcome to Thoughts App</p>

        <p class="subtext">Write what’s on your mind. Save it for later.</p>

        <button @click="newThought">+ New Thought</button>
    </div>
    <List :thoughts="thoughts" :list="list" @open-thought="openThought" @remove-thought="deleteAlert"/>
    <ThoughtBox v-model:title="title" v-model:message="message" :open-thought-box="openThoughtBox" :is-new-thought="isNewThought" :msg-length="msgLength" :warning-title="warningTitle" :content-title="contentTitle" @save-thought="saveThought"/>
    <Deletion :deletion-alert="deletionAlert" :delete-thought="deleteThought" @cancel-deletion="cancelDeletion" @delete-thought="removeThought"/>
    <button v-if="!openThoughtBox" @click="newThought" class="circleBtn"><i class="bi bi-plus"></i></button>
</template>

<script>
import Deletion from './components/Deletion.vue'
import Head from './components/Head.vue'
import List from './components/List.vue'
import Navbar from './components/Navbar.vue'
import ThoughtBox from './components/ThoughtBox.vue'

export default {
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
            thoughts: JSON.parse(localStorage.getItem('thoughtsList')) || [],
            list: false,
            isNewThought: false,
            openThoughtBox: false,
            contentTitle: null,
            welcome: false,
            navMenu: false,
            deletionAlert: null,
            deleteThought: null
        }
    },
    methods: {
        saveThought() {
            if(!this.title) {
                return alert("Don't forget to add a title.")
            }
            const newThought = {
                id: Date.now(),
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
            this.contentTitle = this.thoughts[index].title
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
            this.welcome = false
            this.navMenu = false
        },
        deleteAlert(index) {
            this.deletionAlert = true
            this.deleteThought = this.thoughts[index].title

            sessionStorage.setItem('deleteThis', index)
        },
        cancelDeletion() {
            this.deletionAlert = false
        },
        removeThought() {
            const deleteKey = sessionStorage.getItem('deleteThis')
            if(deleteKey) {
                this.thoughts.splice(deleteKey, 1)
                localStorage.setItem('thoughtsList', JSON.stringify(this.thoughts))
                this.openThoughtBox = false
                this.isNewThought = false
                this.deletionAlert = false
    
                if(this.thoughts.length === 0) {
                    this.welcome = true
                    this.list = false
                }
            }
        }
    },
    computed: {
        msgLength() {
            return this.message.length
        },
        showWelcome() {
            return this.thoughts.length === 0 && !this.openThoughtBox
        },
        showList() {
            return this.thoughts.length > 0 && !this.openThoughtBox
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
        if(this.thoughts.length > 0) {
            this.welcome = false
            this.list = true
        } else {
            this.welcome = true
        }
    }
}
</script>