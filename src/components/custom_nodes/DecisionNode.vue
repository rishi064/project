<script setup>
import { ref } from "vue";
import Icon from "../Icon.vue";

import {
  useVueFlow,
  useNodeId,
  useHandleConnections,
  Position,
  MarkerType,
} from "@vue-flow/core";
import { useNodeAddition } from "@/composables/useNodeAddition";

const { addEdges, getNodes, findNode } = useVueFlow();
const { addOneChild, addMultipleChild } = useNodeAddition();

const props = defineProps(["label", "position", "data", "type"]);
console.log(props.position);

const nodeId = useNodeId();
const gotoId = ref(undefined);
const showButtons = ref(false);

//logic aiding to add children node below:

const offset = ref(0);

const showLabelInput = ref(false);
const label = ref(props.label);
const password = ref("");

const endNode = getNodes.value.filter((node) => node.id === "end");
const endNodeYPosition = endNode[0].position.y;

if (endNodeYPosition - props.position.y < 250) {
  offset.value = endNodeYPosition - props.position.y;
}

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

function handleSubmit() {
  const allNodeIDs = getNodes.value.map((node) => node.id);
  console.log("getting nodes", findNode(gotoId.value));

  if (allNodeIDs.includes(gotoId.value)) {
    addEdges({
      id: "goto-edge",
      label: "goto-edge",
      source: nodeId, //nodeId = useNodeId()
      type: "smoothstep",
      target: gotoId.value,
      style: { stroke: "red", strokeWidth: 4 },
      markerEnd: MarkerType.ArrowClosed,
      targetHandle: "a",
    });
  } else {
    alert("Enter the correct id of the node which you want to connect to");
  }

  gotoId.value = undefined;
}
</script>

<template>
  <div
    class="decision-node"
    @mouseenter="showButtons = true"
    @mouseleave="showButtons = false"
  >
    <p class="decision-node-label">Decision {{ props.label }}</p>
    <div class="handle-node-content">
      <form @submit.prevent="handleSubmit">
        <input
          type="text"
          v-model.trim="gotoId"
          placeholder="Enter node id .."
          class="goto-input"
        />
        <button type="submit" class="goto-btn">Go</button>
      </form>
    </div>

    <div class="extended-handle">
      <strong>+</strong>
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
</template>

<style scoped>
.goto-input {
  width: 100px;
}

.decision-node {
  margin: 0;
  position: relative;
  background-color: bisque;
  border-radius: 10px;
  padding: 10px;
  font-size: 24px;
}

.decision-node-label {
  font-size: 14px;
  font-weight: bold;
  margin: 0;
}

.goto-btn {
  border: 1px solid;
  margin-left: 5px;
  cursor: pointer;
}

.goto-btn:hover {
  box-shadow: 2px 2px 2px 0 rgba(0, 0, 0, 0.3);
}

.handle-node-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

button {
  background: none;
  border: none;
}

.extended-handle {
  height: 20px;
  width: 20px;
  background-color: gold;
  border-radius: 4px;
  transform: translate(-50%, 50%);

  position: absolute;
  left: 50%;

  display: flex;
  align-items: center;
  justify-content: center;
}

.line-container {
  position: absolute;
  bottom: 0;
  left: 50%;

  transform: translate(-50%, 100%);

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
  stroke-width: 5px;
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
