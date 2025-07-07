<template>
    <div v-if="openThoughtBox" class="thoughtBox">
        <input v-if="isNewThought" :value="title" @input="$emit('update:title', $event.target.value)" maxlength="20" type="text" placeholder="Title">
        <p v-if="warningTitle" style="margin: 7px 0px;">Title must be 20 characters or less.</p>
        <textarea :value="message" @input="$emit('update:message', $event.target.value)" :class="{ readOnly: !isNewThought}" maxlength="1000" placeholder="What’s on your mind?"></textarea>
        <div style="display: flex;align-items: center;justify-content: space-between;flex-direction: row;width: 100%;margin-top: 10px;">
            <p>Content length: {{ msgLength }}/1000</p>
            <button v-if="isNewThought" :class="{ disable: !message}" :disabled="!message" @click="$emit('saveThought')">Save</button>
        </div>
    </div>
</template>

<script>
export default {
    emits: ['update:title', 'update:message', 'saveThought'],
    props: ['openThoughtBox', 'isNewThought', 'title', 'message', 'msgLength', 'warningTitle']
}
</script>