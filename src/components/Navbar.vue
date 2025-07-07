<template>
    <nav class="navbar" :class="{ active: list}">
        <div class="navTop">
            <h2>Thoughts</h2>
            <button @click="$emit('closeNavbar')"><i class="bi bi-chevron-left"></i></button>
        </div>
        <div>
            <button class="newThoughtBtn" @click="$emit('newThought')">New Thought <i class="bi bi-pencil-square"></i></button>
        </div>
        <p class="context">Saved Thoughts: {{ savedLength }}</p>
        <ul>
            <li v-for="(thought, index) in thoughts" :key="index" @click="$emit('openThought', index)"><span>{{ thought.title }} <span class="createdAt">{{ thought.created_at }}</span></span><i class="bi bi-trash3-fill deleteBtn" @click="$emit('removeThought', index)"></i></li>
        </ul>
    </nav>
</template>

<script>
export default {
    props: ['thoughts', 'list', 'savedLength'],
    emits: ['closeNavbar', 'newThought', 'openThought', 'removeThought']
}
</script>