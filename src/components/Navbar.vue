<template>
    <nav class="navbar" :class="{ active: navMenu}">
        <div class="navTop">
            <h2>Thoughts</h2>
            <button @click="$emit('closeNavbar')"><i class="bi bi-chevron-left"></i></button>
        </div>
        <div>
            <button class="newThoughtBtn" @click="$emit('newThought')">New Thought <i class="bi bi-pencil-square"></i></button>
        </div>
    </nav>
</template>

<script>
export default {
    props: ['navMenu'],
    emits: ['closeNavbar', 'newThought']
}
</script>