<script setup>
import {
  Handle,
  Position,
  useHandleConnections,
  useNodeId,
  useVueFlow,
} from "@vue-flow/core";
import Icon from "../Icon.vue";
import { ref } from "vue";
import { useNodeAddition } from "@/composables/useNodeAddition";
import { useVueFlowHelper } from "@/composables/helpers/useVueFlowHelper";

const { getNodes } = useVueFlow();

const offset = ref(0);
const showButtons = ref(false);

const showModal = ref(false);
const show2InputModal = ref(false);
const inputNodeType1 = ref("");
const inputLabel1 = ref("");
const inputNodeType2 = ref("");
const inputLabel2 = ref("");
const clickedBtn = ref("");

const { addOneChild, addMultipleChild } = useNodeAddition();
const { hasMoreThanEqual2Child } = useVueFlowHelper();

//To resolve warning , we input extra elements too
const props = defineProps({
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

//To resolve the warning
const emit = defineEmits(["updateNodeInternals"]);

const nodeId = useNodeId();

const endNode = getNodes.value.filter((node) => node.id === "end");
const endNodeYPosition = endNode[0].position.y;

if (endNodeYPosition - props.position.y < 250) {
  offset.value = endNodeYPosition - props.position.y;
}

const sourceConnections = useHandleConnections({
  type: "source",
});

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
  console.log(clickedBtn.value);

  clickedBtn.value === "single" || hasMoreThanEqual2Child(nodeId)
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
</script>

<template>
  <div
    class="initiator-node"
    @mouseenter="showButtons = true"
    @mouseleave="showButtons = false"
  >
    <div class="node">
      <div class="node-content">initiator</div>

      <div class="extended-handle">
        <strong>+</strong>
      </div>

      <div class="line-container" v-if="showButtons">
        <div class="line-one">
          <button class="btn-add">
            <Icon
              name="circle"
              class="circle-icon"
              @click.stop="handleShowModal('single')"
            />
          </button>
        </div>
        <div class="line-two">
          <button class="btn-add">
            <Icon
              name="multiple"
              class="multiple-icon"
              @click.stop="handleShowModal('multiple')"
            />
          </button>
        </div>
      </div>
    </div>
  </div>

  <Handle class="handle-at-top" type="target" :position="Position.Top" />
  <Handle id="a" type="target" :position="Position.Right" />
  <Handle class="handle-at-bottom" type="source" :position="Position.Bottom" />

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
.node {
  margin: 0;
  position: relative;

  width: fit-content;
  background-color: #ddd;
  border: none;
  border-radius: 10px;
  font-size: 24px;
}

.node-content {
  background-color: aqua;
  border-radius: 10px;
  font-size: 20px;
  border: 2px solid orange;
  padding: 10px 20px;
  margin: 0;
}

button {
  background: none;
  border: none;
}

form {
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: start;
}

.btn-submit {
  cursor: pointer;
  width: fit-content;
  background-color: orange;
  padding: 5px;
  border-radius: 4px;
}

.extended-handle {
  height: 20px;
  width: 20px;
  background-color: gold;
  border-radius: 4px;
  transform: translate(-50%, 10%);

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

/* Handles  */
.handle-at-top,
.handle-at-bottom {
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
