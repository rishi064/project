<script setup>
import { useVueFlow, useNodeId, useHandleConnections } from "@vue-flow/core";

import { ref } from "vue";
import Icon from "./../Icon.vue";

import { useNodeDeletion } from "../../composables/useNodeDeletion";
import { useNodeAddition } from "@/composables/useNodeAddition";

const showButtons = ref(false);

const { getNodes, updateNode } = useVueFlow();

const props = defineProps(["data", "label", "position"]);
console.log(props.data, props.label);

const { deleteNode } = useNodeDeletion();
const { addOneChild, addMultipleChild } = useNodeAddition();

const endNode = getNodes.value.filter((node) => node.id === "end");
const endNodeYPosition = endNode[0].position.y;

const offset = ref(0);

const showLabelInput = ref(false);
const label = ref(props.label);

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

function onDoubleClick() {
  showLabelInput.value = true;
  console.log("double clicked", nodeId);
}

function handleLabelSubmit() {
  showLabelInput.value = false;
  updateNode(nodeId, { label: label.value });

  console.log(getNodes.value.map((node) => node.label));
}

const handleDeleteNode = () => deleteNode(nodeId);
</script>

<template>
  <div
    class="child-node"
    @mouseenter="showButtons = true"
    @mouseleave="showButtons = false"
  >
    <!-- 1.// For being the target of previous node -->
    <!-- <Handle id="b" type="target" :position="Position.Top" /> -->

    <div
      :class="['node', `${data.hasSibling ? 'hasSibling' : ''}`]"
      @dblclick="onDoubleClick"
    >
      <div class="node-content">
        <span v-if="showLabelInput">
          <form @submit.prevent="handleLabelSubmit">
            <input
              type="text"
              v-model.trim="label"
              placeholder="Enter new label name"
            /></form
        ></span>
        <span v-else> {{ label || nodeId }}</span>
      </div>

      <button class="trash-btn" v-if="showButtons" @click="handleDeleteNode">
        <Icon name="trash" class="delete-icon" />
      </button>

      <div class="line-container" v-if="showButtons">
        <div class="line-one">
          <button class="btn-add">
            <Icon
              name="circle"
              class="circle-icon"
              @click.stop="addChildrenNode"
            />
          </button>
        </div>
        <div class="line-two">
          <button class="btn-add">
            <Icon
              name="multiple"
              class="multiple-icon"
              @click.stop="add2ChildrenNode"
            />
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- <Handle id="a" type="target" :position="Position.Right" /> -->
</template>

<style scoped>
.node {
  margin: 0;
  position: relative;

  width: fit-content;
  background-color: #ddd;
  border: none;
  border-radius: 10px;
  font-size: 24px;
}

.hasSibling {
  background-color: blueviolet;
}

.node-content {
  padding: 10px 20px;
  margin: 0;
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

.trash-btn {
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(-50%, -50%);
}

.delete-icon {
  height: 18px;
  cursor: pointer;
  position: absolute;
  background-color: #ddd;
  border: 1px solid black;

  padding: 2px;
  border-radius: 10px;
}

.delete-icon:hover {
  box-shadow: 1px 1px 10px 0 rgba(0, 0, 0, 0.7);
}
</style>
