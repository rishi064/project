<script setup>
import { provide, ref } from "vue";

import { Background } from "@vue-flow/background";
import { ControlButton, Controls } from "@vue-flow/controls";
import {
  MarkerType,
  Position,
  VueFlow,
  useHandleConnections,
  useVueFlow,
} from "@vue-flow/core";

import InitiatorNode from "./custom_nodes/InitiatorNode.vue";
import ChildNode from "./custom_nodes/ChildNode.vue";
import HandleNode from "./custom_nodes/HandleNode.vue";

const { toObject } = useVueFlow();

const nodes = ref([
  {
    id: "start",
    type: "input",
    position: { x: 300, y: 0 },
    label: "Start",
  },
  {
    id: "initiator",
    type: "initiator",
    position: { x: 300, y: 100 },
    draggable: false,
    data: {
      color: "red",
    },
  },
  {
    id: "end",
    type: "output",
    label: "Stop",
    position: { x: 300, y: 400 },
  },
]);

const edges = ref([
  {
    id: "first-edge",
    label: "first-edge",
    source: "start",
    target: "initiator",
    type: "straight",
    style: { strokeWidth: 2 },
    markerEnd: MarkerType.ArrowClosed,
  },
  {
    id: `end-edge`,
    label: "end-edge",
    type: "straight",
    source: `initiator`,
    target: "end",
    markerEnd: MarkerType.ArrowClosed,
  },
]);

function saveFlowchart() {
  console.log("nodes", toObject().nodes);
  console.log("edges", toObject().edges);

  const nodes = [];
  const edges = [];

  toObject().nodes.map((node) => nodes.push(node));
  toObject().edges.map((edge) => edges.push(edge));

  console.log("nodes", nodes);
  console.log("edges", edges);
  localStorage.setItem("nodes", JSON.stringify(nodes));
  localStorage.setItem("edges", JSON.stringify(edges));
}

function restoreFromLocal() {
  nodes.value = JSON.parse(localStorage.getItem("nodes"));
  edges.value = JSON.parse(localStorage.getItem("edges"));
}

//crucial for updating the DB on  node change of desired type
// function onNodesChange(changes) {
//   console.log("just occured changes", changes);
// }
</script>

<template>
  <div class="vueflow-container">
    <VueFlow :nodes="nodes" :edges="edges" :nodes-draggable="false">
      <template #node-initiator="props">
        <InitiatorNode :data="props.data" v-bind="props" />
      </template>
      <template #node-child="props">
        <ChildNode :data="props.data" v-bind="props"></ChildNode>
      </template>

      <Background />
      <Controls position="top-right" :show-interactive="false">
        <ControlButton title="Save " @click="saveFlowchart">S</ControlButton>

        <ControlButton title="Get saved data" @click="restoreFromLocal"
          >U</ControlButton
        >
      </Controls>
    </VueFlow>
  </div>
</template>
