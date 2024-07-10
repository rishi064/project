<script setup>
import { ref } from "vue";
import Icon from "../Icon.vue";

import { useVueFlow, useNodeId, useHandleConnections } from "@vue-flow/core";

const { getNodes } = useVueFlow();

const showButtons = ref(false);
const props = defineProps(["data", "label", "position", "type"]);

import { useNodeAddition } from "@/composables/useNodeAddition";

const { addOneChild, addMultipleChild } = useNodeAddition();

const endNode = getNodes.value.filter((node) => node.id === "end");
const endNodeYPosition = endNode[0].position.y;

const offset = ref(0);

if (endNodeYPosition - props.position.y < 250) {
  offset.value = endNodeYPosition - props.position.y;
}

const nodeId = useNodeId();

const outgoingEdgesOfClickedNode = useHandleConnections({
  type: "source",
  nodeId,
});

function addChildrenNode() {
  addOneChild(nodeId, outgoingEdgesOfClickedNode, offset, props);
}

function add2ChildrenNode() {
  addMultipleChild(outgoingEdgesOfClickedNode, nodeId, props);
}
</script>

<template>
  <div class="handle-node">
    <div
      class="handle-node-container"
      @mouseenter="showButtons = true"
      @mouseleave="showButtons = false"
    >
      <div class="handle-node-content">
        <strong>{{ props.label }}{{ props.data.level }}</strong>
      </div>
      <div class="line-container" v-if="showButtons">
        <div class="line-one">
          <button class="btn-add">
            <Icon name="circle" class="circle-icon" @click="addChildrenNode" />
          </button>
        </div>
        <div class="line-two">
          <button class="btn-add">
            <Icon
              name="multiple"
              class="multiple-icon"
              @click="add2ChildrenNode"
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.handle-node {
  width: 322px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.handle-node-container {
  margin: 0;
  position: relative;

  background-color: gold;
  height: 28px;
  width: 28px;
  border: none;
  border-radius: 10px;
  font-size: 24px;
}

.handle-node-content {
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.handle-node-content strong {
  padding: 28px;
}

button {
  background: none;
  border: none;
}

.line-container {
  position: absolute;
  bottom: 0;
  left: 50%;

  transform: translate(-50%, 50%);

  display: flex;
  z-index: -1;
}

.btn-add {
  cursor: pointer;
}

.line-one {
  height: 24px;
  width: 42px;
  border-bottom-right-radius: 100px;
  border: 3px solid #000;
  border-top: 0;
  border-left: 0;

  position: relative;
}

.circle-icon {
  height: 24px;

  position: absolute;
  bottom: 0;

  transform: translate(-50%, 50%);
}

.circle-icon:hover {
  stroke: palevioletred;
  stroke-width: 3px;
}

.line-two {
  height: 24px;
  width: 42px;
  border-bottom-left-radius: 110px;
  border: 3px solid #000;
  border-top: 0;
  border-right: 0;

  background-color: transparent;
  position: relative;
}

.multiple-icon {
  height: 36px;
  position: absolute;
  bottom: 0;

  transform: translate(50%, 65%) rotate(75deg);
}

.multiple-icon:hover {
  fill: palevioletred;
}
</style>
