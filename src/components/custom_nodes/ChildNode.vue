<script setup>
import {
  useVueFlow,
  useNodeId,
  useHandleConnections,
  MarkerType,
  Handle,
  Position,
} from "@vue-flow/core";

import { ref } from "vue";
import Icon from "./../Icon.vue";

import { generateRandomColor } from "@/composables/helpers/randomColor";
import { useVueFlowHelper } from "../../composables/helpers/useVueFlowHelper";
import { useNodeDeletion } from "../../composables/useNodeDeletion";

const showButtons = ref(false);

const {
  getNodes,
  addNodes,
  addEdges,
  removeEdges,
  getOutgoers,
  findNode,
  updateNodeData,
  updateNode,
} = useVueFlow();

const props = defineProps(["data", "label", "position"]);
console.log(props.data);

const {
  hasSiblingNode,
  hasMoreThanEqual2Sibling,
  isHandleDirectChild,
  getAllDescendants,
} = useVueFlowHelper();

const { deleteNode } = useNodeDeletion();

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

const incomingedgetoLastNode = useHandleConnections({
  type: "target",
  nodeId: "end",
});

function updateEndNodePosition(newYPosition) {
  addNodes({
    id: "end",
    type: "output",
    label: "Stop",
    position: { x: 400, y: newYPosition },
  });
}

function addChildrenNode() {
  const outgoerIds = getOutgoers(nodeId).map((node) => node.id);
  console.log("outgoerIds", outgoerIds);
  const outgoingEdgesId = outgoingEdgesOfClickedNode.value.map(
    (edge) => edge.edgeId
  );

  const endNode = getNodes.value.find((node) => node.id === "end");
  const endNodeYPosition = endNode.position.y;

  if (outgoerIds.includes("end")) {
    removeEdges([...outgoingEdgesId]);

    offset.value = endNodeYPosition - props.position.y;

    if (offset.value < 251) {
      updateEndNodePosition(endNodeYPosition + 250);
    }

    const newChildNodeId = (Math.random() * 1000).toFixed(2);
    addNodes({
      id: `node-${newChildNodeId}`,
      label: `node-${newChildNodeId}`,
      type: "child",
      position: { x: props.position.x, y: props.position.y + 250 },
    });

    addEdges([
      {
        id: `edge-${(Math.random() * 1000).toFixed(3)}`,
        label: `edge-${(Math.random() * 1000).toFixed(3)}`,
        type: "straight",
        source: nodeId,
        target: `node-${newChildNodeId}`,
        animated: true,
        markerEnd: MarkerType.ArrowClosed,
        style: { stroke: generateRandomColor() },
      },
      {
        id: `end-edge`,
        label: "end-edge",
        type: "straight",
        source: `node-${newChildNodeId}`,
        target: "end",
        animated: true,
        markerEnd: MarkerType.ArrowClosed,
        style: { stroke: generateRandomColor() },
      },
    ]);
  } else {
    const newChildNodeId = (Math.random() * 1000).toFixed(2);
    console.log("newChildNodeId", newChildNodeId);
    console.log("outgoerIds", outgoerIds);
    addNodes({
      id: `node-${newChildNodeId}`,
      label: `node-${newChildNodeId}`,
      type: "child",
      position: { x: props.position.x, y: props.position.y + 250 },
    });

    addEdges([
      {
        id: `edge-${(Math.random() * 1000).toFixed(3)}`,
        label: `edge-${(Math.random() * 1000).toFixed(3)}`,
        source: nodeId,
        target: `node-${newChildNodeId}`,
        animated: true,
        markerEnd: MarkerType.ArrowClosed,
        style: { stroke: generateRandomColor() },
        style: { strokeWidth: 2 },
      },
    ]);

    if (!outgoerIds.includes("end")) {
      outgoerIds.forEach((value) => {
        console.log("value", value);
        addEdges({
          id: `edge-${(Math.random() * 1000).toFixed(5)}`,
          label: `edge-${(Math.random() * 1000).toFixed(5)}`,
          type: "default",
          source: `node-${newChildNodeId}`,
          target: value,
          animated: true,
          markerEnd: MarkerType.ArrowClosed,
          style: { stroke: generateRandomColor() },
        });
      });
    }

    removeEdges([...outgoingEdgesId]);

    let goerIds = getOutgoers(nodeId).map((node) => node.id);
    while (!goerIds.includes("end")) {
      const tempNodes = getOutgoers(goerIds[0]);
      tempNodes.forEach((tempNode) => {
        console.log("tempNode", tempNode);
        addNodes({
          id: tempNode.id,
          label: tempNode.label,
          type: tempNode.type, //here is the problem
          position: { x: tempNode.position.x, y: tempNode.position.y + 250 },
        });
        goerIds[0] = tempNode.id;
      });
    }
  }
}

function add2ChildrenNode() {
  // specifically scope to the event
  const outgoingEdgesOfClickedNodeIds = outgoingEdgesOfClickedNode.value.map(
    (edge) => edge.edgeId
  );

  const outgoerIds = getOutgoers(nodeId).map((element) => element.id);

  if (outgoerIds.length < 2) {
    outgoerIds.includes("end")
      ? removeEdges(["end-edge"])
      : removeEdges([...outgoingEdgesOfClickedNodeIds]);

    const nodeIdForNewChildNode1 = (Math.random() * 1000).toFixed(3);
    const nodeIdForNewChildNode2 = (Math.random() * 1000).toFixed(3);
    const nodeIdForNewHandleNode = (Math.random() * 1000).toFixed(3);

    addNodes([
      {
        id: `node-${nodeIdForNewChildNode1}`,
        label: `node-${nodeIdForNewChildNode1}`,
        type: "child",
        position: { x: props.position.x - 200, y: props.position.y + 125 },
        data: { hasSibling: true },
      },
      {
        id: `node-${nodeIdForNewChildNode2}`,
        label: `node-${nodeIdForNewChildNode2}`,
        type: "child",
        position: { x: props.position.x + 200, y: props.position.y + 125 },
        data: { hasSibling: true },
      },
      {
        id: `handle-${nodeIdForNewHandleNode}`,
        label: `handle-${nodeIdForNewHandleNode}`,
        type: "handle",
        position: { x: props.position.x, y: props.position.y + 250 },
      },
    ]);

    updateNodeData(nodeId, {
      idHandleToAddMultiple: `handle-${nodeIdForNewHandleNode}`,
    });

    console.log(findNode(nodeId));

    const handleNodePositionY = getNodes.value.find(
      (node) => node.id === `handle-${nodeIdForNewHandleNode}`
    ).position.y;
    const offset = endNodeYPosition - handleNodePositionY;

    //it would re-render the node. won't have to worry of first removing the node before doing it.
    offset < 251 &&
      addNodes({
        id: "end",
        type: "output",
        label: "Stop",
        position: { x: 310, y: endNodeYPosition + 250 + Math.abs(offset) },
      });

    const edgeIdForNewEdge1 = (Math.random() * 1000).toFixed(4);
    const edgeIdForNewEdge2 = (Math.random() * 1000).toFixed(4);

    const edgeIdForNewEndEdge1 = (Math.random() * 1000).toFixed(5);
    const edgeIdForNewEndEdge2 = (Math.random() * 1000).toFixed(5);
    const randColor1 = generateRandomColor();
    const randColor2 = generateRandomColor();

    addEdges([
      //first childnode to current node
      {
        id: `edge-${edgeIdForNewEdge1}`,
        label: `edge-${edgeIdForNewEdge1}`,
        type: "straight",
        source: nodeId,
        target: `node-${nodeIdForNewChildNode1}`,
        animated: true,
        markerEnd: MarkerType.ArrowClosed,
        style: { stroke: randColor1 },
      },
      //second childnode to current node
      {
        id: `edge-${edgeIdForNewEdge2}`,
        label: `edge-${edgeIdForNewEdge2}`,
        type: "straight",
        source: nodeId,
        target: `node-${nodeIdForNewChildNode2}`,
        animated: true,
        markerEnd: MarkerType.ArrowClosed,
        style: { stroke: randColor2 },
      },
      //first childnode to handle node
      {
        id: `handle-edge-${edgeIdForNewEndEdge1}`,
        label: `handle-edge-${edgeIdForNewEndEdge1}`,
        type: "default",
        source: `node-${nodeIdForNewChildNode1}`,
        target: `handle-${nodeIdForNewHandleNode}`,
        animated: true,
        markerEnd: MarkerType.ArrowClosed,
        style: { stroke: randColor1 },
      },
      //second childnode to handle node
      {
        id: `handle-edge-${edgeIdForNewEndEdge2}`,
        label: `handle-edge-${edgeIdForNewEndEdge2}`,
        type: "default",
        source: `node-${nodeIdForNewChildNode2}`,
        target: `handle-${nodeIdForNewHandleNode}`,
        animated: true,
        markerEnd: MarkerType.ArrowClosed,
        style: { stroke: randColor2 },
      },
      //handlenode to end node. addEdge isn't over-written so no need to worry about removing it if the node clicked isn't parent of end edge
      {
        id: "end-edge",
        label: `end-edge`,
        type: "straight",
        source: `handle-${nodeIdForNewHandleNode}`,
        target: "end",
        animated: true,
        markerEnd: MarkerType.ArrowClosed,
        style: { stroke: generateRandomColor() },
      },
    ]);

    // console.log(outgoerIds, outgoerIds.includes("end"));

    if (!outgoerIds.includes("end")) {
      outgoerIds.forEach((value) => {
        const newEdgeHandle = (Math.random() * 1000).toFixed(5);

        addEdges({
          id: `edge-${newEdgeHandle}`,
          label: `edge-${newEdgeHandle}`,
          type: "default",
          source: `handle-${nodeIdForNewHandleNode}`,
          target: value,
          animated: true,
          markerEnd: MarkerType.ArrowClosed,
          style: { stroke: generateRandomColor() },
        });
      });

      //Logic of redrawing every child[Outgoing] node further down
      let goerIds = getNodes.value
        .filter((node) => node.id === `handle-${nodeIdForNewHandleNode}`)
        .map((node) => node.id);
      console.log(goerIds, "outgoer");

      while (!goerIds.includes("end")) {
        const tempNodes = getOutgoers(goerIds[0]); //0 coz numHandle always gonna be 1
        console.log(tempNodes);

        tempNodes.map((tempNode) => {
          //redrawing of nodes(not edges) coz edges will arrange w.r.t. nodes
          addNodes({
            id: tempNode.id,
            label: tempNode.id === "end" ? "Stop" : tempNode.id,
            type: tempNode.type,
            position: { x: tempNode.position.x, y: tempNode.position.y + 250 },
          });

          goerIds[0] = tempNode.id;
        });
      }
    }
  } else {
    console.log("multiple outgoers po xan ta");
    const handleIdToBeConnected = findNode(nodeId).data.idHandleToAddMultiple;
    console.log("handleId", handleIdToBeConnected);
    const newNode = (Math.random() * 1000).toFixed(4);

    const referenceNode = getOutgoers(nodeId)[getOutgoers(nodeId).length - 1];
    console.log("reference node", referenceNode);

    addNodes({
      id: `node-${newNode}`,
      label: `node-${newNode}`,
      type: "child",
      position: {
        x: referenceNode.position.x + 250,
        y: referenceNode.position.y,
      },
    });

    const edgeNewtoCur = (Math.random() * 10000).toFixed(2);
    const curToHandle = (Math.random() * 10000).toFixed(2);
    const randColor = generateRandomColor();

    addEdges([
      {
        id: `edge-${edgeNewtoCur}`,
        label: `edge-${edgeNewtoCur}`,
        type: "straight",
        source: nodeId,
        target: `node-${newNode}`,
        animated: true,
        markerEnd: MarkerType.ArrowClosed,
        style: { stroke: randColor },
      },
      {
        id: `edge-${curToHandle}`,
        label: `edge-${curToHandle}`,
        type: "default",
        source: `node-${newNode}`,
        target: handleIdToBeConnected,
        animated: true,
        markerEnd: MarkerType.ArrowClosed,
        style: { stroke: randColor },
      },
    ]);
  }
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
      :style="{ backgroundColor: data.bgColor }"
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
