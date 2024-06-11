<script setup>
import { provide, ref } from "vue";

import { Background } from "@vue-flow/background";
import { ControlButton, Controls } from "@vue-flow/controls";
import {
  MarkerType,
  VueFlow,
  applyChanges,
  applyNodeChanges,
  useVueFlow,
} from "@vue-flow/core";

import InitiatorNode from "./custom_nodes/InitiatorNode.vue";
import ChildNode from "./custom_nodes/ChildNode.vue";
import HandleNode from "./custom_nodes/HandleNode.vue";
import { generateRandomColor } from "@/composables/helpers/randomColor";
import { useVueFlowHelper } from "@/composables/helpers/useVueFlowHelper";

const { saveFlowchart, restoreFromLocal } = useVueFlowHelper();

const nodes = ref([
  {
    id: "start",
    type: "input",
    position: { x: 300, y: 0 },
    label: "Start",
    data: {},
  },
  {
    id: "initiator",
    type: "initiator",
    position: { x: 300, y: 100 },
    data: {
      color: "red",
    },
  },
  {
    id: "end",
    type: "output",
    label: "Stop",
    position: { x: 290, y: 400 },
  },
]);

const edges = ref([
  {
    id: "first-edge",
    label: "first-edge",
    source: "start",
    target: "initiator",
    type: "straight",
    style: { strokeWidth: 4 },
    markerEnd: MarkerType.ArrowClosed,
    style: { stroke: generateRandomColor() },
  },
  {
    id: `end-edge`,
    label: "end-edge",
    type: "straight",
    source: `initiator`,
    target: "end",
    markerEnd: MarkerType.ArrowClosed,
    style: {
      stroke: generateRandomColor(),
    },
  },
]);
</script>

<template>
  <div class="vueflow-container">
    <VueFlow
      :nodes="nodes"
      :edges="edges"
      :nodes-draggable="false"
      @apply-changes="false"
      :zoom-on-double-click="false"
      :delete-key-code="null"
    >
      <template #node-initiator="props">
        <InitiatorNode :data="props.data" v-bind="props" />
      </template>

      <template #node-child="props">
        <ChildNode :data="props.data" v-bind="props"></ChildNode>
      </template>

      <template #node-handle="props">
        <HandleNode :data="props.data" v-bind="props"></HandleNode>
      </template>

      <Background />
      <Controls position="top-right">
        <ControlButton title="Save " @click="saveFlowchart">S</ControlButton>

        <ControlButton title="Get saved data" @click="restoreFromLocal"
          >U</ControlButton
        >
      </Controls>
    </VueFlow>
  </div>
</template>
