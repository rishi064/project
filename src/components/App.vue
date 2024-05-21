<script setup>
import { provide, ref } from "vue";

import { Background } from "@vue-flow/background";
import { ControlButton, Controls } from "@vue-flow/controls";
import { Position, VueFlow, useVueFlow } from "@vue-flow/core";

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
    position: { x: 400, y: 545 },
  },
]);

const edges = ref([
  {
    id: `end-edge`,
    label: "end-edge",
    type: "straight",
    source: `start`,
    target: "end",
  },
]);

const incrementY = ref(100);
provide(incrementY, "incrementY");

//to update position of end node to accomodate added node
provide("nodes", nodes);
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
