<script setup>
import { useVueFlow, useNodeId, useHandleConnections } from "@vue-flow/core";

import { onBeforeMount, onMounted, ref } from "vue";
import Icon from "./../Icon.vue";

import { useNodeDeletion } from "../../composables/useNodeDeletion";
import { useNodeAddition } from "@/composables/useNodeAddition";
import { useVueFlowHelper } from "@/composables/helpers/useVueFlowHelper";

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

const showButtons = ref(false);

//Node vitra
const nodeTitleInput = ref(null);
const nodeTitleText = ref("Manager Approval");
const inputWho = ref("");
const showQuestion = ref(true);

//Modal that popups up on clicking extended-handle
const showModal = ref(false);
const show2InputModal = ref(false);
const inputNodeType1 = ref("");
const inputLabel1 = ref("");
const inputNodeType2 = ref("");
const inputLabel2 = ref("");
const clickedBtn = ref("");

const { getNodes, updateNode } = useVueFlow();

const { deleteNode } = useNodeDeletion();
const { addOneChild, addMultipleChild } = useNodeAddition();
const { hasMoreThanEqual2ChildNoGoTo } = useVueFlowHelper();

const offset = ref(0);

const showLabelInput = ref(false);
const label = ref(props.label);
const password = ref("");

const nodeId = useNodeId();

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

function onDoubleClick() {
  showLabelInput.value = true;
}

function handleLabelSubmit() {
  showLabelInput.value = false;
  updateNode(nodeId, { label: label.value });
}

const handleDeleteNode = () => deleteNode(nodeId);

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

function handleDone() {
  showQuestion.value = !showQuestion.value;
}

onMounted(() => {
  setTimeout(() => {
    if (nodeTitleInput.value) {
      nodeTitleInput.value.focus();
    }
  }, 100);
});
</script>

<template>
  <div
    class="child-node"
    @mouseenter="showButtons = true"
    @mouseleave="showButtons = false"
  >
    <!-- 1.// For being the target of previous node -->
    <!-- <Handle id="b" type="target" :position="Position.Top" /> -->

    <div class="node" @dblclick="onDoubleClick">
      <div class="node-content">
        <div class="node-title">
          <div class="title-icon">
            <Icon name="messageText" class="message-text" />
          </div>
          <input
            class="title-text"
            ref="nodeTitleInput"
            v-model="nodeTitleText"
          />
          <p class="absolute-dev">{{ nodeId }}</p>
        </div>

        <div v-if="showQuestion">
          <p class="question">Who can provide input?</p>
          <input
            type="text"
            id="inputWho"
            v-model="inputWho"
            placeholder="Start typing..."
          />
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
  <!-- <Handle id="a" type="target" :position="Position.Right" /> -->

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
            <option value="managerbranch">Manager Branch Node</option>
            <option value="process">Process Node</option>
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
            <option value="managerbranch">Manager Branch Node</option>
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
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
  width: fit-content;
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
  bottom: -36px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.line-container {
  position: absolute;
  bottom: 0;
  left: 50%;
  bottom: -22px;

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

.absolute-dev {
  position: absolute;
  top: 0;
  font-size: 12px;
}
</style>
