<script setup>
import {
  useVueFlow,
  useNodeId,
  useHandleConnections,
  MarkerType,
  Position,
  Handle,
} from "@vue-flow/core";

import { computed, onMounted, ref, inject, watch } from "vue";
import Icon from "./../Icon.vue";

import { useNodeDeletion } from "../../composables/useNodeDeletion";
import { useNodeAddition } from "@/composables/useNodeAddition";
import { useVueFlowHelper } from "@/composables/helpers/useVueFlowHelper";
import { generateRandomColor } from "@/composables/helpers/randomColor";

const props = defineProps({
  //To resolve warning , we input extra elements too
  position: Object,
  type: String,
  label: String,
  data: Object,
  id: String,
  events: Object,
  selected: Boolean,
  resizing: Boolean,
  dragging: Boolean,
  connectable: Boolean,
  dimensions: Object,
  isValidTargetPos: Boolean,
  isValidSourcePos: Boolean,
  parent: Object,
  parentNodeId: String,
  zIndex: Number,
  targetPosition: String,
  sourcePosition: String,
  dragHandle: String,
});

const emit = defineEmits(["updateNodeInternals"]); //To resolve the warning

const nodeId = useNodeId();

const allGotoEdgesArray = inject("allGotoEdgesArray");

const toUpdate = ref(true);

const connectedGotos = ref([]);

watch(toUpdate, () => {
  connectedGotos.value = allGotoEdgesArray
    .filter((edge) => edge.source === nodeId)
    .map((edge) => edge.id);
});

const { getImmediateParents, getImmediateChildren, getParentsForGotoOptions } =
  useVueFlowHelper();

const { deleteNode } = useNodeDeletion();
const { addOneChild, addMultipleChild } = useNodeAddition();

const showButtons = ref(false);

//Node vitra
const nodeTitleInput = ref(null);
const nodeTitleText = ref(props.label);
const inputWho = ref(props.data.assignedTo);
const gotoId = ref("");
const gotoOptions = computed(() => getParentsForGotoOptions(nodeId));
const showQuestion = ref(!Boolean(props.data.assignedTo));

const { getNodes, updateNode, updateNodeData, findNode, addEdges, findEdge } =
  useVueFlow();

const offset = ref(0);

const endNode = getNodes.value.filter((node) => node.id === "end");
const endNodeYPosition = endNode[0].position.y;

if (endNodeYPosition - props.position.y < 250) {
  offset.value = endNodeYPosition - props.position.y;
}

const outgoingEdgesOfClickedNode = useHandleConnections({
  type: "source",
  nodeId,
});

function addChildNode() {
  addOneChild(nodeId, outgoingEdgesOfClickedNode, offset, props);
}

function add2ChildrenNode() {
  addMultipleChild(outgoingEdgesOfClickedNode, nodeId, props);
}

const handleDeleteNode = () => deleteNode(nodeId);

function handleDone() {
  showQuestion.value = !showQuestion.value;
  const assignedTo = inputWho.value;
  updateNodeData(nodeId, { assignedTo, showQuestion: showQuestion.value });
  console.log(findNode(nodeId).data);
}

//to focus on the title of process node.
onMounted(() => {
  setTimeout(() => {
    if (nodeTitleInput.value) {
      nodeTitleInput.value.focus();
    }
  }, 100);
});

function handleNodeTitleChange(e) {
  console.log("change", e.target.value);
  updateNode(nodeId, { label: e.target.value });
  console.log("node", findNode(nodeId));
}

function showImmediateParents() {
  console.log(
    "immediate parents",
    getImmediateParents(nodeId).map((node) => node.id)
  );
  console.log("goto Options", getParentsForGotoOptions(nodeId));
}

function showImmediateChildren() {
  console.log("clicked");
  console.log(getImmediateChildren(nodeId));
}

function onGotoIdChange(e) {
  if (e.target.value === "none") return;
  toUpdate.value = !toUpdate.value;

  gotoId.value = e.target.value;
  const newGotoId = (Math.random() * 100).toFixed(3);
  const randomColor = generateRandomColor();

  addEdges({
    id: `goto-${newGotoId}`,
    label: `goto-${newGotoId}`,
    source: nodeId, //nodeId = useNodeId()
    type: "smoothstep",
    target: gotoId.value,
    style: { stroke: randomColor, strokeWidth: 2 },
    markerEnd: MarkerType.ArrowClosed,
    targetHandle: "a",
    animated: true,
  });

  allGotoEdgesArray.push(findEdge(`goto-${newGotoId}`));
}
</script>

<template>
  <div
    class="child-node"
    @mouseenter="showButtons = true"
    @mouseleave="showButtons = false"
  >
    <Handle class="handle-at-top" type="target" :position="Position.Top" />
    <Handle
      class="handle-at-right"
      id="a"
      type="target"
      :position="Position.Right"
    />
    <Handle
      class="handle-at-bottom"
      type="source"
      :position="Position.Bottom"
    />

    <div
      class="node"
      @click="showImmediateParents"
      @dblclick="showImmediateChildren"
    >
      <div class="absolute-p">
        {{ nodeId }}
      </div>
      <div class="node-content">
        <div class="node-title">
          <div class="title-icon">
            <Icon name="messageText" class="message-text" />
          </div>
          <input
            class="title-text"
            ref="nodeTitleInput"
            v-model="nodeTitleText"
            @input="handleNodeTitleChange"
          />
        </div>

        <div v-if="showQuestion">
          <p class="question">Who can provide input?</p>
          <input
            type="text"
            id="inputWho"
            v-model="inputWho"
            placeholder="Start typing..."
          />

          <div class="goto-select">
            <label for="gotoid">Goto</label>
            <select
              v-model="gotoId"
              class="goto-id"
              id="gotoid"
              placeholder="Select node here..."
              @change="onGotoIdChange"
            >
              <option disabled value="" class="default-option">
                Select the node
              </option>
              <option
                v-for="node in gotoOptions"
                :key="node.id"
                :value="node.id"
              >
                {{ node.label || `Branch ${node.data.branchName}` }}
              </option>
              <option value="none">None</option>
            </select>
          </div>

          <div class="goto-edge-container">
            <div v-for="edge in connectedGotos">{{ edge }}</div>
          </div>
        </div>
        <div v-else>
          <p class="assigned">Assigned to: {{ inputWho || "none" }}</p>
        </div>
      </div>

      <div class="node-footer">
        <div class="btns">
          <button class="node-btn btn-done" @click="handleDone">
            {{ showQuestion ? "Done" : "Change" }}
          </button>
        </div>
      </div>

      <button class="trash-btn" @click="handleDeleteNode">
        <Icon name="trash" class="delete-icon" />
      </button>

      <div class="extended-handle">
        <strong>+</strong>
      </div>

      <div class="line-container" v-if="showButtons">
        <div class="line-one">
          <button class="btn-add">
            <Icon
              name="circle"
              class="circle-icon"
              @click.stop="addChildNode"
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
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
  background-color: #fff;
  border: none;
  border-radius: 4px;
  width: 322px;
}

.node-content {
  padding: 10px 10px;
  margin: 0;
}

.node-title {
  display: flex;
  gap: 8px;
  align-items: center;
}

.title-icon {
  height: 24px;
  width: 24px;
  fill: purple;
}

.title-text {
  border: none;
  color: purple;
  font-size: 20px;
}

.title-text:focus {
  outline: none;
  cursor: default;
}

.question,
.assigned {
  font-size: 16px;
  margin: 18px 0 14px 0;
}

#inputWho {
  width: 90%;
  border: none;
  border-bottom: 2px solid gray;
  padding-bottom: 6px;
  font-size: 18px;
  outline: none;
}

/* gotoId Input  */

.goto-select {
  margin-top: 24px;
}

.goto-select select {
  padding: 4px;
  font-size: large;
}

.goto-select label {
  margin-right: 6px;
  font-size: 20px;
}

.goto-select option {
  font-size: 16px;
}

.default-option {
  opacity: 0.5;
}

.goto-id {
  border: none;
  background: transparent;
  outline: none;
  border-bottom: 1px dashed gray;
}

.goto-edge-container {
  display: flex;
  gap: 4px;
}

button {
  background: none;
  border: none;
}

.extended-handle {
  height: 24px;
  width: 24px;
  background-color: #c0c0c0;
  color: white;
  border-radius: 100%;
  transform: translate(-50%, 10%);

  position: absolute;
  left: 50%;
  bottom: -24px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.extended-handle strong {
  padding: 24px;
  border-radius: 100%;
}

.line-container {
  position: absolute;
  bottom: 0;
  left: 50%;
  bottom: -12px;

  transform: translate(-50%, 36px);

  display: flex;
  z-index: -1;
}

.btn-add {
  cursor: pointer;
}

.line-one {
  height: 24px;
  width: 32px;
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
  stroke-width: 4;
}

.line-two {
  height: 24px;
  width: 32px;
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

.trash-btn {
  position: absolute;
  top: 6px;
  right: 18px;
  transform: translate(-50%, -50%);
}

.delete-icon {
  height: 24px;
  cursor: pointer;
  position: absolute;
  fill: #777;
}

.delete-icon:hover {
  fill: #000;
}

/* Node footer  */

.node-footer {
  margin-top: 6px;
  padding: 4px 0;
  border-top: 1px solid #808080;
}

.btns {
  text-align: end;
  padding: 6px 4px;
}

.node-btn {
  cursor: pointer;
  font-size: 14px;
  color: #808080;
  text-transform: uppercase;
  text-align: end;
  letter-spacing: 1px;
}

.node-btn:hover {
  font-weight: bold;
}

/* Handles */

.handle-at-top,
.handle-at-bottom,
.handle-at-right {
  opacity: 0;
}

/* Modal form appearing before adding nodes */
.modal {
  position: absolute;
  left: 10px;
  background-color: #b8df81;
  border-radius: 10px;
  padding: 0 4px;
  box-shadow: 1px 1px 2px 0 rgba(0, 0, 0, 0.7);
  z-index: 10;
  width: min-content;
}

.modal-content {
  padding: 6px;
}

.modal-close {
  text-align: end;
}

.modal-close-btn {
  font-weight: 600;
  font-size: 24px;
  color: red;
  cursor: pointer;
}

.modal-form p {
  margin: 0;
}

.modal-form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 24px;
}

.input-select,
.input-label {
  padding: 4px;
  border-radius: 5px;
  border: 1px solid;
  outline: none;
}

.absolute-p {
  font-size: 12px;
}
</style>
