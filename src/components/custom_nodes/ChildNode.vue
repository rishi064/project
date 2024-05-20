<script setup>
import { useVueFlow, useNodeId } from "@vue-flow/core";
import { inject, onMounted, ref } from "vue";

const {
  getNodes,
  addNodes,
  addEdges,
  removeEdges,
  applyNodeChanges,
  removeNodes,
} = useVueFlow();

const props = defineProps(["data", "label", "position"]);
console.log("last node ko y-position", props.position.y);
console.log("last node ko y-position ko difference", 545 - props.position.y);

const nodes = inject("nodes");
const shouldMoveLastNode = ref(false);

if (550 - props.position.y < 100) {
  console.log("move last node ");
  shouldMoveLastNode.value = true;
}

console.log("shouldmovelastnode", shouldMoveLastNode.value);

// if (545 - props.position.y < 100) {
//   // 1. remove the last node
//   removeNodes("end");

//   // 2. add the last node to position + 195
//   addNodes([
//     {
//       id: "end",
//       type: "output",
//       label: "end",
//       position: { x: 380, y: props.position.y + 195 },
//     },
//   ]);
// }

// function updatePos() {
//   nodes.value = nodes.value.map((node) => {
//     return node.id === "end"
//       ? {
//           ...node,
//           position: {
//             x: 380,
//             y: getNodes.value[getNodes.value.length - 1] + 100,
//           },
//         }
//       : node;
//   });
// }

const nodeId = useNodeId();
console.log("just added nodeId", nodeId);

function addChildrenNode() {
  // if (550 - props.position.y < 100), we move last node farther
  // if (550 - props.position.y < 100) {
  //   console.log("move last node ");
  //   updatePos();
  //   console.log(getNodes.value.map((node) => node.position));
  // }

  // 1. remove end edge:
  removeEdges(["end-edge"]);

  const nodeIdForNewNode = (Math.random() * 1000).toFixed(2);

  //2 add new node:
  addNodes({
    id: `node-${nodeIdForNewNode}`,
    label: `node-${nodeIdForNewNode}`,
    type: "child",
    position: { x: 380, y: props.position.y + 100 },
  });

  //3.1 add edge connecting new node and current node
  //3.2 add edge connecting new node and end node
  addEdges([
    {
      id: `edge-${(Math.random() * 1000).toFixed(3)}`,
      label: "edge",
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

  console.log("last nodes ko value", getNodes.value[getNodes.value.length - 1]);
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
