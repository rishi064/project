<script setup>
import { useVueFlow, useNodeId, useHandleConnections } from "@vue-flow/core";
import { inject, onMounted, ref } from "vue";

const {
  getNodes,
  getEdges,
  addNodes,
  addEdges,
  removeEdges,
  toObject,
  setViewport,
  getOutgoers,
  getIncomers,
} = useVueFlow();

const props = defineProps(["data", "label", "position"]);

const edgesConnectedToEnd = ref([]);

const endNode = getNodes.value.filter((node) => node.id === "end");
const endNodeYPosition = endNode[0].position.y;
const endNodeXPosition = endNode[0].position.x;

const nodes = inject("nodes");

const shouldMoveEndNode = ref(false);

if (endNodeYPosition - props.position.y < 100) {
  shouldMoveEndNode.value = true;
}

const nodeId = useNodeId();

const outgoingEdgesOfClickedNode = useHandleConnections({
  type: "source",
});

const incomingedgetoLastNode = useHandleConnections({
  type: "target",
  nodeId,
});

console.log("incoming edges to last node", incomingedgetoLastNode.value);

const outgoingEdgesOfClickedNodeId =
  outgoingEdgesOfClickedNode.value[0]?.edgeId;

function addChildrenNode() {
  console.log("clicked node's id", nodeId);

  // 1. remove end edge:
  removeEdges(["end-edge", "end-edge-1", "end-edge-2"]);

  shouldMoveEndNode.value &&
    addNodes({
      id: "end",
      type: "output",
      label: "Stop",
      position: { x: 400, y: endNodeYPosition + 100 },
    });

  //2 add new children node:
  const nodeIdForNewNode = (Math.random() * 1000).toFixed(2);
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

  setViewport({
    x: -(endNodeXPosition - 400),
    y: -(endNodeYPosition - 400),
    zoom: 1,
  });
}

function add2ChildrenNode() {
  removeEdges(["end-edge", "end-edge-1", "end-edge-2"]);

  const nodeIdForNewChildNode1 = (Math.random() * 1000).toFixed(3);
  const nodeIdForNewChildNode2 = (Math.random() * 1000).toFixed(3);
  addNodes([
    {
      id: `node-${nodeIdForNewChildNode1}`,
      label: `node-${nodeIdForNewChildNode1}`,
      type: "child",
      position: { x: 380, y: props.position.y + 100 },
    },
    {
      id: `node-${nodeIdForNewChildNode2}`,
      label: `node-${nodeIdForNewChildNode2}`,
      type: "child",
      position: { x: 150, y: props.position.y + 100 },
    },
  ]);

  const edgeIdForNewEdge1 = (Math.random() * 1000).toFixed(4);
  const edgeIdForNewEdge2 = (Math.random() * 1000).toFixed(4);

  addEdges([
    {
      id: `edge-${edgeIdForNewEdge1}`,
      label: `edge-${edgeIdForNewEdge1}`,
      type: "straight",
      source: nodeId,
      target: `node-${nodeIdForNewChildNode1}`,
    },
    {
      id: `edge-${edgeIdForNewEdge2}`,
      label: `edge-${edgeIdForNewEdge2}`,
      type: "straight",
      source: nodeId,
      target: `node-${nodeIdForNewChildNode2}`,
    },
    {
      id: `end-edge-1`,
      label: "end-edge-1",
      type: "straight",
      source: `node-${nodeIdForNewChildNode1}`,
      target: "end",
    },
    {
      id: `end-edge-2`,
      label: "end-edge-2",
      type: "straight",
      source: `node-${nodeIdForNewChildNode2}`,
      target: "end",
    },
  ]);

  console.log(
    "connected edges of clicked node",
    outgoingEdgesOfClickedNode.value
  );

  console.log(
    "connected edge id of clicked node",
    outgoingEdgesOfClickedNodeId
  );

  console.log("incoming edges of end node", edgesConnectedToEnd.value);
}
</script>

<template>
  <div class="child-node">
    <h2>{{ props.label }}</h2>
    <div class="btns">
      <button class="btn-add btn-add-children-node" @click="addChildrenNode">
        +
      </button>
      <button class="btn-add btn-add-sibling-node" @click="add2ChildrenNode">
        2
      </button>
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
</style>
