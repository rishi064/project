<script setup>
import { inject, ref } from "vue";
import {
  useVueFlow,
  useNodeId,
  useHandleConnections,
  Position,
  MarkerType,
} from "@vue-flow/core";

import Icon from "../Icon.vue";
import { useNodeAddition } from "@/composables/useNodeAddition";
import { useVueFlowHelper } from "@/composables/helpers/useVueFlowHelper";

const { addEdges, getNodes, findNode, findEdge } = useVueFlow();
const { addOneChild, addMultipleChild } = useNodeAddition();
const { hasMoreThanEqual2ChildNoGoTo } = useVueFlowHelper();

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

const allGotoEdgesArray = inject("allGotoEdgesArray");

const showModal = ref(false);
const show2InputModal = ref(false);
const inputNodeType1 = ref("");
const inputLabel1 = ref("");
const inputNodeType2 = ref("");
const inputLabel2 = ref("");
const clickedBtn = ref("");

const nodeId = useNodeId();
const gotoId = ref(undefined);
const showButtons = ref(false);

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
  addOneChild(
    nodeId,
    outgoingEdgesOfClickedNode,
    offset,
    props,
    inputNodeType1.value,
    inputLabel1.value
  );
}

function add2ChildrenNode() {
  addMultipleChild(
    inputNodeType1.value,
    inputNodeType2.value,
    inputLabel1.value,
    inputLabel2.value,
    outgoingEdgesOfClickedNode,
    nodeId,
    props
  );
}

function closeModalForm() {
  inputNodeType1.value =
    inputLabel1.value =
    inputNodeType2.value =
    inputLabel2.value =
      "";

  showModal.value = show2InputModal.value = false;
}

function handleShowModal(clicked) {
  clickedBtn.value = clicked;
  console.log("clicked btn", clickedBtn.value);
  console.log(hasMoreThanEqual2ChildNoGoTo(nodeId));

  clickedBtn.value === "single" || hasMoreThanEqual2ChildNoGoTo(nodeId)
    ? (showModal.value = true)
    : (show2InputModal.value = showModal.value = true);
}

function handleModalSubmit() {
  console.log(
    inputNodeType2.value,
    inputNodeType1.value,
    inputLabel1.value,
    inputLabel2.value
  );
  clickedBtn.value === "single" ? addChildNode() : add2ChildrenNode();

  closeModalForm();
}

//for gotoId
function handleSubmit() {
  const allNodeIDs = getNodes.value.map((node) => node.id);
  console.log("getting nodes", findNode(gotoId.value));

  if (allNodeIDs.includes(gotoId.value)) {
    const newGotoId = (Math.random() * 100).toFixed(3);
    addEdges({
      id: `goto-${newGotoId}`,
      label: `goto-${newGotoId}`,
      source: nodeId, //nodeId = useNodeId()
      type: "smoothstep",
      target: gotoId.value,
      style: { stroke: "red", strokeWidth: 4 },
      markerEnd: MarkerType.ArrowClosed,
      targetHandle: "a",
    });

    allGotoEdgesArray.push(findEdge(`goto-${newGotoId}`));
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
    <p class="decision-node-label">Decision {{ props.label }}{{ props.id }}</p>
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
          <Icon
            name="circle"
            class="circle-icon"
            @click="handleShowModal('single')"
          />
        </button>
      </div>
      <div class="line-two">
        <button class="btn-add">
          <Icon
            name="multiple"
            class="multiple-icon"
            @click="handleShowModal('multiple')"
          />
        </button>
      </div>
    </div>
  </div>

  <div class="modal" v-if="showModal">
    <div class="modal-close">
      <button class="modal-close-btn" @click="closeModalForm">&times;</button>
    </div>
    <div class="modal-content">
      <form
        @submit.prevent="handleModalSubmit"
        :class="{ 'modal-form': show2InputModal }"
      >
        <div>
          <p v-if="show2InputModal">For 1st node</p>
          <select required class="input-select" v-model.trim="inputNodeType1">
            <option value="">Select nodetype ...</option>
            <option value="decision">Decision Node</option>
            <option value="child">Child Node</option>
          </select>
          <input
            type="text"
            placeholder="Enter label ..."
            class="input-label"
            v-model.trim="inputLabel1"
            required
          />
        </div>
        <div v-if="show2InputModal">
          <p>For 2nd node</p>
          <select required class="input-select" v-model.trim="inputNodeType2">
            <option value="">Select nodetype ...</option>
            <option value="decision">Decision Node</option>
            <option value="child">Child Node</option>
          </select>
          <input
            type="text"
            placeholder="Enter label ..."
            class="input-label"
            v-model.trim="inputLabel2"
            required
          />
        </div>
        <button type="submit" class="btn-submit">ADD</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.goto-input {
  width: 80px;
}

.decision-node {
  margin: 0;
  position: relative;
  background-color: bisque;
  border-radius: 10px;
  padding: 10px;
  font-size: 24px;
  width: 130px;
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

/* Modal form appearing before adding nodes */
.modal {
  position: absolute;
  left: 10px;
  background-color: #b8df81;
  border-radius: 10px;
  padding: 0 4px;
  box-shadow: 1px 1px 2px 0 rgba(0, 0, 0, 0.7);
  z-index: 10;
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
</style>
