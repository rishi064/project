<script setup>
import {
  MarkerType,
  addEdge,
  useHandleConnections,
  useNodeId,
  useVueFlow,
} from "@vue-flow/core";
import Icon from "../Icon.vue";
import { ref } from "vue";

const showAddBtn = ref(false);

const { addEdges, getOutgoers, addNodes, removeEdges, updateNodePositions } =
  useVueFlow();

const props = defineProps(["position", "type"]);
const nodeId = useNodeId();

const sourceConnections = useHandleConnections({
  type: "source",
});

function toggleShowAddBtn() {
  showAddBtn.value = !showAddBtn.value;
}

function addChildrenNode() {
  const outgoingEdge = sourceConnections.value[0].edgeId; // 0 coz only one outgoing edge no matter what
  const outgoerIds = getOutgoers(nodeId).map((node) => node.id);

  outgoerIds.includes("end")
    ? removeEdges(["end-edge"])
    : removeEdges([outgoingEdge]);

  const id1stChild = (Math.random() * 100).toFixed(2);

  addNodes({
    id: `node-${id1stChild}`,
    label: `node-${id1stChild}`,
    type: "child",
    position: { x: 290, y: 250 },
  });

  const edgeId = (Math.random() * 100).toFixed(3);

  addEdges([
    {
      id: `edge-${edgeId}`,
      type: "straight",
      label: `edge-${edgeId}`,
      source: "initiator",
      target: `node-${id1stChild}`,
      style: { strokeWidth: 2 },
      animated: true,
      markerEnd: MarkerType.ArrowClosed,
    },
  ]);

  //won't get over-written incase the outgoer isn't end-edge
  addEdges([
    {
      id: `end-edge`,
      label: "end-edge",
      type: "straight",
      source: `node-${id1stChild}`,
      target: "end",
      style: { strokeWidth: 2 },
      markerEnd: MarkerType.ArrowClosed,
    },
  ]);

  if (!outgoerIds.includes("end")) {
    const edgeId = (Math.random() * 100).toFixed(3);

    addEdges([
      {
        id: `edge-${edgeId}`,
        label: `edge-${edgeId}`,
        type: "straight",
        source: `node-${id1stChild}`,
        target: `${outgoerIds[0]}`, //0 coz only one outgoer no matter what
        markerEnd: MarkerType.ArrowClosed,
        animated: true,
      },
    ]);

    //Logic of redrawing every child[Outgoing] node
    //1. get the immediate outgoer:
    let goerIds = getOutgoers(nodeId).map((node) => node.id);

    while (!goerIds.includes("end")) {
      const tempNodes = getOutgoers(goerIds[0]);

      tempNodes.map((tempNode) => {
        //redrawing of nodes(not edges) coz edges will arrange w.r.t. nodes
        addNodes({
          id: tempNode.id,
          label: tempNode.id === "end" ? "Stop" : tempNode.id,
          type: tempNode.id === "end" ? "output" : "child",
          position: { x: tempNode.position.x, y: tempNode.position.y + 250 },
        });

        goerIds[0] = tempNode.id;
      });
    }
  }
}
</script>

<template>
  <div
    class="initiator-node"
    @mouseenter="toggleShowAddBtn"
    @mouseleave="toggleShowAddBtn"
  >
    <h2>Initiator</h2>
    <div class="hover-container" v-if="showAddBtn">
      <div class="line"></div>
      <button class="add-single-node" @click="addChildrenNode">
        <Icon name="circle" class="circle" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.initiator-node h2 {
  font-size: 12px;
  font-weight: 700;
  position: relative;
}

.initiator-node {
  background-color: aqua;
  padding: 5px 20px;
  border-radius: 20px;
  border: 2px solid rgb(255, 0, 0);
}

.hover-container {
  left: 50%;
  position: absolute;
}

.line {
  height: 16px;
  width: 4px;
  background-color: black;
  margin: 0;
  padding: 0;
}

.add-single-node {
  position: absolute;
  transform: translate(-50%, -50%);
  left: 50%;
  border: none;
  cursor: pointer;
  font-weight: bold;
  background: transparent;
  padding: 0;
}

.circle {
  height: 12px;
  width: 12px;
}
</style>
