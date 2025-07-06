<template>
    <div class="head">
        <i class="bi bi-list-ul openBarBtn" @click="list = !list"></i>
        <a href="index.html">Thoughts App</a>
    </div>
    <nav class="navbar" :class="{ active: list}">
        <div class="navTop">
            <h2>Thoughts</h2>
            <button @click="list = false"><i class="bi bi-chevron-left"></i></button>
        </div>
        <div>
            <button class="newThoughtBtn" @click="newThought">New Thought <i class="bi bi-pencil-square"></i></button>
        </div>
        <p class="context">Saved Thoughts: {{ savedThoughtsLength }}</p>
        <ul>
            <li v-for="(thought, index) in thoughts" :key="index" @click="openThought(index)"><span>{{ thought.title }} <span class="createdAt">{{ thought.created_at }}</span></span><i class="bi bi-trash3-fill deleteBtn" @click="removeThought(index)"></i></li>
        </ul>
    </nav>
    <div v-if="!openThoughtBox" class="welcomeBox">
        <p>Welcome to Thoughts App.</p>

        <button @click="newThought">New Thought</button>
    </div>
    <div v-if="openThoughtBox" class="thoughtBox">
        <input v-if="isNewThought" v-model="title" maxlength="20" type="text" placeholder="Title">
        <p v-if="warningTitle" style="margin: 10px 0px;">Title shouldn't be more than 20 symbols.</p>
        <textarea v-model="message" maxlength="1000" placeholder="Type something..."></textarea>
        <div style="display: flex;align-items: center;justify-content: space-between;flex-direction: row;width: 100%;">
            <p>Content length: {{ msgLength }}/1000</p>
            <button v-if="isNewThought" :class="{ disable: !message}" :disabled="!message" @click="saveThought">Save</button>
        </div>
    </div>
</template>

<script>
export default {
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
                return alert('You forgot the Title')
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

<style>
@import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Space+Grotesk:wght@300..700&display=swap');
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
body{
    background-color: #212121;
    width: 100%;
    height: 100vh;
    display: flex;
    overflow-x: hidden;
    justify-content: center;
    align-items: center;
}
.head{
    width: 100%;
    height: 80px;
    background-color: #212121;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30px;
}
.openBarBtn{
    color: #ffffff;
    cursor: pointer;
    font-size: 1.5rem;
}
.head a{
    color: #ffffff;
    text-decoration: none;
    font-family: "Poppins", sans-serif;
    font-size: 1.5rem;
}
.welcomeBox{
    display: flex;
    flex-direction: column;
    align-items: center;
}
.welcomeBox p{
    font-size: 2rem;
    font-family: "Poppins", sans-serif;
    text-align: center;
}
.welcomeBox button{
    width: 200px;
    border-radius: 10px;
    margin-top: 20px;
}
.thoughtBox{
    width: 70vw;
    display: flex;
    flex-direction: column;
}
.thoughtBox input{
    width: 100%;
    height: 55px;
    outline: none;
    border: 2px solid #ffffff;
    background-color: #121212;
    padding: 15px;
    border-radius: 20px;
    color: #ffffff;
    font-family: "Poppins", sans-serif;
    font-weight: 500;
    letter-spacing: 0.8px;
    box-shadow: 5px 5px 5px rgb(0, 0, 0, 0.5);
}
.thoughtBox textarea{
    width: 100%;
    max-width: 100%;
    min-width: 100%;
    min-height: 60vh;
    outline: none;
    border: 2px solid #ffffff;
    background-color: #121212;
    padding: 15px;
    border-radius: 20px;
    margin: 10px 0px;
    color: #ffffff;
    font-size: 1rem;
    font-family: "Lato", sans-serif;
    font-weight: 400;
    letter-spacing: 0.3px;
    box-shadow: 5px 5px 5px rgb(0, 0, 0, 0.5);
}
p{
    color: #ffffff;
    font-family: "Poppins", sans-serif;
    font-weight: 400;
}
button{
    width: 20%;
    height: 40px;
    outline: none;
    border: none;
    background-color: #ffffff;
    color: #121212;
    border-radius: 20px;
    box-shadow: 5px 5px 5px rgb(0, 0, 0, 0.2);
    font-family: "Poppins", sans-serif;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}
button.disable{
    cursor: not-allowed;
    background-color: grey;
}

.navbar{
    width: 20%;
    height: 100vh;
    background-color: #121212;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    padding: 15px;
    transform: translateX(-100%);
    opacity: 0;
    transition: all 0.3s ease;
}
.navbar .navTop{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.navbar .navTop h2{
    font-family: "Poppins", sans-serif;
    color: #ffffff;
    font-weight: 400;
}
.navbar .navTop button{
    background-color: #212121;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #ffffff;
    font-weight: 600;
}
.navbar .newThoughtBtn{
    width: 100%;
    margin-top: 20px;
    border-radius: 10px;
    background-color: #ffffff;
    color: #121212;
    cursor:grabbing;
}
.navbar .context{
    margin-top: 50px;
    color: #979797;
}
.navbar ul{
    color: #ffffff;
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column-reverse;
    overflow-y: scroll;
    overflow-x: hidden;
    padding-right: 10px;
}
.navbar ul::-webkit-scrollbar{
    width: 5px;
    margin-left: 15px;
}
.navbar ul::-webkit-scrollbar-thumb{
    background-color: #979797;
    border-radius: 20px;
}
.navbar ul::-webkit-scrollbar-track{
    background-color: transparent;
}
.navbar ul li{
    font-family: "Poppins", sans-serif;
    margin: 5px 0px;
    padding: 8px 15px;
    border-radius: 10px;
    opacity: 0.8;
    transition: all 0.2s;
    position: relative;
    cursor: progress;
    background-color: #212121;
    display: flex;
    align-items: center;
    justify-content: space-between;
    animation: newThought 1s forwards linear;
}
@keyframes newThought{
    50%{
        background-color: #ffffff;
        color: #121212;
    }
}
.navbar .deleteBtn{
    opacity: 0;
    pointer-events: none;
    height: 100%;
}
.navbar ul li:hover{
    opacity: 1;
    background-color: #666666;
}

.navbar ul li .createdAt{
    color: #121212;
    font-size: 0.65rem;
    opacity: 0;
}
.navbar ul li:hover .createdAt{
    opacity: 1;
}
.navbar ul li:hover .deleteBtn{
    opacity: 1;
    pointer-events: all;
}
.navbar.active{
    transform: translateX(0%);
    opacity: 1;
}

@media (max-width: 768px) {
    .head{
        height: max-content;
        padding: 15px;
    }
    .openBarBtn{
        font-size: 1.2rem;
    }
    .head a{
        font-size: 1.3rem;
    }
    .welcomeBox p{
        font-size: 1.2rem;
    }
    .welcomeBox button{
        width: 60%;
    }
    .navbar{
        width: 100%;
    }
    .thoughtBox {
        width: 97vw;
        margin-top: 20%;
        padding: 20px 0px;
    }
    .thoughtBox textarea{
        min-height: 70vh;
        height: auto;
    }
    p{
        font-size: 0.8rem;
    }
    .thoughtBox button{
        width: 30%;
        height: 38px;
        font-size: 0.9rem;
    }
    
    .navbar ul .deleteBtn{
        opacity: 1;
        pointer-events: all;
    }
}
</style>