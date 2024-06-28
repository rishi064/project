<script setup>
import { provide, ref } from "vue";

import { ControlButton, Controls } from "@vue-flow/controls";
import {
  MarkerType,
  VueFlow,
  applyChanges,
  applyNodeChanges,
  useVueFlow,
} from "@vue-flow/core";

import StartEndNode from "./custom_nodes/StartEndNode.vue";
import InitiatorNode from "./custom_nodes/InitiatorNode.vue";
import ProcessNode from "./custom_nodes/ProcessNode.vue";
import HandleNode from "./custom_nodes/HandleNode.vue";
import DecisionNode from "./custom_nodes/DecisionNode.vue";
import ManagerBranchNode from "./custom_nodes/ManagerBranchNode.vue";
import { useVueFlowHelper } from "@/composables/helpers/useVueFlowHelper";

const nodes = ref([
  {
    id: "start",
    type: "startend",
    position: { x: 498, y: 25 },
    label: "Start",
    data: {},
  },
  {
    id: "initiator",
    label: "initiator",
    type: "initiator",
    position: { x: 354, y: 100 },
    data: {
      color: "red",
    },
  },
  {
    id: "end",
    type: "startend",
    label: "Stop",
    position: { x: 498, y: 600 },
  },
]);

const edges = ref([
  {
    id: "first-edge",
    source: "start",
    target: "initiator",
    type: "straight",
  },
  {
    id: `end-edge`,
    label: "",
    type: "straight",
    source: `initiator`,
    target: "end",
  },
]);

const { saveFlowchart, restoreFromLocal } = useVueFlowHelper(nodes, edges);
provide("allGotoEdgesArray", []);
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
      <template #node-startend="props">
        <StartEndNode :data="props.data" v-bind="props" />
      </template>

      <template #node-initiator="props">
        <InitiatorNode :data="props.data" v-bind="props" />
      </template>

      <template #node-process="props">
        <ProcessNode :data="props.data" v-bind="props"></ProcessNode>
      </template>

      <template #node-handle="props">
        <HandleNode :data="props.data" v-bind="props"></HandleNode>
      </template>

      <template #node-decision="props">
        <DecisionNode :data="props.data" v-bind="props"></DecisionNode>
      </template>

      <template #node-managerbranch="props">
        <ManagerBranchNode
          :data="props.data"
          v-bind="props"
        ></ManagerBranchNode>
      </template>

      <Controls position="top-right">
        <ControlButton title="Save " @click="saveFlowchart">S</ControlButton>

        <ControlButton title="Get saved data" @click="restoreFromLocal"
          >U</ControlButton
        >
      </Controls>
    </VueFlow>
  </div>
</template>
