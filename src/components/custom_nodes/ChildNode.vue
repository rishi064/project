<script setup>
import { useVueFlow, useNodeId } from "@vue-flow/core";
import { inject, onMounted, ref } from "vue";

const { getNodes, getEdges, addNodes, addEdges, removeEdges, toObject } =
  useVueFlow();

const props = defineProps(["data", "label", "position"]);

const endNode = getNodes.value.filter((node) => node.id === "end");
const endNodeYPosition = endNode[0].position.y;

const nodes = inject("nodes");

const shouldMoveEndNode = ref(false);

if (endNodeYPosition - props.position.y < 100) {
  shouldMoveEndNode.value = true;
}

const nodeId = useNodeId();

function addChildrenNode() {
  // 1. remove end edge:
  removeEdges(["end-edge"]);

  const nodeIdForNewNode = (Math.random() * 1000).toFixed(2);

  shouldMoveEndNode.value &&
    addNodes({
      id: "end",
      type: "output",
      label: "Stop",
      position: { x: 400, y: endNodeYPosition + 100 },
    });

  //2 add new children node:
  addNodes({
    id: `node-${nodeIdForNewNode}`,
    label: `node-${nodeIdForNewNode}`,
    type: "child",
    position: { x: 380, y: props.position.y + 100 },
  });

  //3.1 add edge connecting new node and current node
  //3.2 add edge connecting new node and end node
  const edgeIdForNewEdge = (Math.random() * 1000).toFixed(3);
  addEdges([
    {
      id: `edge-${edgeIdForNewEdge}`,
      label: `edge-${edgeIdForNewEdge}`,
      type: "straight",
      source: nodeId,
      target: `node-${nodeIdForNewNode}`,
    },
    {
      id: `end-edge`,
      label: "end-edge",
      type: "straight",
      source: `node-${nodeIdForNewNode}`,
      target: "end",
    },
  ]);

  // data to update to database at last on each children added
  // console.log("whole vueflow component's info:", toObject());
  // console.log("all nodes", getNodes.value);
  // console.log("all edges", getEdges.value);
}
</script>

<template>
  <div class="child-node">
    <h2>{{ props.label }}</h2>
    <div class="btns">
      <button class="btn-add btn-add-children-node" @click="addChildrenNode">
        +
      </button>
      <button class="btn-add btn-add-sibling-node">2</button>
    </div>
  </div>
</template>

<style scoped>
.child-node {
  background-color: orange;
  padding: 0 20px;
  border-radius: 20px;
  border: 2px solid blue;
}

.child-node h2 {
  font-size: 20px;
  font-weight: 600;
}

.btns {
  display: flex;
  gap: 4px;

  left: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
}

.btn-add {
  border-radius: 5px;
  border: none;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  font-weight: bold;
}

/* .btn-add-children-node {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 50%);
}

.btn-add-sibling-node {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(50%, -50%);
} */
</style>
