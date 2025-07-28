<template>
    <transition name="fade">
        <div v-if="list" class="list">
            <!-- <transition-group name="fade" tag="ul" class="list"> -->
                <li v-for="(thought, index) in thoughts" :key="thought.id || index" :class="{ thought: list}" @click="$emit('openThought', thought.id)">
                    <span class="title">{{ thought.title }} <span class="createdAt">{{ thought.created_at }}</span></span>
                    <button class="deleteBtn" @click.stop="$emit('removeThought', index)"><i class="bi bi-trash3-fill"></i></button></li>
            <!-- </transition-group> -->
        </div>
    </transition>
</template>

<script>
export default {
    props: ['thoughts', 'list'],
    emits: ['openThought', 'removeThought']
}
</script>