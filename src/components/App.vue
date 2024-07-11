<script setup>
import { nextTick, provide, ref } from "vue";

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
import { useLayout } from "@/composables/useLayout";

const nodes = ref([
  {
    id: "start",
    type: "startend",
    position: { x: 498, y: 25 },
    label: "Start",
    data: { level: 0 },
  },
  {
    id: "initiator",
    label: "initiator",
    type: "initiator",
    position: { x: 354, y: 100 },
    data: {
      level: 1,
    },
  },
  {
    id: "end",
    type: "startend",
    label: "Stop",
    position: { x: 498, y: 400 },
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

const allGotoEdgesArray = ref([]);
const toUpdate = ref(false);

provide("nodes", nodes);
provide("edges", edges);
provide("allGotoEdgesArray", allGotoEdgesArray);
provide("toUpdate", toUpdate);

const { saveFlowchart, restoreFromLocal } = useVueFlowHelper(nodes, edges);
const { layout } = useLayout();
const { fitView } = useVueFlow();

async function layoutGraph() {
  nodes.value = layout(nodes.value, edges.value);

  nextTick(() => {
    // fitView();
  });
}
</script>

<template>
  <div class="vueflow-container">
    <VueFlow
      :nodes="nodes"
      :edges="edges"
      :nodes-draggable="false"
      :zoom-on-double-click="false"
      :delete-key-code="null"
      @nodes-initialized="layoutGraph"
      :max-zoom="4"
      :min-zoom="0.5"
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
