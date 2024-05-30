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

const showButtons = ref(false);

const { getNodes, addNodes, addEdges, removeEdges, getOutgoers } = useVueFlow();

const props = defineProps(["data", "label", "position"]);

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
      },
      {
        id: `end-edge`,
        label: "end-edge",
        type: "straight",
        source: `node-${newChildNodeId}`,
        target: "end",
        animated: true,
        markerEnd: MarkerType.ArrowClosed,
      },
    ]);
  } else {
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
        source: nodeId,
        target: `node-${newChildNodeId}`,
        animated: true,
        markerEnd: MarkerType.ArrowClosed,
        style: { strokeWidth: 2 },
      },
    ]);

    if (!outgoerIds.includes("end")) {
      outgoerIds.forEach((value) => {
        addEdges({
          id: `edge-${(Math.random() * 1000).toFixed(5)}`,
          label: `edge-${(Math.random() * 1000).toFixed(5)}`,
          type: "default",
          source: `node-${newChildNodeId}`,
          target: value,
          animated: true,
          markerEnd: MarkerType.ArrowClosed,
        });
      });
    }

    removeEdges([...outgoingEdgesId]);

    let goerIds = getOutgoers(nodeId).map((node) => node.id);
    while (!goerIds.includes("end")) {
      const tempNodes = getOutgoers(goerIds[0]);
      tempNodes.forEach((tempNode) => {
        addNodes({
          id: tempNode.id,
          label: tempNode.id === "end" ? "Stop" : tempNode.id,
          type: tempNode.id === "end" ? "output" : "child",
          position: { x: tempNode.position.x, y: tempNode.position.y + 250 },
        });
        goerIds[0] = tempNode.id;
      });
    }
  }
}

function add2ChildrenNode() {
  // specifically scope to the event
  // console.log(outgoingEdgesOfClickedNode.value);
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
      },
      {
        id: `node-${nodeIdForNewChildNode2}`,
        label: `node-${nodeIdForNewChildNode2}`,
        type: "child",
        position: { x: props.position.x + 200, y: props.position.y + 125 },
      },
      {
        id: `handle-${nodeIdForNewHandleNode}`,
        label: `handle-${nodeIdForNewHandleNode}`,
        type: "child",
        position: { x: props.position.x, y: props.position.y + 250 },
      },
    ]);

    const handleNodePositionY = getNodes.value.find(
      (node) => node.id === `handle-${nodeIdForNewHandleNode}`
    ).position.y;
    const offset = endNodeYPosition - handleNodePositionY;

    // const handleNode = getNodes.value.find(
    //   (node) => node.id === `handle-${nodeIdForNewHandleNode}`
    // );
    // console.log("handleNode", handleNode);

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
        });
      });

      //Logic of redrawing every child[Outgoing] node
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
            type: tempNode.id === "end" ? "output" : "child",
            position: { x: tempNode.position.x, y: tempNode.position.y + 250 },
          });

          goerIds[0] = tempNode.id;
        });
      }
    }
  } else {
    console.log("multiple outgoers po xan ta");
    console.log("clicked node", nodeId);

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

    const targetHandleid = getOutgoers(getOutgoers(nodeId)[0].id)[0].id;

    addEdges([
      {
        id: `edge-${edgeNewtoCur}`,
        label: `edge-${edgeNewtoCur}`,
        type: "straight",
        source: nodeId,
        target: `node-${newNode}`,
        animated: true,
        markerEnd: MarkerType.ArrowClosed,
      },
      {
        id: `edge-${curToHandle}`,
        label: `edge-${curToHandle}`,
        type: "default",
        source: `node-${newNode}`,
        target: targetHandleid,
        animated: true,
        markerEnd: MarkerType.ArrowClosed,
      },
    ]);
  }
}
</script>

<template>
  <div
    class="child-node"
    @mouseenter="showButtons = true"
    @mouseleave="showButtons = false"
  >
    <!-- 1.// For being the target of previous node -->
    <!-- <Handle id="b" type="target" :position="Position.Top" /> -->

    <div class="node">
      <p class="node-content">{{ props.label }}</p>

      <div class="line-container" v-show="showButtons">
        <div class="line-one">
          <button class="btn-add">
            <Icon name="circle" class="circle" @click="addChildrenNode" />
          </button>
        </div>
        <div class="line-two">
          <button class="btn-add">
            <Icon name="multiple" class="multiple" @click="add2ChildrenNode" />
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

.node-content {
  padding: 10px 20px;
  margin: 0;
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

.circle {
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

.multiple {
  height: 36px;
  position: absolute;
  bottom: 0;

  transform: translate(50%, 65%) rotate(75deg);
}
</style>
