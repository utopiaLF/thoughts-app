<template>
    <div class="head">
        <i class="bi bi-list-ul openBarBtn" @click="$emit('openNavbar')"></i>
        <a href="/">Thoughts App</a>
    </div>
</template>

<script>
export default {
    props: ['list'],
    emits: ['openNavbar']
}
</script>