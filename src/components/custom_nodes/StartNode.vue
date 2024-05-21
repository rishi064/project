<script setup>
import { useVueFlow } from "@vue-flow/core";

const { addEdges, addNodes, removeEdges, updateNodePositions } = useVueFlow();

const props = defineProps(["position"]);

function addChildrenNode() {
  removeEdges(["end-edge"]);

  addNodes({
    id: "node-1",
    label: "node-1",
    type: "child",
    position: { x: 410, y: 150 },
  });

  addEdges([
    {
      id: "first-edge",
      type: "straight",
      label: "first-edge",
      source: "start",
      target: "node-1",
    },
    {
      id: `end-edge`,
      label: "end-edge",
      type: "straight",
      source: "node-1",
      target: "end",
    },
  ]);
}
</script>

<template>
  <div class="start-node">
    <h2>Start</h2>
    <div class="btns">
      <button class="single-node" @click="addChildrenNode">+</button>
    </div>
  </div>
</template>

<style scoped>
.start-node h2 {
  font-size: 28px;
  font-weight: 700;
}

.start-node {
  background-color: aqua;
  padding: 0 20px;
  border-radius: 20px;
  border: 2px solid rgb(255, 0, 0);
}

.btns {
  display: flex;
  align-items: center;
  justify-content: center;
}

.single-node {
  position: absolute;
  border-radius: 5px;
  border: none;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  font-weight: bold;
}
</style>
