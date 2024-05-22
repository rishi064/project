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

import StartNode from "./custom_nodes/StartNode.vue";
import ChildNode from "./custom_nodes/ChildNode.vue";

const nodes = ref([
  {
    id: "start",
    type: "start",
    position: { x: 400, y: 10 },
    draggable: false,
    data: {
      color: "red",
    },
  },
  {
    id: "end",
    type: "output",
    label: "Stop",
    position: { x: 400, y: 745 },
  },
]);

const edges = ref([
  {
    id: `end-edge`,
    label: "end-edge",
    type: "straight",
    source: `start`,
    target: "end",
    markerEnd: MarkerType.ArrowClosed,
  },
]);

//crucial for updating the DB on  node change of desired type
// function onNodesChange(changes) {
//   console.log("just occured changes", changes);
// }
</script>

<template>
  <div class="vueflow-container">
    <VueFlow :nodes="nodes" :edges="edges" :nodes-draggable="true">
      <template #node-start="props">
        <StartNode :data="props.data" v-bind="props" />
      </template>
      <template #node-child="props">
        <ChildNode :data="props.data" v-bind="props"></ChildNode>
      </template>

      <Background />
      <Controls position="top-right" :show-interactive="false"> </Controls>
    </VueFlow>
  </div>
</template>
