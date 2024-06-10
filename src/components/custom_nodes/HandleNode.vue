<script setup>
import { ref } from "vue";
import Icon from "../Icon.vue";

import { useVueFlow, useNodeId, useHandleConnections } from "@vue-flow/core";

const { getNodes } = useVueFlow();

const showButtons = ref(false);
const props = defineProps(["data", "label", "position"]);

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
  <div
    class="handle-node"
    @mouseenter="showButtons = true"
    @mouseleave="showButtons = false"
  >
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
</template>

<style scoped>
.handle-node {
  margin: 0;
  position: relative;

  background-color: gold;
  height: 32px;
  width: 32px;
  border: none;
  border-radius: 10px;
  font-size: 24px;
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
  height: 44px;
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

.line-two {
  height: 44px;
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
</style>
