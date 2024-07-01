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

const { getNodes, addNodes } = useVueFlow();

const offset = ref(0);
const showButtons = ref(false);
const showDescription = ref(false);

const showModal = ref(false);
const show2InputModal = ref(false);
const inputNodeType1 = ref("");
const inputLabel1 = ref("");
const inputNodeType2 = ref("");
const inputLabel2 = ref("");
const clickedBtn = ref("");

const { addOneChild, addMultipleChild } = useNodeAddition();
const { hasMoreThanEqual2ChildNoGoTo, getAllDescendants, updateView } =
  useVueFlowHelper();

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

const outgoingEdgesOfClickedNode = useHandleConnections({
  type: "source",
  nodeId,
});

function addChildNode() {
  addOneChild(nodeId, outgoingEdgesOfClickedNode, offset, props);
  updateView("add");
}

function add2ChildrenNode() {
  addMultipleChild(outgoingEdgesOfClickedNode, nodeId, props);
  updateView("add");
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

  clickedBtn.value === "single" || hasMoreThanEqual2ChildNoGoTo(nodeId)
    ? (showModal.value = true)
    : (show2InputModal.value = showModal.value = true);
}

function handleModalSubmit() {
  clickedBtn.value === "single" ? addChildNode() : add2ChildrenNode();

  closeModalForm();
}

function handleChevron() {
  showDescription.value = !showDescription.value;

  if (showDescription.value) {
    getAllDescendants(nodeId).forEach((node) => {
      const newNode = {
        ...node,
        position: {
          ...node.position,
          y: node.position.y + 72,
        },
      };
      addNodes(newNode);
    });
  } else {
    getAllDescendants(nodeId).forEach((node) => {
      const newNode = {
        ...node,
        position: {
          ...node.position,
          y: node.position.y - 72,
        },
      };
      addNodes(newNode);
    });
  }
}
</script>

<template>
  <div
    class="managerbranch-node"
    @mouseenter="showButtons = true"
    @mouseleave="showButtons = false"
  >
    <div class="node">
      <div class="arrowhead">
        <p class="node-title">Manager Branch</p>
        <p class="task">Execute: Always</p>
        <p>
          <Icon
            :name="showDescription ? 'chevronUp' : 'chevronDown'"
            :title="showDescription ? 'Hide Description' : 'Show Description'"
            class="btn-chevron-down"
            @click="handleChevron"
          />
        </p>

        <div class="node-description" v-show="showDescription">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quibusdam
          aut quidem totam cumque laboriosam eaque iusto dicta facere iste odio.
        </div>
      </div>

      <div class="button"></div>

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

  <Handle class="handle-at-top" type="target" :position="Position.Top" />
  <Handle
    class="handle-at-right"
    id="a"
    type="target"
    :position="Position.Right"
  />
  <Handle class="handle-at-bottom" type="source" :position="Position.Bottom" />

  <!-- Modal to get the type and label of node that is going to be added -->
</template>

<style scoped>
.node {
  margin: 0;
  width: fit-content;
  border-radius: 4px;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
  position: relative;
  color: #fff;
}

.node-title {
  padding-top: 24px;
  font-size: 16px;
  margin-bottom: 16px;
}

.arrowhead .task {
  font-size: 14px;
  font-weight: normal;
  margin-bottom: 16px;
}

.arrowhead {
  position: relative;
  background-color: #badefb;
  width: 322px;
  text-align: center;
  color: black;
  font-family: Arial, sans-serif;
  font-weight: bold;
  border-radius: 4px;
}

.arrowhead:after {
  content: "";
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 160px solid transparent;
  border-right: 160px solid transparent;
  border-top: 20px solid #badefb;
}

.btn-chevron-down {
  cursor: pointer;
  height: 36px;
  fill: #357e77;
}

.btn-chevron-down:hover {
  fill: #204c47;
}

.node-description {
  padding: 0 18px 8px;
  font-size: 14px;
  font-weight: 400;
  text-align: justify;
}

.btns {
  text-align: center;
  padding: 6px 4px;
}

.node-btn {
  cursor: pointer;
  font-size: 14px;
  color: white;
  text-transform: uppercase;
  text-align: end;
  letter-spacing: 1px;
}

.node-btn:hover {
  font-weight: bold;
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
  height: 24px;
  width: 24px;
  background-color: #c0c0c0;
  border-radius: 100%;
  transform: translate(-50%, 10%);

  position: absolute;
  left: 50%;
  bottom: -48px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.line-container {
  position: absolute;
  bottom: 0;
  left: 50%;
  bottom: -32px;

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
</style>
