<script setup>
import { useNodeId } from "@vue-flow/core";

const nodeId = useNodeId();
</script>

<template>
  <div class="start-node">
    <div class="node-content">
      <div :class="['inner-circle', { 'inner-full': nodeId === 'end' }]"></div>
    </div>
  </div>
</template>

<style scoped>
.start-node {
  width: 322px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.node-content {
  padding: 4px;
  height: 28px;
  width: 28px;
  border-radius: 100%;
  background-color: #fff;
  box-shadow: 3px 0 3px rgba(0, 0, 0, 0.3);

  transform: rotate(60deg);
}

.inner-circle {
  height: 20px;
  width: 20px;
  border-radius: 100%;
  border: 4px solid #4bb4aa;
}

.inner-full {
  background-color: #4bb4aa;
}
</style>
