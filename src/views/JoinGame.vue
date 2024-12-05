<script setup>
import GameLayout from '@/components/GameLayout.vue';
const props = defineProps(['clientId'])
</script>

<template>
    <GameLayout :clientId="props.clientId">
        <div>
            <h1>JoinGame {{ clientId }}</h1>
            <!-- Your initiation logic here -->
        </div>
    </GameLayout>
</template>
  
